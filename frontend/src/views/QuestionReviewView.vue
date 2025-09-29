<template>
    <ReturnHomeComponent skipConfirm />
    <div class="question-review-view">
        <h2 v-if="question">{{ question.title }}</h2>

        <div class="top-right-buttons">
            <TutorialPopup />
        </div>

        <!-- Render the question's tree structure -->
        <div class="tree-container">
            <TreeNode 
                v-if="question"
                :node="question.root"
                :selectedOrder="userAnswer"
                :correctOrder="question.correctOrder"
                :result="answerResult"
                :showAnswer="true"
            />
        </div>

        <!-- Action Buttons -->
        <div class="bottom-right-buttons">
            <!-- Back to Leaderboard Button -->
            <CustomButton 
                class="back-button" 
                :action="() => goBack()" 
                type="neutral"
            >
                <h3>Back to Leaderboard</h3>
            </CustomButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
// --- Vue ---
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// --- Components ---
import TreeNode from '@/components/TreeNode.vue';
import CustomButton from '@/components/CustomButton.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import TutorialPopup from '@/components/TutorialPopup.vue';
// --- Types ---
import { Question } from '@/types/Question';
import { PlayerSession } from '@/types/PlayerSession';
import APIManager from '@/types/APIManager';
// --- Assets ---
import ResetIcon from '@/assets/reset.svg';

// --- Props ---
const route = useRoute();
const router = useRouter();

// --- State ---
const question = ref<Question | null>(null);
const selectedOrder = ref<Map<number, number>>(new Map());
const answerResult = ref<boolean | null>(null);
const answerTime = ref<number>(0);
const userAnswer = ref<Map<number, number>>(new Map());

// --- Computed ---
const formattedTime = computed(() => {
    const minutes = Math.floor(answerTime.value / 60);
    const seconds = answerTime.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// --- Methods ---
const goBack = () => {
    router.push('/leaderboard');
};

const resetOrder = () => {
    selectedOrder.value.clear();
    userAnswer.value.clear();
};

const handleSelect = (nodeId: number) => {
    if (selectedOrder.value.has(nodeId)) {
        selectedOrder.value.delete(nodeId);
    } else {
        selectedOrder.value.set(nodeId, selectedOrder.value.size);
    }
    userAnswer.value = new Map(selectedOrder.value);
};

// --- Lifecycle ---
onMounted(async () => {
    const questionId = Number(route.params.questionId);
    
    try {
        const session = await APIManager.getInstance().getSession();
        if (session instanceof PlayerSession) {
            const questions = session.getQuestions();
            const answers = session.getAnswers();
            const answerTimes = session.getAnswerTimes(questionId);
            
            if (questionId >= 0 && questionId < questions.length) {
                question.value = questions[questionId];
                answerResult.value = answers[questionId];
                answerTime.value = answerTimes;
                
                // If user had an answer, show it
                if (answers[questionId] !== undefined && answers[questionId] !== null) {
                    // For now, we'll show the correct answer since we don't store the user's actual selection
                    // In a real implementation, you'd want to store the user's actual answer
                    userAnswer.value = new Map(question.value.correctOrder);
                }
            } else {
                console.error('Invalid question ID');
                goBack();
            }
        } else {
            console.error('No player session found');
            goBack();
        }
    } catch (error) {
        console.error('Error loading question:', error);
        goBack();
    }
});
</script>

<style scoped>
.question-review-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    font-size: 50px;
    margin-top: 25px;
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
    transform-origin: center top;
    transition: transform 0.3s ease;
}

.bottom-right-buttons {
    position: absolute;
    bottom: 40px;
    right: 60px;
    display: flex;
    align-items: center;
    gap: 5px;
    z-index: 100;
}

.top-right-buttons {
    position: absolute;
    top: 25px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 100;
}

@media (max-width: 890px) { /* I found this is a good number to make sure it doesn't overlap the title. */
    .top-right-buttons {
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 10px;
    }
}
</style>
