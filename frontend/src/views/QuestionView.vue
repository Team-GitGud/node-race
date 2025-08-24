<template>
    <div class="question-view">
        <CustomButton :action="() => $router.push('/')" style="position: absolute; top: 20px; left: 20px;">Back to Home</CustomButton>
        <h2 v-if="currentQuestion">{{ currentQuestion.title }}</h2>
        <img :src="NavigateLeft" alt="Navigate Left" class="navigate-left-icon"/>
        <div class="tree-container">
            <TreeNode
                v-if="currentQuestion"
                :node="currentQuestion.root"
                :selectedOrder="selectedOrder"
                :correctOrder="currentQuestion.correctOrder"
                :result="result"
                @select="handleSelect"
                style="margin-top: 0px;"
            />
        </div>
        <img :src="NavigateRight" alt="Navigate Right" class="navigate-right-icon"/>
        <div class="bottom-right-buttons">
            <CustomButton class="submit-button" :action="() => checkAnswer()" type="positive" :disabled="false">
                <h3>Submit</h3>
            </CustomButton>
            <CustomButton class="reset-button" :action="() => resetOrder()" type="negative" :disabled="false">
                <img :src="ResetIcon" alt="Reset" class="reset-icon"/>
            </CustomButton>
        </div>
        <div class="bottom-left-buttons">
            <CustomButton class="question-navigation-button" :action="() => $router.push('/question-navigation')" type="neutral" :disabled="false">
                <h3>Questions</h3>
            </CustomButton>
        </div>
        <TimerComponent class="timer-component" :gameTimer="gameTimer" />
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

const router = useRouter();
const session = APIManager.getInstance().getSession();
const gameTimer = ref<GameTimer | null>(null);

interface Props {
    questionIndex?: number;
}
const props = withDefaults(defineProps<Props>(), {
    questionIndex: 0
});

// Convert questionIndex to number
const questionIndex = computed(() => Number(props.questionIndex));
// Reactive data
const { questions } = usePlayerSession();
const selectedOrder = ref<Map<number, number>>(new Map());

// We make this null to indicate the result hasn't been checked yet.
// In the TreeNode component, the nodes are red/green when this is a boolean, and blue when null.
const result = ref<boolean|null>(null);

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
    }

    // TODO: Send the result to the backend. Make the question not available for the player to answer again.
    setTimeout(async () => {
        resetOrder();
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
        while (hasAnsweredQuestion(props.questionIndex + i)) {
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

const hasAnsweredQuestion = (questionIndex: number) => {
    if (session && session instanceof PlayerSession) {
        const answers = session.getAnswers();
        return answers[questionIndex] !== undefined;
    }
}

const currentQuestion = computed(() => {
    return questions.value[props.questionIndex];
})

onMounted(() => {
    if (session && session instanceof PlayerSession) {
        questions.value = session.getQuestions();
        gameTimer.value = session.getGameTimer();
    }
    selectedOrder.value = new Map();
    result.value = null;
    // Use for testing, remove later. This will create a mock question if we go to a question 0 with no lobby.
    if (questions.value.length == 0) {
        const start = new Date().getTime();
        const fiveMinutes = 1000 * 60 * 5;
        gameTimer.value = new GameTimer(start, start + fiveMinutes);
        gameTimer.value.start();
        questions.value.push(new Question(
            0,
            "In order Depth first search",
            new Node(
                0,
                new Node(1, new Node(3), new Node(4)),
                new Node(2, null, new Node(5))
            ),
            new Map([[3, 1], [4, 2], [1, 3], [0, 4], [2, 5], [5, 6]])
        ));
    }
});

watch(currentQuestion, () => {
    selectedOrder.value = new Map();
    result.value = null;
});

</script>
<style scoped>
h2 {
    font-size: 64px;
    margin-top: 40px;
    padding: 0 20px 10px 20px;
    border-bottom: 2px solid var(--text-color);
}

.tree-container {
    margin-top: 10vh;
}
.question-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.navigate-left-icon {
    position: absolute;
    left: 150px; /* Increased from 20px to move closer to middle */
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 88px;
    flex-shrink: 0;
}

.navigate-right-icon {
    position: absolute;
    right: 150px; /* Increased from 20px to move closer to middle */
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 88px;
    flex-shrink: 0;
}

.timer-component {
    position: absolute;
    top: 20px;
    right: 20px;
}

.submit-button :deep(.btn-inner) {
    height: 53px;
}

.reset-button :deep(.btn-inner) {
    height: 53px;
    padding: 2px 15px;
}

.reset-icon {
    width: 30px;
    height: 30px;
}

.bottom-right-buttons {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center; /* Aligns buttons vertically */
    gap: 10px; /* Consistent spacing between buttons */
}

.bottom-left-buttons {
    position: absolute;
    bottom: 20px;
    left: 20px;
}

</style>