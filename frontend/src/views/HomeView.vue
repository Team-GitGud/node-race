<template>
  <div class="home">
    <h1>NodeRace</h1>
    <CustomButton text="Open Modal" :action="() => isModalOpen = true" />
    <CustomButton style="margin-left: 10px;" text="Demo Question" :action="() => $router.push('/question/')" />
    
    <div style="margin-top: 20px;">
      <TextInput 
        placeholder="Enter some text..." 
        :width="300"
        @enter="handleEnter"
      />
    </div>
    
    <ModalPopup title="Modal Popup" v-if="isModalOpen" @close="isModalOpen = false">
      <template #body>
        <p style="font-size: 24px; margin: 0;">This is a modal popup example.</p>
      </template>
      <template #footer>
        <CustomButton text="Action 1" :action="() => console.log('Action 1 clicked')" type="positive" />
        <CustomButton text="Close" :action="() => isModalOpen = false" type="negative" />
      </template>
    </ModalPopup>
    <ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
  </div>
</template>

<script lang="ts" setup>
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
import TextInput from '@/components/TextInput.vue'
import { ref } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';

const isModalOpen = ref(false);

const handleEnter = (value: string) => {
  console.log('Enter pressed with value:', value);
};
</script>