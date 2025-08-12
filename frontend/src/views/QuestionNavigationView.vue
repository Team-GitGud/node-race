<template>
    <h2 class="page-title">Question Navigation</h2>
    <QuestionCard :question="demoQuestion">Demo Question</QuestionCard>
</template>

<script lang="ts" setup>
import QuestionCard from '@/components/QuestionCard.vue';
import { Question } from '@/types/Question';
import { Node } from '@/types/Node';

// Demo tree setup
const demoRoot = new Node(
    'A',
    new Node('B', new Node('D'), new Node('E')),
    new Node('C', new Node('F'), new Node('G'))
);
const demoQuestion = new Question(
    '1',
    'Click the nodes in depth-first order',
    demoRoot,
    { 'A': 1, 'B': 2, 'D': 3, 'E': 4, 'C': 5, 'F': 6, 'G': 7 }
);

</script>

<style>
.page-title {
    justify-self: center;
    padding: 20px;
    margin-bottom: 30px;
    border-bottom: 4px solid var(--accent-color);
    width: 650px;
}
</style>