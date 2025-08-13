<template>
    <div class="question-view">
        <CustomButton :action="() => $router.push('/')" style="position: absolute; top: 20px; left: 20px;">Back to Home</CustomButton>
        <h2>{{ question.title }}</h2>
        <div class="tree-container">
            <TreeNode
                :node="question.root"
                :selectedOrder="selectedOrder"
                :result="result"
                @select="handleSelect"
                style="margin-top: 0px;"
            />
        </div>
        <div style="display: flex; justify-content: center; gap: 20px;">
            <CustomButton :action="() => checkAnswer()" type="positive" :disabled="answerReady() || result !== null">Submit</CustomButton>
            <CustomButton :action="() => resetOrder()" type="negative" :disabled="isOriginal() || result !== null">Reset</CustomButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Question } from '@/types/Question';
import { Node } from '@/types/Node';
import TreeNode from '@/components/TreeNode.vue';
import CustomButton from '@/components/CustomButton.vue';

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

const question = ref(demoQuestion);
const selectedOrder = ref<Record<string, number>>(
    Object.fromEntries(question.value.root.getAllNodes().map(node => [node.id, -1]))
);

function resetOrder() {
    selectedOrder.value = Object.fromEntries(question.value.root.getAllNodes().map(node => [node.id, -1]));
}

function isOriginal(): boolean {
    return Object.keys(selectedOrder.value).every(key => selectedOrder.value[key] === -1);
}

const result = ref<boolean | null>(null);

function handleSelect(newOrder: Record<string, number>) {
    if (result.value !== null) { return; }
    selectedOrder.value = newOrder;
}

function checkAnswer() {
    result.value = question.value.isCorrect(selectedOrder.value);
}

function answerReady() {
    // Ensure no duplicate selections and all nodes are selected
    const values = Object.values(selectedOrder.value);
    const uniqueValues = new Set(values);
    return values.includes(-1) || uniqueValues.size !== values.length;
}
</script>

<style scoped>
h2 {
    font-size: 2.5rem;
    margin-top: 40px;
    padding: 0 20px 10px 20px;
    border-bottom: 2px solid var(--text-color);
}
.question-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.tree-container {
    margin: 2rem 0 3rem 0;
}
</style>