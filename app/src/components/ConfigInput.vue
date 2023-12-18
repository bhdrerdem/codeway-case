<template>
    <tr class="config-input-row">
        <td>
            <input
                class="config-input"
                placeholder="New Parameter"
                type="text"
                v-model="parameterKey"
            />
        </td>
        <td>
            <input
                class="config-input"
                placeholder="Value"
                type="text"
                v-model="value"
            />
        </td>
        <td colspan="2">
            <input
                class="config-input config-input-description"
                placeholder="New Description"
                type="text"
                v-model="description"
            />
        </td>
        <td>
            <div class="action-btn-container">
                <ActionButton type="add" @click="addConfig" />
            </div>
        </td>
    </tr>
    <div class="config-input-card">
        <div class="config-cell">
            <input
                class="config-input"
                placeholder="New Parameter"
                type="text"
                v-model="parameterKey"
            />
        </div>
        <div class="config-cell">
            <input
                class="config-input"
                placeholder="Value"
                type="text"
                v-model="value"
            />
        </div>
        <div class="config-cell">
            <input
                class="config-input"
                placeholder="New Description"
                type="text"
                v-model="description"
            />
        </div>
        <div class="action-btn-container">
            <ActionButton type="add" @click="addConfig" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import store from "@/store";
import ActionButton from "./ActionButton.vue";

const parameterKey = ref("");
const value = ref("");
const description = ref("");

const addConfig = async () => {
    if (!parameterKey.value || !value.value) {
        alert("Parameter key and value must be set.");
        return;
    }

    try {
        await store.dispatch("createConfig", {
            parameterKey: parameterKey.value,
            value: value.value,
            description: description.value,
        });

        parameterKey.value = "";
        value.value = "";
        description.value = "";
    } catch (error) {
        alert(error?.message || "Something went wrong, please try again.");
    }
};
</script>

<style scoped>
.config-input {
    border-radius: 6px;
    padding: 8px;
    background-color: inherit;
    border: 1px solid;
    border-color: #2a324f;
    color: white;
}
.config-input-description {
    width: 80%;
}

@media only screen and (max-width: 768px) {
    .config-input-row {
        display: none;
    }
    .config-input-card {
        background: inherit;
        border-radius: 10px;
        padding: 20px;
        border: 1px solid;
        border-color: white;
        margin-bottom: 20px;
        color: white;
    }

    .config-input {
        width: 80%;
    }

    .config-cell {
        margin-bottom: 8px;
        width: 100%;
    }

    .action-btn-container {
        text-align: center;
    }
}
@media only screen and (min-width: 769px) {
    .config-input-card {
        display: none;
    }
    .config-input-row {
        height: 30px;
        margin-bottom: 10px;
    }

    .action-btn-container {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        max-width: 160px;
    }
}
</style>
