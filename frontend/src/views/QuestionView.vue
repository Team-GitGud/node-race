<template>
    <div class="question-view">
        <h2>{{ question.title }}</h2>
        <div class="tree-container">
            <TreeNode
                :node="question.root"
                :selectedOrder="selectedOrder"
                @select="handleSelect"
            />
        </div>
        <button @click="checkAnswer">Submit</button>
        <div v-if="result !== null">
            <span v-if="result">Correct!</span>
            <span v-else>Incorrect. Try again.</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Question } from '@/types/Question';
import { Node } from '@/types/Node';
import TreeNode from '@/components/TreeNode.vue';

// Demo tree setup
const demoRoot = new Node(
    'A',
    new Node('B', new Node('D'), new Node('E')),
    new Node('C', new Node('F'), new Node('G'))
);
const demoQuestion = new Question(
    '1',
    'Select the nodes in depth-first search (in order)',
    demoRoot,
    { 'A': 1, 'B': 2, 'D': 3, 'E': 4, 'C': 5, 'F': 6, 'G': 7 }
);

const question = ref(demoQuestion);
const selectedOrder = ref<Record<string, number>>(
    Object.fromEntries(question.value.root.getAllNodes().map(node => [node.id, -1]))
);

const result = ref<boolean | null>(null);

function handleSelect(newOrder: Record<string, number>) {
    selectedOrder.value = newOrder;
}

function checkAnswer() {
    result.value = question.value.isCorrect(selectedOrder.value);
}
</script>

<style scoped>
.question-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.tree-container {
    margin: 2rem 0;
}
</style>