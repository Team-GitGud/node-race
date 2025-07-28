<template>
  <div class="home">
    <h1>NodeRace</h1>
    <button @click="isModalOpen = true">Open Modal</button>
    <ModalPopup v-if="isModalOpen" @close="isModalOpen = false">
      <h2>Modal Title</h2>
      <p>This is a modal popup example.</p>
      <button @click="isModalOpen = false">Close</button>
    </ModalPopup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';

const isModalOpen = ref(false);
</script>
