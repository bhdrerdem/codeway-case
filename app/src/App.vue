<script setup>
import { onMounted, computed } from "vue";
import store from "@/store";
import router from "@/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Spinner from "./components/Spinner.vue";
import { api } from "./api";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        api.setIdToken("");
        router.push("/signin");
    } else {
        router.push("/");
        const token = await user.getIdToken();
        api.setIdToken(token);
    }
    store.dispatch("setLoading", false);
});

const isLoading = computed(() => store.getters.isLoading);
</script>

<template>
    <Spinner v-if="isLoading"></Spinner>
    <RouterView v-else />
</template>
