<template>
    <div class="header">
        <div class="header-logo">
            <img src="@/assets/images/icon.png" alt="Codeway Logo" />
        </div>

        <div class="header-user" @click="toggleSignout">
            <font-awesome-icon icon="user" />
            <span v-if="showSignout === false">&#9660;</span>
            <span v-else>&#9650;</span>
            <div v-if="showSignout" class="signout-dropdown">
                <button class="signout-button" @click="Signout">
                    Sign Out
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import store from "@/store";

const showSignout = ref(false);

const toggleSignout = () => {
    showSignout.value = !showSignout.value;
};

const Signout = async () => {
    try {
        await store.dispatch("signout");
        showSignout.value = false;
    } catch (err) {
        console.log(err);
    }
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
}

.header-logo img,
.header-user img {
    height: 30px;
}

.header-user {
    color: white;
    position: relative;
    cursor: pointer;
}

.signout-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 100px;
    margin-top: 2px;
}

.signout-button {
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
}
</style>
