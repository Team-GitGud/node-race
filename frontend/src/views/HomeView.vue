<template>
  <div class="home">
    <h1>NodeRace</h1>
    <CustomButton
      text="Click Me"
      :action="() => console.log('hello')"
    />
    <button @click="isModalOpen = true">Open Modal</button>
    <ModalPopup v-if="isModalOpen" @close="isModalOpen = false">
      <template #body>
        <p>This is a modal popup example.</p>
      </template>
      <template #footer>
        <button>Action 1</button>
        <button @click="isModalOpen = false">Close</button>
      </template>
    </ModalPopup>
  </div>
</template>

<script lang="ts" setup>
import CustomButton from '@/components/CustomButton.vue'
import { ref } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';

const isModalOpen = ref(false);
</script>