<!--
Usage:
<ModalPopup title="My Modal" v-if="isOpen" @close="isOpen = false">
    <template #body>
        <p>Modal content here.</p>
    </template>
    <template #footer>
        <CustomButton text="Close" :action="() => isOpen = false" type="negative" />
    </template>
</ModalPopup>

Import this component in your Vue file:
import ModalPopup from '@/components/ModalPopup.vue';
import CustomButton from '@/components/CustomButton.vue';

Props:
- title (optional, string): If provided, displays a header with the title and a close button. If omitted, only a close button appears in the top-right.
-->
<template>
    <div class="modal-popup">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="modal">
            <div v-if="title" class="modal-header">
                <h3>{{ title }}</h3>
            </div>
            <div class="modal-body">
                <slot name="body" />
            </div>
            <div class="modal-footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{ title?: string }>();
</script>

<style scoped>
.modal-popup {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    backdrop-filter: blur(5px);
}

.modal {
    position: relative;
    background: var(--background-color);
    padding: 1.5rem;
    min-width: 300px;
    z-index: 1002;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--text-color);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--text-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}

.modal-header h3 {
    margin: 0;
    font-size: 28px;
}

.modal-body {
    text-align: left;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--text-color);
}
</style>