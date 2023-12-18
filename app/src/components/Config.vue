<template>
    <tr class="config-row">
        <td class="config-data">{{ config.parameterKey }}</td>
        <td class="config-data">{{ config.value }}</td>
        <td class="config-data">{{ config.description }}</td>
        <td class="config-data">{{ formattedCreatedAt }}</td>
        <td>
            <div class="action-btn-container">
                <ActionButton type="edit" @click="openEditModal" />
                <ActionButton type="delete" @click="deleteConfig" />
            </div>
        </td>
    </tr>
    <div class="config-card">
        <div class="config-cell">
            <h3>Parameter Key:</h3>
            <span class="config-data">{{ config.parameterKey }}</span>
        </div>
        <div class="config-cell">
            <h3>Value:</h3>
            <span class="config-data">{{ config.value }}</span>
        </div>
        <div class="config-cell">
            <h3>Description:</h3>
            <span class="config-data">{{ config.description }}</span>
        </div>
        <div class="config-cell">
            <h3>Create Date:</h3>
            <span class="config-data">{{ formattedCreatedAt }}</span>
        </div>
        <div class="action-btn-container">
            <ActionButton type="edit" @click="openEditModal" />
            <ActionButton type="delete" @click="deleteConfig" />
        </div>
    </div>
    <EditModal
        v-if="isEditModalOpen"
        :visible="isEditModalOpen"
        :config="config"
        @close="closeEditModal"
        @save="saveChanges"
    />
</template>

<script setup>
import { ref, computed } from "vue";
import EditModal from "@/components/EditModal.vue";
import ActionButton from "@/components/ActionButton.vue";
import store from "@/store";

const props = defineProps(["config"]);

const isEditModalOpen = ref(false);

const openEditModal = () => {
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
};

const deleteConfig = async () => {
    try {
        await store.dispatch("deleteConfig", props.config.id);
    } catch (error) {
        alert(error?.message || "Something went wrong, please try again.");
    }
};

const saveChanges = async (editedConfig) => {
    try {
        await store.dispatch("updateConfig", editedConfig);
        isEditModalOpen.value = false;
    } catch (error) {
        alert(error?.message || "Something went wrong, please try again.");
    }
};

const formattedCreatedAt = computed(() => {
    return new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(props.config.createdAt));
});
</script>

<style scoped>
.action-btn-container {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    max-width: 160px;
}

.config-cell {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.config-cell h3 {
    margin-right: 4px;
}

@media only screen and (max-width: 768px) {
    .config-row {
        display: none;
    }
    .config-card {
        background: inherit;
        border-radius: 10px;
        padding: 20px;
        border: 1px solid;
        border-color: white;
        margin-bottom: 20px;
        color: white;
    }
    .action-btn-container {
        margin: auto;
    }
}
@media only screen and (min-width: 769px) {
    .config-card {
        display: none;
    }
    .config-row {
        height: 30px;
        margin-bottom: 10px;
    }
}

.config-data {
    font-size: medium;
    font-weight: 200;
    color: white;
}
</style>
