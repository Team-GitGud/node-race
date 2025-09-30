<template>
    <ScreenBackground noTree />
    <ReturnHomeComponent 
        :onConfirm="handleReturnHome"/>
    <div class="question-view">
        <h2 v-if="currentQuestion">{{ currentQuestion.title }}</h2>
        <img v-if="showPrevArrow" @click="previousQuestion()" :src="NavigateLeft" alt="Navigate Left"
            class="navigate-left-icon" :class="{ disabled: checkingAnswer }" />
        <div class="tree-container" :style="{ transform: `scale(${treeScale})` }">
            <TreeNode v-if="currentQuestion" :node="currentQuestion.root" :selectedOrder="selectedOrder"
                :correctOrder="currentQuestion.correctOrder" :result="result" @select="handleSelect($event)"
                style="margin-top: 0px;" />
        </div>
        <img v-if="showNextArrow" @click="nextQuestion()" :src="NavigateRight"
            alt="Navigate Right" class="navigate-right-icon" :class="{ disabled: checkingAnswer }" />
        <div class="bottom-right-buttons">
            <CustomButton class="submit-button" :action="() => checkAnswer()" type="positive" :disabled="hasAnswered">
                <h4>Submit</h4>
            </CustomButton>
            <CustomButton class="reset-button" :action="() => resetOrder()" type="negative" :disabled="hasAnswered">
                <img :src="ResetIcon" alt="Reset" class="btn-img" />
            </CustomButton>
        </div>
        <div class="bottom-left-buttons">
            <CustomButton v-if="answerDisabled" class="back-to-leaderboard-button" :action="() => $router.push('/leaderboard')" type="neutral">
                <h4>Leaderboard</h4>
            </CustomButton>
            <CustomButton class="question-navigation-button" :action="() => $router.push('/question-navigation')"
                type="neutral" :disabled="false">
                <h4>Questions</h4>
            </CustomButton>
        </div>
        <div class="top-right-buttons">
            <TimerComponent class="timer-component" :gameTimer="gameTimer" />
            <h4 class="question-number border">{{ props.questionIndex + 1 }}/{{ questions.length }}</h4>
            <TutorialPopup class="tutorial-popup" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch, withDefaults, defineProps, onUnmounted, nextTick } from 'vue';
import CustomButton from '@/components/CustomButton.vue';
import TreeNode from '@/components/TreeNode.vue';
import APIManager from '@/types/APIManager';
import TimerComponent from '@/components/TimerComponent.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import { Session } from '@/types/Session';
import { PlayerSession } from '@/types/PlayerSession';
import { usePlayerSession } from '@/types/usePlayerSession';
import ResetIcon from '@/assets/reset.svg';
import NavigateLeft from '@/assets/navigate-left.svg';
import NavigateRight from '@/assets/navigate-right.svg';
import { QuestionAdapter } from '@/types/QuestionAdapter';
import TutorialPopup from '@/components/TutorialPopup.vue';
import ScreenBackground from '@/components/ScreenBackground.vue';

const showPrevArrow = computed(() => findPreviousUnanswered(props.questionIndex) !== null);
const showNextArrow = computed(() => findNextUnanswered(props.questionIndex) !== null);

const router = useRouter();
const { questions, gameTimer } = usePlayerSession();
const selectedOrder = ref<Map<number, number>>(new Map());
const hasAnswered = ref(false);
const answerDisabled = ref(false);
const session = ref<Session | null>(null);
const treeScale = ref(1);
const checkingAnswer = ref(false);

// In the TreeNode component, the nodes are red/green when this is a boolean, and blue when null.
const result = ref<boolean | null>(null);

interface Props {
    questionIndex: number;
}
const props = withDefaults(defineProps<Props>(), {
    questionIndex: 0
});

const calculateTreeScale = () => {
    nextTick(() => {
        const treeContainer = document.querySelector('.tree-container');
        if (!treeContainer) return;
        
        const containerRect = treeContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Define safe zones for buttons (with some padding)
        const bottomButtonHeight = 140; // Height reserved for bottom buttons + padding
        const sideButtonWidth = 200; // Width reserved for side buttons + padding
        
        // Calculate available space
        const availableHeight = viewportHeight - bottomButtonHeight - 100; // 100px for top margin
        const availableWidth = viewportWidth - (sideButtonWidth * 2); // Both sides
        
        // Calculate scale factors
        let scaleX = 1;
        let scaleY = 1;
        
        if (containerRect.height > availableHeight) {
            scaleY = availableHeight / containerRect.height;
        }
        
        if (containerRect.width > availableWidth) {
            scaleX = availableWidth / containerRect.width;
        }
        
        // Use the smaller scale to ensure tree fits in both dimensions
        const newScale = Math.min(scaleX, scaleY, 1); // Never scale up, only down
        treeScale.value = Math.max(newScale, 0.3); // Minimum scale of 0.3
    });
};

const initializeQuestion = async () => {
    checkingAnswer.value = false;
    session.value = await APIManager.getInstance().getSession();
    console.debug("Trying to find session...")
    if (!session.value || !(session.value instanceof PlayerSession)) return;
    console.debug("Found session", session.value);

    questions.value = session.value.getQuestions();
    console.log("Questions:", questions.value);
    gameTimer.value = session.value.getGameTimer();
    hasAnswered.value = await hasAnsweredQuestion(props.questionIndex);
    selectedOrder.value = new Map();
    answerDisabled.value = await answeredAllQuestions();
    
    if (hasAnswered.value) {
        result.value = session.value.getAnswers()[props.questionIndex] ?? false;
        if (await answeredAllQuestions()) {
            gameTimer.value?.stop(); // Stop counting down when the question is answered. Allows us to go back.
        }
    } else {
        gameTimer.value?.start();
        result.value = null; // Otherwise the nodes will be red/green.
    }
    
    // Calculate tree scale after DOM updates
    calculateTreeScale();
};

// Handle game end event
const handleGameEnded = (data: any) => {
    console.log("Game ended, navigating to leaderboard", data);
    router.push('/leaderboard');
};

onMounted(async () => {
    // Listen for game end event
    const session = await APIManager.getInstance().getSession();
    initializeQuestion();
    // Add window resize listener for responsive scaling
    window.addEventListener('resize', calculateTreeScale);
    
    if (session) {
        session.addEventListener("GAME_ENDED", handleGameEnded);
    }
});

onUnmounted(async () => {
    // Clean up resize listener
    window.removeEventListener('resize', calculateTreeScale);
    
    // Clean up game end event listener
    const session = await APIManager.getInstance().getSession();
    if (session) {
        session.removeEventListener("GAME_ENDED", handleGameEnded);
    }

    gameTimer.value?.stop();
});

// Immediate false just means it won't call on the first mount.
watch(() => props.questionIndex, () => {
    initializeQuestion();
}, { immediate: false });

const handleSelect = (newOrder: Map<number, number>) => {
    selectedOrder.value = newOrder;
};

const resetOrder = () => {
    selectedOrder.value.clear();
    result.value = null;
};

const checkAnswer = async () => {
    if (!session.value || !(session.value instanceof PlayerSession)) return;
    result.value = currentQuestion.value.isCorrect(selectedOrder.value);
    session.value.addAnswer(props.questionIndex, result.value ?? false);
    session.value.sendAnswer(props.questionIndex, QuestionAdapter.toBackendAnswer(selectedOrder.value));
    session.value.setAnswerTimes(props.questionIndex, gameTimer.value?.getLastAnswerTimeAndLogNewTime() ?? 0);
    hasAnswered.value = true;

    checkingAnswer.value = true;
    setTimeout(async () => {
        resetOrder();
        goToNextRelevantQuestion(props.questionIndex);
        checkingAnswer.value = false;
    }, 1000);
};

function goToNextRelevantQuestion(currentIndex: number) {
    const next = findNextUnanswered(currentIndex);
    if (next !== null) {
        router.push(`/question/${next}`);
        return;
    }

    // Use session answers as the source of truth
    if (!session.value || !(session.value instanceof PlayerSession)) {
        router.push('/leaderboard');
        return;
    }
    const answers = session.value.getAnswers();
    for (let i = 0; i < questions.value.length; i++) {
        if (answers[i] === undefined || answers[i] === null) {
            router.push(`/question/${i}`);
            return;
        }
    }

    // If all answered, go to leaderboard
    router.push('/leaderboard');
}

const answeredAllQuestions = async () => {
    if (!session.value || !(session.value instanceof PlayerSession)) return false;

    // Check if all previous questions (0 to currentIndex-1) have been answered
    const answers = session.value.getAnswers();
    for (let i = 0; i < questions.value.length; i++) {
        if (answers[i] === undefined || answers[i] === null) {
            return false;
        }
    }
    return true;
}

const hasAnsweredQuestion = async (questionIndex: number) => {
    if (!session.value || !(session.value instanceof PlayerSession)) return false;
    return session.value.getAnswers()[questionIndex] !== undefined && session.value.getAnswers()[questionIndex] !== null;
}

const currentQuestion = computed(() => {
    return questions.value[props.questionIndex];
})

const previousQuestion = () => {
    if (checkingAnswer.value) return;
    const prev = findPreviousUnanswered(props.questionIndex);
    if (prev !== null) router.push(`/question/${prev}`);
};

const nextQuestion = () => {
    if (checkingAnswer.value) return;
    const next = findNextUnanswered(props.questionIndex);
    if (next !== null) router.push(`/question/${next}`);
};

function findPreviousUnanswered(currentIndex: number): number | null {
    if (!session.value || !(session.value instanceof PlayerSession)) return null;
    const answers = session.value.getAnswers();
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (answers[i] === undefined || answers[i] === null) return i;
    }
    return null;
}

function findNextUnanswered(currentIndex: number): number | null {
    if (!session.value || !(session.value instanceof PlayerSession)) return null;
    const answers = session.value.getAnswers();
    for (let i = currentIndex + 1; i < questions.value.length; i++) {
        if (answers[i] === undefined || answers[i] === null) return i;
    }
    return null;
}

const handleReturnHome = async () => {
    const session: PlayerSession | null = await APIManager.getInstance().getSession() as PlayerSession;
    if (session) {
        session.leaveSession();
    }
    router.push('/');
}

</script>
<style scoped>
.question-view {
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

.navigate-left-icon,
.navigate-right-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 60px;
    flex-shrink: 0;
    cursor: pointer;
    z-index: 1000;
}

.navigate-left-icon {
    left: min(150px, 10vw);
}

.navigate-right-icon {
    right: min(150px, 10vw);
}

.navigate-left-icon.disabled,
.navigate-right-icon.disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.submit-button :deep(.btn-inner),
.reset-button :deep(.btn-inner),
.question-navigation-button :deep(.btn-inner),
.back-to-leaderboard-button :deep(.btn-inner) {
    height: 35px;
}

.submit-button :deep(.btn-inner),
.question-navigation-button :deep(.btn-inner) {
    padding: 2px 45px;
}

.reset-button :deep(.btn-inner) {
    padding: 2px 15px;
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

.bottom-left-buttons {
    position: absolute;
    bottom: 40px;
    left: 60px;
    display: flex;
    z-index: 90;
}

.back-to-home-button {
    position: absolute;
    top: 50px;
    left: 60px;
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

.question-number {
    padding-left: 10px;
    padding-right: 10px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box !important; /* This needs to match the timer component. So set it :) */
}
</style>

<style>
.tutorial-popup .btn.neutral {
    margin: 10px 0 !important;
}
</style>