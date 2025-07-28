<template>
  <div class="home">
    <h1>NodeRace</h1>
    <CustomButton text="Open Modal" :action="() => isModalOpen = true" />
    <ModalPopup title="Modal Popup" v-if="isModalOpen" @close="isModalOpen = false">
      <template #body>
        <p style="font-size: 24px; margin: 0;">This is a modal popup example.</p>
      </template>
      <template #footer>
        <CustomButton text="Action 1" :action="() => console.log('Action 1 clicked')" type="positive" />
        <CustomButton text="Close" :action="() => isModalOpen = false" type="negative" />
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