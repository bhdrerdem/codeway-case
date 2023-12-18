<template>
    <div class="panel">
        <Header></Header>
        <table class="table-view">
            <thead>
                <tr>
                    <th class="table-title">
                        <h3>Parameter Key</h3>
                    </th>
                    <th class="table-title">
                        <h3>Value</h3>
                    </th>
                    <th class="table-title">
                        <h3>Description</h3>
                    </th>
                    <th class="table-title" @click="toggleSortOrder">
                        <div style="display: flex; align-items: center">
                            <h3 style="cursor: pointer">
                                Create Date
                                <span v-if="sortOrder === 'descending'"
                                    >&#9660;</span
                                >
                                <span v-else>&#9650;</span>
                            </h3>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <Config
                    v-for="config in sortedData"
                    :key="config.id"
                    :config="config"
                />
                <ConfigInput />
            </tbody>
        </table>
        <div class="card-view">
            <Config
                v-for="config in sortedData"
                :key="config.id"
                :config="config"
            />
            <ConfigInput />
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import store from "@/store";
import Config from "../components/Config.vue";
import ConfigInput from "@/components/ConfigInput.vue";
import Header from "../components/Header.vue";

const sortOrder = ref("descending");

const toggleSortOrder = () => {
    sortOrder.value =
        sortOrder.value === "descending" ? "ascending" : "descending";
};

const sortedData = computed(() => {
    return data.value.sort((a, b) => {
        return sortOrder.value === "descending"
            ? b.createdAt - a.createdAt
            : a.createdAt - b.createdAt;
    });
});

const data = computed(() => store.getters.data);
onBeforeMount(async () => {
    try {
        await store.dispatch("fetchAllConfigs");
    } catch (error) {
        alert(error?.message || "Something went wrong, please try again.");
    }
});
</script>

<style scoped>
.panel {
    height: 100%;
    display: flex;
    flex-direction: column;
}

@media only screen and (max-width: 768px) {
    .table-view {
        display: none;
    }
    .card-view {
        display: flex;
        flex-direction: column;
        padding: 8px;
    }
}
@media only screen and (min-width: 769px) {
    .card-view {
        display: none;
    }
    .table-view {
        width: 100%;
        padding: 24px 80px 24px 24px;
    }
}

.table-title h3 {
    text-align: left;
    margin: 0;
    color: #c8c8cd;
}

.table-title span {
    color: #c8c8cd;
}
</style>
