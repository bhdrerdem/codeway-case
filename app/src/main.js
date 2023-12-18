import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");

library.add(faUser);
app.component("font-awesome-icon", FontAwesomeIcon);
