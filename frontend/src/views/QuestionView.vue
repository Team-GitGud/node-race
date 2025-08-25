<template>
    <div class="question-view">
        <Logo />
        <h2 v-if="currentQuestion">{{ currentQuestion.title }}</h2>
        <img v-if="props.questionIndex > 0" @click="previousQuestion()" :src="NavigateLeft" alt="Navigate Left"
            class="navigate-left-icon" />
        <div class="tree-container">
            <TreeNode v-if="currentQuestion" :node="currentQuestion.root" :selectedOrder="selectedOrder"
                :correctOrder="currentQuestion.correctOrder" :result="result" @select="handleSelect"
                style="margin-top: 0px;" />
        </div>
        <img v-if="props.questionIndex < questions.length - 1" @click="nextQuestion()" :src="NavigateRight"
            alt="Navigate Right" class="navigate-right-icon" />
        <div class="bottom-right-buttons">
            <CustomButton class="submit-button" :action="() => checkAnswer()" type="positive" :disabled="false">
                <h3>Submit</h3>
            </CustomButton>
            <CustomButton class="reset-button" :action="() => resetOrder()" type="negative" :disabled="false">
                <img :src="ResetIcon" alt="Reset" class="btn-img" />
            </CustomButton>
        </div>
        <div class="bottom-left-buttons">
            <CustomButton class="question-navigation-button" :action="() => $router.push('/question-navigation')"
                type="neutral" :disabled="false">
                <h3>Questions</h3>
            </CustomButton>
        </div>
        <div class="top-right-buttons">
            <TimerComponent class="timer-component" :gameTimer="gameTimer" />
            <h3 class="question-number border">{{ props.questionIndex + 1 }}/{{ questions.length }}</h3>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch, withDefaults, defineProps } from 'vue';
import { Question } from '@/types/Question';
import CustomButton from '@/components/CustomButton.vue';
import TreeNode from '@/components/TreeNode.vue';
import APIManager from '@/types/APIManager';
import TimerComponent from '@/components/TimerComponent.vue';
import { GameTimer } from '@/types/GameTimer';
import { PlayerSession } from '@/types/PlayerSession';
import { Node } from '@/types/tree/Node';
import { usePlayerSession } from '@/types/usePlayerSession';
import ResetIcon from '@/assets/reset.svg';
import NavigateLeft from '@/assets/navigate-left.svg';
import NavigateRight from '@/assets/navigate-right.svg';
import { QuestionAdapter } from '@/types/QuestionAdapter';
import Logo from '@/components/LogoComponent.vue';

const router = useRouter();
const gameTimer = ref<GameTimer | null>(null);

interface Props {
    questionIndex?: number;
}
const props = withDefaults(defineProps<Props>(), {
    questionIndex: 0
});
// Reactive data
const { questions } = usePlayerSession();
const selectedOrder = ref<Map<number, number>>(new Map());

// We make this null to indicate the result hasn't been checked yet.
// In the TreeNode component, the nodes are red/green when this is a boolean, and blue when null.
const result = ref<boolean | null>(null);

const handleSelect = (newOrder: Map<number, number>) => {
    selectedOrder.value = newOrder;
};

const resetOrder = () => {
    selectedOrder.value.clear();
    result.value = null;
};

const checkAnswer = async () => {
    result.value = currentQuestion.value.isCorrect(selectedOrder.value);
    const session = await APIManager.getInstance().getSession();
    if (session && session instanceof PlayerSession) {
        session.addAnswer(props.questionIndex, result.value ?? false);
        session.sendAnswer(props.questionIndex, QuestionAdapter.toBackendAnswer(selectedOrder.value));
    }

    // TODO: Send the result to the backend. Make the question not available for the player to answer again.
    setTimeout(async () => {
        resetOrder();
        if (!session || !(session instanceof PlayerSession)) {
            return;
        }
        if (await answeredAllQuestions()) {
            router.push("/leaderboard");
            return;
        }
        if (props.questionIndex + 1 >= questions.value.length) {
            router.push("/question-navigation");
            return;
        }

        // This will cycle through all questions until it finds one that hasn't been answered.
        let i = 1
        while (await hasAnsweredQuestion(props.questionIndex + i)) {
            i++;
            if (props.questionIndex + i >= questions.value.length) {
                router.push("/question-navigation");
                return;
            }
        }
        router.push(`/question/${props.questionIndex + i}`);
    }, 2000);
};

const answeredAllQuestions = async () => {
    const session = await APIManager.getInstance().getSession();
    if (session && session instanceof PlayerSession) {
        const answers = session.getAnswers();

        // Check if all previous questions (0 to currentIndex-1) have been answered
        for (let i = 0; i < questions.value.length; i++) {
            if (answers[i] === undefined) {
                return false;
            }
        }
    }
    return true;
}

const hasAnsweredQuestion = async (questionIndex: number) => {
    const session = await APIManager.getInstance().getSession();
    if (session && session instanceof PlayerSession) {
        const answers = session.getAnswers();
        return answers[questionIndex] !== undefined;
    }
}

const currentQuestion = computed(() => {
    return questions.value[props.questionIndex];
})

onMounted(async () => {
    const session = await APIManager.getInstance().getSession();
    if (session && session instanceof PlayerSession) {
        questions.value = session.getQuestions();
        gameTimer.value = session.getGameTimer();
    }
    selectedOrder.value = new Map();
    result.value = null;
});

watch(currentQuestion, () => {
    selectedOrder.value = new Map();
    result.value = null;
});

const nextQuestion = () => {
    router.push(`/question/${props.questionIndex + 1}`);
}

const previousQuestion = () => {
    router.push(`/question/${props.questionIndex - 1}`);
}

</script>
<style scoped>
/* Layout */
.question-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Header */
h2 {
    font-size: 64px;
    margin-top: 40px;
    padding: 0 20px 10px 20px;
    border-bottom: 2px solid var(--text-color);
    white-space: normal;
    /* Allow text to wrap */
    word-wrap: break-word;
    /* Break long words if needed */
    max-width: 45vw;
    /* Limit width to prevent overflow */
    text-align: center;
    /* Center the text */
    line-height: 1.2;
    /* Tighter line height for better wrapping */
}

/* Tree Container */
.tree-container {
    margin-top: 5vh;
}

/* Navigation Icons */
.navigate-left-icon,
.navigate-right-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 88px;
    flex-shrink: 0;
    cursor: pointer;
}

.navigate-left-icon {
    left: 150px;
}

.navigate-right-icon {
    right: 150px;
}


/* Button Styling */
.submit-button :deep(.btn-inner),
.reset-button :deep(.btn-inner),
.question-navigation-button :deep(.btn-inner) {
    height: 40px;
}

.submit-button :deep(.btn-inner),
.question-navigation-button :deep(.btn-inner) {
    padding: 2px 45px;
}

.reset-button :deep(.btn-inner) {
    padding: 2px 15px;
}

/* Button Positioning */
.bottom-right-buttons {
    position: absolute;
    bottom: 50px;
    right: 60px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.bottom-left-buttons {
    position: absolute;
    bottom: 50px;
    left: 60px;
}

.back-to-home-button {
    position: absolute;
    top: 50px;
    left: 60px;
}

.top-right-buttons {
    position: absolute;
    top: 50px;
    right: 60px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.question-number {
    padding-left: 10px;
    padding-right: 10px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>