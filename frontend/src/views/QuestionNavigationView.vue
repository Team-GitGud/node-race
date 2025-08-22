<template>
    <div class="question-navigation-view">
        <CustomButton 
            :action="() => $router.push('/')" 
            text="Back to Home" 
            type="neutral"
            style="position: absolute; top: 20px; left: 20px;" 
        />
        <h2 class="page-title">Question Navigation</h2>
        <div class="questions-container">
            <div class="question-wrapper" v-for="question in question_list" :key="question.id">
                <QuestionCard :question="question" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import QuestionCard from '@/components/QuestionCard.vue';
import { Question } from '@/types/Question';
import { Node } from '@/types/tree/Node';
import CustomButton from '@/components/CustomButton.vue';
import { PlayerSession } from '@/types/PlayerSession';
import APIManager from '@/types/APIManager';

var question_list : Question[] = (APIManager.getInstance().getSession() as PlayerSession).getQuestions() || [];

// Demo tree setup
// const demoRoot = new Node('A');
// const demoQuestion = new Question(
//     '1',
//     'Click the nodes in depth-first order',
//     demoRoot,
//     { 'A': 1 },
// );

// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);
// question_list.push(demoQuestion);

</script>

<style>
.question-navigation-view {
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}
.page-title {
    justify-self: center;
    padding: 20px;
    border-bottom: 4px solid var(--accent-color);
    width: 650px;
}

.questions-container {
    position: relative;
    height: calc(100% - 108px);
    overflow-y: auto;
    padding: 20px;
}

.question-wrapper {
    display: block;
}

</style>