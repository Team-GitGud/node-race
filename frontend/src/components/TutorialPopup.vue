<template>
    <CustomButton shrink :action="() => isOpen = true">?</CustomButton>
    <ModalPopup title="Tutorial" v-if="isOpen" @close="isOpen = false">
        <template #body>
            <p>What do you want to learn?</p>
        </template>
        <template #footer>
            <CustomButton :action="() => isOpen = false" type="negative">Close</CustomButton>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from './CustomButton.vue';
import ModalPopup from './ModalPopup.vue';

const isOpen = ref(false);

</script>


<style scoped>
</style>