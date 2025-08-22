<template>
    <div class="question-view">
        <CustomButton :action="() => $router.push('/')" style="position: absolute; top: 20px; left: 20px;">Back to Home</CustomButton>
        <h2 v-if="currentQuestion">{{ currentQuestion.title }}</h2>
        <div class="tree-container">
            <TreeNode
                v-if="currentQuestion"
                :node="currentQuestion.root"
                :selectedOrder="selectedOrder"
                :result="result"
                @select="handleSelect"
                style="margin-top: 0px;"
            />
        </div>
        <div style="display: flex; justify-content: center; gap: 20px;">
            <CustomButton :action="() => checkAnswer()" type="positive" :disabled="result !== null">Submit</CustomButton>
            <CustomButton :action="() => resetOrder()" type="negative" :disabled="isOriginal() || result !== null">Reset</CustomButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted, watch, withDefaults, defineProps } from 'vue';
import { Question } from '@/types/Question';
import CustomButton from '@/components/CustomButton.vue';
import TreeNode from '@/components/TreeNode.vue';
import APIManager from '@/types/APIManager';
import { PlayerSession } from '@/types/PlayerSession';

const route = useRoute();
const router = useRouter();

// Props for dynamic routing
interface Props {
    questionIndex?: string;
}

const props = withDefaults(defineProps<Props>(), {
    questionIndex: "0"
});

// Convert questionIndex to number
const questionIndex = computed(() => Number(props.questionIndex));

// Reactive data
const questions = ref<Question[]>([]);
const selectedOrder = ref<Map<number, number>>(new Map());
const result = ref<boolean | null>(null);

// Computed properties
const currentQuestion = computed(() => {
    if (questions.value.length > 0 && questionIndex.value < questions.value.length) {
        return questions.value[questionIndex.value];
    }
    return null;
});

const totalQuestions = computed(() => questions.value.length);

// Methods
const handleSelect = (newOrder: Map<number, number>) => {
    if (result.value !== null) return;
    
    // Update the selectedOrder with the new order from TreeNode
    selectedOrder.value = newOrder;
    console.log('New order received:', newOrder);
};

const resetOrder = () => {
    selectedOrder.value.clear();
    result.value = null;
    console.log('Order reset');
};

const isOriginal = (): boolean => {
    return selectedOrder.value.size === 0;
};

const checkAnswer = () => {
    if (currentQuestion.value) {
        result.value = currentQuestion.value.isCorrect(selectedOrder.value);
        console.log('Answer checked:', result.value ? 'Correct!' : 'Incorrect');
        
        // Wait 2 seconds, then navigate to next question or leaderboard
        setTimeout(() => {
            const nextQuestionIndex = questionIndex.value + 1;
            
            console.log('Next question index:', questions.value.length);
            if (nextQuestionIndex < questions.value.length) {
                // Move to next question
                console.log(`Moving to question ${nextQuestionIndex}`);
                router.push(`/question/${nextQuestionIndex}`);
            } else {
                // No more questions, go to leaderboard
                console.log('All questions completed, going to leaderboard');
                router.push('/leaderboard');
            }
        }, 2000);
    }
};

const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.value.length) {
        router.push(`/question/${index}`);
    }
};

// Lifecycle
onMounted(() => {
    // Get questions from PlayerSession
    const session = APIManager.getInstance().getSession();
    if (session && session instanceof PlayerSession) {
        questions.value = session.getQuestions();
        console.log('Questions loaded from session:', questions.value);
    } else {
        console.warn('No PlayerSession found');
    }
    
    // Initialize selected order for current question
    if (currentQuestion.value) {
        selectedOrder.value = new Map();
        result.value = null;
    }
});

// Watch for question changes and reset state
watch(questionIndex, () => {
    console.log('Question changed to:', questionIndex.value);
    selectedOrder.value = new Map();
    result.value = null;
});

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