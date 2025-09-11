<template>
    <div @click="handleClick" v-if="question" class="question-card border"
        :class="{ 'correct': question.answerStatus === true, 'incorrect': question.answerStatus === false }">
        <h3 class="question-name">{{ question.title }}</h3>
        <div class="results">
            <span class="timer">
                <h3>{{ formattedTime }}</h3>
            </span>
            <img class="icon" :src="CorrectIcon" alt="Correct" v-if="question.answerStatus === true" />
            <img class="icon" :src="IncorrectIcon" alt="Incorrect" v-if="question.answerStatus === false" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Question } from '@/types/Question';
import { defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';
import CorrectIcon from '@/assets/correct.svg';
import IncorrectIcon from '@/assets/incorrect.svg';

const props = defineProps<{
    question: Question;
    answerTime: number;
}>();

const router = useRouter();

const formattedTime = computed(() => {
    console.log("Answer Time", props.answerTime);
    const minutes = Math.floor(props.answerTime / 60);
    const seconds = props.answerTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const handleClick = () => {
    router.push(`/question/${props.question.id}`);
}
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
    cursor: pointer;
}

.results {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 30px;
}

.correct {
    border-color: var(--positive-color);
}

.incorrect {
    border-color: var(--negative-color);
}

.icon {
    width: 20px;
}
</style>