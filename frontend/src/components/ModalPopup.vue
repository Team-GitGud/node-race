<template>
    <div class="modal-popup">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="modal">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

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
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    min-width: 300px;
    z-index: 1002;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}
</style>