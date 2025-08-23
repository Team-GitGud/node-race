<template>
    <div v-if="visible" class="alert-overlay">
        <div class="alert-box">
            <h3><span style="color: var(--negative-color)">!!!</span> ERROR <span style="color: var(--negative-color)">!!!</span></h3>
            <p>{{ message }}</p>
            <CustomButton :action="() => AlertService.close()">Close</CustomButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AlertService } from '@/types/AlertService';
import CustomButton from './CustomButton.vue';

const visible = AlertService.visible;
const message = AlertService.message;
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.alert-box {
    background: var(--background-color);
    border-width: 7px 3px 3px 7px;
    border-style: solid;
    border-color: var(--negative-color);
    padding: 2rem 2.5rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    text-align: center;
}
</style>