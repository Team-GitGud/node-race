<template>
    <div class="loading-screen">
        <div class="loading-spinner"></div>
        <h3>Loading...</h3>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(0, 8, 26);
    backdrop-filter: blur(10px);
    z-index: 1000;
}

.loading-spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-screen h3 {
    margin-top: 20px;
    color: var(--text-color);
}
</style>