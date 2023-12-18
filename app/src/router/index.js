import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import { auth } from "../firebase";
import SigninView from "../views/Signin.vue";
import PanelView from "../views/Panel.vue";

const routes = [
    {
        path: "/signin",
        name: "signin",
        component: SigninView,
    },
    {
        path: "/",
        name: "panel",
        component: PanelView,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
