<template>
    <button
        :class="`btn-action btn-${type}`"
        :type="type == 'submit' ? 'submit' : 'button'"
        @click="onClick"
    >
        {{ buttonLabel }}
    </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    onClick: {
        type: Function,
    },
});

const buttonLabel = computed(() => {
    switch (props.type) {
        case "add":
            return "Add";
        case "delete":
            return "Delete";
        case "edit":
            return "Edit";
        case "submit":
            return "Submit";
    }
});
</script>

<style>
.btn-action {
    cursor: pointer;
    border-radius: 8px;
    height: 28px;
    width: 64px;
    border: none;
}

.btn-edit {
    background-color: #287bf6;
}

.btn-submit {
    width: 100%;
    background-color: #ea546c;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 5px;
}

.btn-submit:hover {
    background-color: #c52e47;
}

.btn-edit:hover {
    background-color: #136cf0;
}

.btn-delete {
    background-color: #f74c6c;
    width: 84px;
}

.btn-delete:hover {
    background-color: #e22d4e;
    width: 84px;
}

.btn-add {
    background-color: #01d0d5;
}

.btn-add:hover {
    background-color: #04aeb1;
}
</style>
