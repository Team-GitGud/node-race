<template>
    <ReturnHomeComponent skipConfirm />
    <div class="question-view">
        <h2 v-if="question">{{ question.title }}</h2>
        <div class="tree-container">
            <TreeNode v-if="question" :node="question.root" :selectedOrder="selectedOrder"
                :correctOrder="question.correctOrder" :result="result" @select="handleSelect"
                style="margin-top: 0px;" />
        </div>
        <div class="bottom-right-buttons">
            <CustomButton class="submit-button" :action="() => handleSeeAnswer()" type="neutral" v-if="!(result === null || result === true)">
                <h3>See Answer</h3>
            </CustomButton>
            <CustomButton class="submit-button" :action="() => checkAnswer()" type="positive" :disabled="selectedOrder.size !== question?.correctOrder.size" v-if="result === null">
                <h3>Submit</h3>
            </CustomButton>
            <CustomButton class="submit-button" :action="() => fetchQuestion()" type="positive" v-else>
                <h3>Next</h3>
            </CustomButton>
            <CustomButton class="reset-button" :action="() => resetOrder()" type="negative" :disabled="result !== null || selectedOrder.size === 0">
                <img :src="ResetIcon" alt="Reset" class="btn-img" />
            </CustomButton>
        </div>
        <ModalPopup
            title="Correct Answer"
            v-if="showAnswerModal"
            @close="showAnswerModal = false"
        >
            <template #body>
                <div class="tree-container">
                    <TreeNode
                        v-if="question"
                        :node="question.root"
                        :selectedOrder="question.correctOrder"
                        :correctOrder="question.correctOrder"
                        :result="true"
                    />
                </div>
            </template>
            <template #footer>
                <CustomButton :action="() => showAnswerModal = false" type="negative">Close</CustomButton>
            </template>
        </ModalPopup>
    </div>
</template>

<script lang="ts" setup>
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import CustomButton from '@/components/CustomButton.vue';
import ModalPopup from '@/components/ModalPopup.vue';
import { ref, type Ref } from 'vue';
import { Question } from '@/types/Question';
import { Node } from '@/types/tree/Node';
import TreeNode from '@/components/TreeNode.vue';
import { QuestionAdapter, BackendQuestion } from '@/types/QuestionAdapter';
import ResetIcon from '@/assets/reset.svg';

const question: Ref<Question | null> = ref(null);
const selectedOrder = ref<Map<number, number>>(new Map());
const result = ref<boolean | null>(null);

const showAnswerModal = ref(false);

const handleSelect = (newOrder: Map<number, number>) => {
    selectedOrder.value = newOrder;
    console.log("New Order", selectedOrder.value);
};

function fetchQuestion() {
    question.value = null;
    selectedOrder.value.clear();
    result.value = null;
    
    const backendUrl = process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000';
    const wsProtocol = backendUrl.startsWith('https') ? 'wss' : 'ws';
    const wsUrl = `${backendUrl.replace(/^https?/, wsProtocol)}/api/v1/practice`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data);
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (data.type === 'PRACTICE_QUESTION' && data.question) {
                // Use QuestionAdapter to convert backend question to frontend Question
                const backendQ: BackendQuestion = data.question;
                const questions = QuestionAdapter.fromBackendQuestions([backendQ]);
                question.value = questions[0];
            }
        } catch (err) {
            console.error("Error parsing practice question:", err);
        }
        ws.close();
    };

    ws.onerror = () => {
        console.error("WebSocket error while fetching practice question");
        ws.close();
    };
}

const checkAnswer = async () => {
    if (!question.value) { return; }
    result.value = question.value.isCorrect(selectedOrder.value);
};

const resetOrder = () => {
    selectedOrder.value.clear();
    result.value = null;
};

const handleSeeAnswer = () => {
    showAnswerModal.value = true;
};

fetchQuestion();
</script>

<style scoped>
.question-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    font-size: 64px;
    margin-top: 40px;
    padding: 0 20px 10px 20px;
    border-bottom: 2px solid var(--text-color);
    white-space: normal;
    word-wrap: break-word;
    /* Change this to make text wrap earlier or later. */
    max-width: 45vw;
    text-align: center;
    line-height: 1.2;
}

.tree-container {
    margin-top: 5vh;
}

.bottom-right-buttons {
    position: absolute;
    bottom: 50px;
    right: 60px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.submit-button :deep(.btn-inner),
.reset-button :deep(.btn-inner) {
    height: 40px;
}

.submit-button :deep(.btn-inner) {
    padding: 2px 45px;
}

.reset-button :deep(.btn-inner) {
    padding: 2px 15px;
}
</style>