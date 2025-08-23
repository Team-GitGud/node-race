<template>
    <div class="question-view">
        <CustomButton :action="() => $router.push('/')" style="position: absolute; top: 20px; left: 20px;">Back to Home</CustomButton>
        <h2 v-if="currentQuestion">{{ currentQuestion.title }}</h2>
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
        <div style="display: flex; justify-content: center; gap: 20px;">
            <CustomButton :action="() => checkAnswer()" type="positive" :disabled="false">Submit</CustomButton>
            <CustomButton :action="() => resetOrder()" type="negative" :disabled="false">Reset</CustomButton>
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

const router = useRouter();
const session = APIManager.getInstance().getSession();
const gameTimer = ref<GameTimer | null>(null);

interface Props {
    questionIndex?: number;
}
const props = withDefaults(defineProps<Props>(), {
    questionIndex: 0
});
const questions = ref<Question[]>([]);
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

const checkAnswer = () => {
    console.log("Correct Order: ", currentQuestion.value.correctOrder);
    result.value = currentQuestion.value.isCorrect(selectedOrder.value);
    if (session && session instanceof PlayerSession) {
        session.addAnswer(props.questionIndex, result.value ?? false);
    }

    // TODO: Send the result to the backend. Make the question not available for the player to answer again.
    setTimeout(() => {
        resetOrder();

        if (answeredAllQuestions()) {
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

const answeredAllQuestions = () => {
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

.timer-component {
    position: absolute;
    top: 20px;
    right: 20px;
}
</style>