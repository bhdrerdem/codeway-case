import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
    Vpc,
    SubnetType,
    SecurityGroup,
    Peer,
    Port,
} from "aws-cdk-lib/aws-ec2";
import {
    Cluster,
    ContainerImage,
    FargateTaskDefinition,
    FargateService,
} from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import {
    ApplicationTargetGroup,
    ApplicationProtocol,
    TargetType,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Role, ServicePrincipal, ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

import { CodewayConfig } from "../config/default";

export interface CodewayStackProps extends StackProps, CodewayConfig {}

export class CodewayInfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: CodewayStackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, "CodewayVpc", {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "codewayPublicSubnet",
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: "codewayPrivateSubnet",
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                },
            ],
        });

        const cluster = new Cluster(this, "CodewayCluster", { vpc });

        const taskSecurityGroup = new SecurityGroup(
            this,
            "CodewayTaskSecurityGroup",
            {
                vpc,
                allowAllOutbound: true,
                description: "Security group for codeway task",
            }
        );

        const albSecurityGroup = new SecurityGroup(
            this,
            "CodewayAlbSecurityGroup",
            {
                vpc,
                allowAllOutbound: true,
                description: "Security group for codeway alb",
            }
        );

        albSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
        albSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443));

        const alb = new ApplicationLoadBalancer(this, "CodewayALB", {
            vpc,
            internetFacing: true,
            securityGroup: albSecurityGroup,
            vpcSubnets: {
                subnets: vpc.publicSubnets,
            },
        });

        const albFrontendListener = alb.addListener("AlbFrontendListener", {
            port: 80,
        });
        const albBackendListener = alb.addListener("AlbBackendListener", {
            port: 3001,
            protocol: ApplicationProtocol.HTTP,
        });

        taskSecurityGroup.addIngressRule(
            albSecurityGroup,
            Port.tcp(80),
            "Allow traffic from ALB to frontend"
        );

        taskSecurityGroup.addIngressRule(
            albSecurityGroup,
            Port.tcp(3001),
            "Allow traffic from ALB to backend"
        );

        const taskExecRole = new Role(this, "CodewayTaskExecutionRole", {
            assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    "service-role/AmazonECSTaskExecutionRolePolicy"
                ),
            ],
        });

        const logGroup = new LogGroup(this, "CodewayLogGroup", {
            retention: RetentionDays.ONE_MONTH,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const taskDefinition = new FargateTaskDefinition(
            this,
            "CodewayTaskDef",
            {
                memoryLimitMiB: 512,
                cpu: 256,
                runtimePlatform: {
                    cpuArchitecture: ecs.CpuArchitecture.ARM64,
                    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
                },
                executionRole: taskExecRole,
            }
        );

        const backendCont = taskDefinition.addContainer("CodewayBackendCont", {
            image: ContainerImage.fromRegistry("bahadirerdem/codeway-backend"),
            environment: {
                SERVER_PORT: props!.backendPort.toString(),
                API_TOKEN: props!.apiToken,
                FIRESTORE_COLLECTION_ID: props!.firestoreCollectionId,
                FIREBASE_PROJECT_ID: props!.firebaseProjectId,
                FIREBASE_PRIVATE_KEY: props!.firebasePrivateKey,
                FIREBASE_CLIENT_EMAIL: props!.firebaseClientEmail,
            },
            logging: ecs.LogDriver.awsLogs({
                streamPrefix: "ecs-backend",
                logGroup: logGroup,
            }),
        });

        const frontendCont = taskDefinition.addContainer(
            "CodewayFrontendCont",
            {
                image: ContainerImage.fromRegistry(
                    "bahadirerdem/codeway-frontend"
                ),
                logging: ecs.LogDriver.awsLogs({
                    streamPrefix: "ecs-frontend",
                    logGroup: logGroup,
                }),
            }
        );

        backendCont.addPortMappings({
            containerPort: props!.backendPort,
            protocol: ecs.Protocol.TCP,
        });

        frontendCont.addPortMappings({
            containerPort: 80,
            protocol: ecs.Protocol.TCP,
        });

        const service = new FargateService(this, "CodewayService", {
            cluster,
            taskDefinition,
            securityGroups: [taskSecurityGroup],
            vpcSubnets: {
                subnets: vpc.privateSubnets,
            },
            assignPublicIp: false,
            desiredCount: 1,
        });

        const frontendTargetGroup = new ApplicationTargetGroup(
            this,
            "frontendTargetGroup",
            {
                vpc,
                port: 80,
                protocol: ApplicationProtocol.HTTP,
                targetType: TargetType.IP,
                healthCheck: {
                    path: "/",
                    port: "80",
                },
            }
        );

        const backendTargetGroup = new ApplicationTargetGroup(
            this,
            "backendTargetGroup",
            {
                vpc,
                port: props!.backendPort,
                protocol: ApplicationProtocol.HTTP,
                targetType: TargetType.IP,
                healthCheck: {
                    path: "/health",
                    port: props!.backendPort.toString(),
                },
            }
        );

        const frontendLBTarget = service.loadBalancerTarget({
            containerName: frontendCont.containerName,
            containerPort: frontendCont.containerPort,
        });

        const backendLBTarget = service.loadBalancerTarget({
            containerName: backendCont.containerName,
            containerPort: backendCont.containerPort,
        });

        frontendTargetGroup.addTarget(frontendLBTarget);
        backendTargetGroup.addTarget(backendLBTarget);

        albFrontendListener.addTargetGroups("AlbFrontendListenerGroups", {
            targetGroups: [frontendTargetGroup],
        });

        albBackendListener.addTargetGroups("AlbBackendListenerGroups", {
            targetGroups: [backendTargetGroup],
        });
    }
}
