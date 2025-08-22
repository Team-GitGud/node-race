<template>
    <ScreenBackground blur/>

    <CustomButton :action="() => $router.push('/')" style="position: absolute; top: 20px; left: 20px;">Back to Home</CustomButton>
    <h1>Lobby</h1>
    <h3>Welcome: ...</h3>

    <div class="waiting-message">
        <h2>Waiting for Game </h2>
        <h2>{{ currentMessage }}</h2>
    </div>

    <div class="cancel-container">
        <CustomButton :action="() => $router.push('/')" type="negative">Cancel</CustomButton>
    </div>
</template>

<script lang="ts"  setup>
import CustomButton from '@/components/CustomButton.vue'
import ScreenBackground from '@/components/ScreenBackground.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const waitingMessages = ref(["to Start", "to Start.", "to Start..", "to Start..."]);
const currentMessage = ref<string>(waitingMessages.value[0]);

let intervalId: number | undefined;

onMounted(() => {
  intervalId = setInterval(() => {
    const currentIndex = waitingMessages.value.indexOf(currentMessage.value);
    const nextIndex = (currentIndex + 1) % waitingMessages.value.length;
    currentMessage.value = waitingMessages.value[nextIndex];
  }, 500);
});

onUnmounted(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId);
  }
});

</script>

<style>
.waiting-message {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    position: absolute; bottom: calc(100vh / 2 - 60px)
}

.cancel-container {
    display: flex;
    width: 100%;
    justify-content: center;
    position: absolute; bottom: 20px;
}
</style>