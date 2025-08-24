<template>
    <div class="build-info border">
        v{{ version }}<br>
        {{ buildTime }}
    </div>
</template>

<script setup lang="ts">
const version = process.env.VUE_APP_VERSION || 'dev';
const buildTime = process.env.VUE_APP_BUILD_TIME || '';
</script>

<style scoped>
.build-info {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 16px;
    font-size: 0.8em;
    color: white;
    padding: 4px 8px;
    z-index: 1000;
    opacity: 0.1;
    transition: opacity 0.3s ease;
}

.build-info:hover {
    opacity: 1;
}
</style>