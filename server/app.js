import Service from "./src/Service.js";
import { config } from "./config/default.js";

const service = new Service(config);

(async () => {
    await service.run();
})().catch(console.error);
