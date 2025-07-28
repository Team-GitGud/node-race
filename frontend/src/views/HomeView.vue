<template>
  <div class="home">
    <h1>NodeRace</h1>
    <ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
    <CustomButton
      text="Click Me"
      :action="() => console.log('hello')"
    />
  </div>
</template>

<script lang="ts" setup>
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
</script>