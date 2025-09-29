<template>
    <div class="timer-container border" :class="{ 'timer-hidden': !isTimeVisible }" v-if="gameTimer">
        <img @click="toggleTime" class="timer-toggle btn-img" :src="isTimeVisible ? timeVisible : timeNotVisible" />
        <div v-if="isTimeVisible" class="timer-text">
            <h4>{{ formattedTime }}</h4>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps, computed } from 'vue';
import timeVisible from '@/assets/time-visible.svg';
import timeNotVisible from '@/assets/time-not-visible.svg';

const props = defineProps({
    gameTimer: {
        type: Object,
        required: false,
        default: null
    }
});

const isTimeVisible = ref(true);
const timeLeft = ref(0);
let intervalId = null;

const updateTime = () => {
    if (props.gameTimer) {
        timeLeft.value = props.gameTimer.getTimeLeft();
    }
};

// Format time from seconds to MM:SS
const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
    if (props.gameTimer) {
        updateTime();
        intervalId = setInterval(updateTime, 1000);
    }
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

// Watch for changes in gameTimer prop
watch(() => props.gameTimer, (newTimer) => {
    if (newTimer) {
        updateTime();
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(updateTime, 1000);
    }
}, { immediate: true });

const toggleTime = () => {
    isTimeVisible.value = !isTimeVisible.value;
};
</script>
<style>

.timer-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    width: 120px; /* Fixed width when visible */
    transition: width 0.3s ease-in-out; /* Smooth width animation */
    overflow: hidden; /* Hide content during animation */
    box-sizing: content-box !important; /* This looks super weird when not set and the timer is invisible. So set it :) */
}

.timer-container.timer-hidden {
    width: 55px; /* Smaller width when timer text is hidden */
}

.timer-text h4 {
    color: var(--text-color);
    padding-right: 10px;
    white-space: nowrap; /* Prevent text wrapping during animation */
}

.timer-toggle {
    padding-left: 10px;
    padding-right: 10px;
    flex-shrink: 0; /* Maintains aspect ratio */
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>