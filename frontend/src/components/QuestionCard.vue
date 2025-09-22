<template>
    <div class="question-container" @click="navigateToQuestion">
        <div :class="['question-card', `status-${answerStatus}`]">
            <h3 class="question-name">{{ question.title }} {{ Number(question.id) }}</h3>
            <div class="checkbox" v-if="answerStatus == null" />
            <h4 class="tick" v-if="answerStatus == true">✔</h4>
            <h3 class="cross" v-if="answerStatus == false">X</h3>
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { Question } from '@/types/Question';
import { defineProps, ref } from 'vue';
import { onMounted } from 'vue';
import APIManager from '@/types/APIManager';
import { PlayerSession } from '@/types/PlayerSession';

const props = defineProps<{
    question: Question;
}>();

const answerStatus = ref<boolean | null>(null);

onMounted(async () => {
    const session = await APIManager.getInstance().getSession();
    answerStatus.value = (session as PlayerSession).getAnswers()[props.question.id] !== undefined 
    && (session as PlayerSession).getAnswers()[props.question.id] !== null 
    ? (session as PlayerSession).getAnswers()[props.question.id] : null;
});

function navigateToQuestion() {
    router.push('/question/' + props.question.id);
}
</script>

<style scoped>
.question-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.question-card {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-width: 7px 3px 3px 7px;
    border-style: solid;
    width: 600px;
    margin-bottom: 20px;
    transition: filter 0.1s ease;
}

.question-card.status-null {
    border-color: var(--accent-color);
    cursor: pointer;
}

.question-card.status-null:hover {
    border-color: var(--accent-color);
    cursor: pointer;
    filter: brightness(0.4);
}

.question-card.status-true {
    border-color: var(--positive-color);
    cursor: not-allowed;
}

.question-card.status-false {
    border-color: var(--negative-color);
    cursor: not-allowed;
}

.question-name {
    padding-left: 75px;
    margin: 5px 0 5px 0;
}

.checkbox {
    border-width: 5px 2px 2px 5px;
    border-style: solid;
    border-color: var(--accent-color);
    width: 20px;
    height: 20px;
    margin-right: 30px;
}

.tick {
    text-decoration: none;
    margin-right: 30px;
    color: var(--positive-color);
}

.cross {
    margin-right: 35px;
    color: var(--negative-color);
}
</style>