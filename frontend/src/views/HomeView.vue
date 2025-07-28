<template>
  <div class="home">
    <h1>NodeRace</h1>
    <CustomButton
      text="Click Me"
      :action="() => console.log('hello')"
    />
  </div>
</template>

<script lang="ts" setup>
import CustomButton from '@/components/CustomButton.vue'
</script>