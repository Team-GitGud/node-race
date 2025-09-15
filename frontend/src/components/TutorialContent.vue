<template>
    <ModalPopup :title="title" @close="$emit('close')">
        <template #body>
            <img class="static-example" :src="static" alt="Tutorial Static Example"/>
        </template>
        <template #footer>
            <CustomButton :action="() => $emit('back')" type="neutral">Back</CustomButton>
            <CustomButton :action="() => $emit('close')" type="negative">Close</CustomButton>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import ModalPopup from './ModalPopup.vue';
import CustomButton from './CustomButton.vue';
import { defineProps } from 'vue';

defineProps<{
    title: string;
    static: string;
}>();

</script>

<style scoped>
.static-example {
    width: 100%; height: auto;
}
</style>