<template>
    <div class="question-card border"
        :class="{ 'correct': question.answerStatus === true, 'incorrect': question.answerStatus === false }">
        <h3 class="question-name">{{ question.title }}</h3>
        <div class="results">
            <span class="timer">
                <h3>00:00</h3>
            </span>
            <span>
                Tick
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Question } from '@/types/Question';
import { defineProps } from 'vue';

const props = defineProps<{
    question: Question;
}>();
</script>

<style scoped>
h3 {
    font-size: 38px;
}

.question-card {
    padding: 12px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.results {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
}

.correct {
    border-color: var(--positive-color);
}

.incorrect {
    border-color: var(--negative-color);
}
</style>