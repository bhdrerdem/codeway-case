<template>
    <div class="card">
        <div class="image-container">
            <img src="../assets/images/icon.png" alt="codeway-logo" />
        </div>
        <div class="signin-header">
            <h3>Please sign in</h3>
        </div>
        <div class="signin-container">
            <form @submit.prevent="Login">
                <input
                    type="email"
                    id="email"
                    placeholder="E-mail address"
                    autofocus
                    v-model="email"
                    required
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    v-model="password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
        <footer>Codeway © 2021</footer>
    </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import store from "@/store";

const email = ref("");
const password = ref("");

const Login = async () => {
    try {
        await store.dispatch("signIn", {
            email: email.value,
            password: password.value,
        });
        router.push("/");
    } catch (err) {
        alert(err?.message || "Something went wrong, please try again.");
    }
};
</script>

<style scoped>
.signin-header {
    color: #32325d;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    font-weight: lighter;
}

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding-top: 70px;
    max-width: 400px;
}

.image-container img {
    max-width: 50%;
    margin: auto;
    display: block;
    margin-bottom: 20px;
}

.signin-container {
    width: 60%;
}

input {
    width: 100%;
    padding: 10px 0px;
    margin-bottom: 1px;
    border: 1px solid #2a3451;
    border-radius: 4px;
    background-color: #1e1e2e;
    color: #697179;
    text-align: left;
    text-indent: 10px;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

input::placeholder {
    color: #697179;
}

input:focus {
    border: 1px solid #993c8f;
    outline: none; /* Optional: Removes the default focus outline */
}

button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: none;
    border-radius: 4px;
    background-color: #4e66df;
    color: white;
    cursor: pointer;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

button:hover {
    background-color: #0056b3;
}

footer {
    color: #697179;
    margin-top: 50px;
    font-size: small;
}
</style>
