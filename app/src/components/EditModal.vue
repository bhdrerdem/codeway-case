<template>
    <div class="modal-background" v-if="visible">
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">Edit Configuration</h2>
                <span class="btn-close" @click="closeModal">X</span>
            </div>
            <div class="modal-content">
                <form @submit.prevent="saveChanges">
                    <label for="parameterKey">Parameter Key:</label>
                    <input
                        type="text"
                        id="parameterKey"
                        v-model="editedConfig.parameterKey"
                        required
                    />

                    <label for="value">Value:</label>
                    <input
                        type="text"
                        id="value"
                        v-model="editedConfig.value"
                        required
                    />

                    <label for="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        v-model="editedConfig.description"
                    />

                    <!-- <button class="btn-submit" type="submit">Save</button> -->
                    <ActionButton type="submit" />
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import ActionButton from "./ActionButton.vue";

const { visible, config } = defineProps(["visible", "config"]);
const emit = defineEmits(["close", "save"]);

const editedConfig = ref({ ...config });

const closeModal = () => {
    emit("close");
};

const saveChanges = () => {
    emit("save", editedConfig.value);
};
</script>

<style scoped>
.modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.modal {
    background-color: white;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    width: 400px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-close {
    cursor: pointer;
}

.modal-title {
    margin: 0;
}

.modal-content {
    margin-top: 20px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 8px;
}

input {
    padding: 8px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>
