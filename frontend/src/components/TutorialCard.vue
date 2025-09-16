<template>
    <div class="tutorial-card">
        <div class="text-content" style="padding: 10px;">
            <h4>{{ title }}</h4>
            <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <img v-if="image" :src="image" alt="Tutorial Preview" class="tutorial-preview"/>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    image?: string;
    title: string;
    subtitle?: string;
}>();
</script>

<style scoped>
.tutorial-card {
    display: grid;
    grid-template-areas: "overlap";
    width: 240px;
    height: 160px;
    background-color: var(--background-color); 
}

.tutorial-preview {
    height: 160px;
    object-fit: cover;
    margin-left: auto;
    grid-area: overlap;
}

.text-content {
    display: flex;
    flex-direction: column;
    align-items: start;
    position: relative;
    margin-right: auto;
    z-index: 50;
    grid-area: overlap;
}
</style>