<template>
    <ScreenBackground blur />
    <!-- Host View -->
    <div class="host-view">
        <ReturnHomeComponent
            :message="exitModalMessage"
            :forceOpen="isExitModalOpen"
            :onConfirm="endGame"
            @modalClosed="isExitModalOpen = false"/>

        <!-- Left Side: Lobby Controls -->
        <div class="lobby-left">

            <!-- if game started, show analytics -->
            <div class="analytics-content" v-if="gameStarted">

                <!-- Title -->
                <h1>Analytics</h1>

                <!-- Question Analytics  -->
                <div class="question-analytics">
                    <div class="question-analytics-item" v-for="(question, index) in questions" :key="question.id">
                        <div class="question-header">
                            <p class="question-title">Q{{ index + 1 }}: {{ question.title }}</p>
                            <p class="question-time">Avg Time: {{ question.averageAnswerTime }}</p>
                        </div>
                        <div class="question-analytics-item-box">
                            <div 
                                v-if="question.correctAnswerCount > 0" 
                                class="question-analytics-item-box-correct" 
                                :style="{ width: `${(question.correctAnswerCount / totalPlayers) * 100}%` }"
                            >
                                {{ question.correctAnswerCount }}
                            </div>
                            <div 
                                v-if="question.incorrectAnswerCount > 0" 
                                class="question-analytics-item-box-incorrect" 
                                :style="{ width: `${(question.incorrectAnswerCount / totalPlayers) * 100}%` }"
                            >
                                {{ question.incorrectAnswerCount }}
                            </div>
                            <div 
                                class="question-analytics-item-box-unanswered" 
                                :style="{ width: `${((totalPlayers - question.correctAnswerCount - question.incorrectAnswerCount) / totalPlayers) * 100}%` }"
                            ></div>
                        </div>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="buttons">
                    <!-- Cancel/End Game button -->
                    <CustomButton :action="handleCancel" type="negative" class="cancel-button" :width="110">
                        {{ cancelButtonText }}
                    </CustomButton>
                </div>

            </div>

            <!-- else show lobby -->
            <div class="lobby-content" v-else>

                <!-- Title -->
                <h1>Lobby</h1>

                <!-- Game Code Section -->
                <div class="game-code-container">
                    <p class="game-code-label">Game Code:</p>
                    <CustomButton :action="copyLobbyCode" :width="copyButtonWidth" :type="copyButtonType"
                        class="copy-button">
                        {{ lobbyCode }} &nbsp;
                        <FontAwesomeIcon :icon="faCopy" />
                    </CustomButton>
                </div>

                <!-- Buttons -->
                <div class="buttons">
                    <!-- Cancel/End Game button -->
                    <CustomButton :action="handleCancel" type="negative" class="cancel-button" :width="110">
                        {{ cancelButtonText }}
                    </CustomButton>

                    <!-- Start Game Button -->
                    <CustomButton :action="startGame" :type="startButtonType" class="start-button" :width="110"
                        :disabled="startButtonDisabled">
                        {{ startButtonText }}
                    </CustomButton>
                </div>
            </div>
        </div>

        <!-- Right Side: Players List -->
        <div class="lobby-right border">
            <div class="lobby-content player-content">
                <div class=" player-list-title-container">
                    <h2 class="player-list-title">Players ({{ players.length }})</h2>
                </div>
                <div class="player-list">
                    <div v-for="player in players" :key="player.id" class="player-item">
                        <span class="player-name">{{ player.nickname }}</span>
                        <CustomButton :action="() => kickPlayer(player.id)" type="negative" class="kick-button">
                            X
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

// Vue & Core Imports
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import router from '@/router';

// Components
import CustomButton from '@/components/CustomButton.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import ScreenBackground from '@/components/ScreenBackground.vue';

// Types & Services
import APIManager from '@/types/APIManager';
import { HostSession } from '@/types/HostSession';
import { useHostSession } from '@/types/useHostSession';
import { HostQuestion } from '@/types/HostQuestion';


// ===== DATA & STATE =====

// Host Session Data
const { lobbyCode, players, gameStarted} = useHostSession();


//Fake questions data for testing
const questions = ref<HostQuestion[]>([
    {
        id: 1,
        title: 'Question 1',
        averageAnswerTime: 10,
        correctAnswerCount: 10,
        incorrectAnswerCount: 0
    },
    {
        id: 2,
        title: 'Question 2',
        averageAnswerTime: 20,
        correctAnswerCount: 8,
        incorrectAnswerCount: 2
    },
    {
        id: 3,
        title: 'Question 3',
        averageAnswerTime: 30,
        correctAnswerCount: 5,
        incorrectAnswerCount: 5
    },
    {
        id: 4,
        title: 'Question 4',
        averageAnswerTime: 40,
        correctAnswerCount: 2,
        incorrectAnswerCount: 1
    },
    {
        id: 5,
        title: 'Question 5',
        averageAnswerTime: 50,
        correctAnswerCount: 0,
        incorrectAnswerCount: 0
    },
]);

// Copy Status Tracking
type CopyStatus = 'idle' | 'success' | 'error';
const copyStatus = ref<CopyStatus>('idle');

// Modal state for exit confirmation (used by cancel button and back navigation)
const isExitModalOpen = ref(false);

// Screen Width Tracking for Responsive Design
const screenWidth = ref(window.innerWidth);

// ===== COMPUTED PROPERTIES =====

// Dynamic button type based on copy status
const copyButtonType = computed(() => {
    switch (copyStatus.value) {
        case 'success':
            return 'positive';
        case 'error':
            return 'negative';
        default:
            return 'neutral';
    }
});

// Check if game can start (at least one player required)
const canStartGame = computed(() => {
    return players.value && players.value.length > 0;
});

// Start button text based on game state
const startButtonText = computed(() => {
    if (gameStarted.value) {
        return 'Started';
    }
    return canStartGame.value ? 'Start' : 'No Players';
});

// Start button type based on game state
const startButtonType = computed(() => {
    if (gameStarted.value) {
        return 'neutral';
    }
    return canStartGame.value ? 'positive' : 'neutral';
});

// Start button disabled state
const startButtonDisabled = computed(() => {
    return !canStartGame.value || gameStarted.value;
});

// Cancel button text based on game state
const cancelButtonText = computed(() => {
    return gameStarted.value ? 'End Game' : 'Cancel';
});

// Exit modal message based on game state (used by all exit actions)
const exitModalMessage = computed(() => {
    return gameStarted.value
        ? 'Are you sure you want to end the game? <br/> All players will be disconnected and you will not be able to reconnect.'
        : 'Are you sure you want to cancel the lobby? <br/> All players will be disconnected.';
});

// Responsive button width based on screen size
const copyButtonWidth = computed(() => {
    if (screenWidth.value < 550) {
        return 230;
    }
    else {
        return 410;
    }
});

// ===== METHODS =====

// Handle Cancel/End Game button
const handleCancel = () => {
    isExitModalOpen.value = true;
};

// Game Management
const startGame = async () => {
    if (!canStartGame.value) {
        console.log('Cannot start game: no players available');
        return;
    }

    const apiManager = APIManager.getInstance();
    const session = await apiManager.getSession();
    if (session instanceof HostSession) {
        session.startGame();
    }
};

const endGame = async () => {
    isNavigatingAway.value = true;

    const apiManager = APIManager.getInstance();
    const session = await apiManager.getSession();
    if (session instanceof HostSession) {
        session.endGame();
    }
    // Clear persisted game state when navigating home
    localStorage.removeItem('host-game-started');

    // Allow any pending navigation (like back button) to proceed
    if (navigationCallback.value) {
        navigationCallback.value(false); // Cancel back navigation since we're navigating programmatically
        navigationCallback.value = null;
    }
}

// Clipboard Operations
const copyLobbyCode = async () => {
    try {
        await navigator.clipboard.writeText(lobbyCode.value);
        copyStatus.value = 'success';
    } catch (error) {
        console.error('Failed to copy lobby code:', error);
        copyStatus.value = 'error';
    }

    // Reset status after 2 seconds
    setTimeout(() => {
        copyStatus.value = 'idle';
    }, 2000);
};

// Player Management
const kickPlayer = async (playerId: string) => {
    const apiManager = APIManager.getInstance();
    const session = await apiManager.getSession();
    if (session instanceof HostSession) {
        session.kickPlayer(playerId);
    }
};

// ===== LIFECYCLE HOOKS =====

// Window resize listener for responsive design
const handleResize = () => {
    screenWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

// Navigation state for back button handling
const isNavigatingAway = ref(false);
const navigationCallback = ref<((value: boolean) => void) | null>(null);

// Route leave guard for back button navigation
onBeforeRouteLeave((to: any, from: any, next: (value: boolean) => void) => {
    // If already navigating programmatically (e.g., after confirming modal), allow it
    if (isNavigatingAway.value) {
        next(true);
        return;
    }

    // Show shared confirmation modal
    isExitModalOpen.value = true;

    // Store the next callback to call it later
    navigationCallback.value = next;

    // Don't proceed with navigation yet - wait for user response
    next(false);
});

// Total players for analytics
//const totalPlayers = computed(() => players.value.length);
const totalPlayers = 10;

</script>

<style scoped>
.host-view {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    min-height: 100vh;
    min-width: 100vw;
    padding: 2rem;
    box-sizing: border-box;
}

.lobby-left {
    flex: 1 1 30rem;
    display: flex;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;
}

.lobby-right {
    flex: 0 1 30rem;
    display: flex;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;
    padding: 1rem;
}



.lobby-content {
    width: 100%;
    max-width: 30rem;
    height: 100%;
    min-height: 40vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.player-content {
    justify-content: flex-start;
}

.game-code-container {
    margin-bottom: 5rem;
}

.game-code-label {
    font-size: 3rem;
    color: #ffffff;
}

@media (max-width: 1055px) {
    .lobby-right {
        max-height: 50%;
    }

    .lobby-left {
        max-height: 50%;
    }

    .game-code-container {
        margin-bottom: 1rem;
    }
}



/* Copy Button */

.copy-button :deep(.btn-inner) {
    font-size: 5rem;
    padding: 1rem 2rem;
}

/* Copy Button Icon */
.copy-button :deep(.btn-inner svg) {
    width: 5rem;
    height: 4rem;
}

@media (max-width: 550px) {
    .copy-button :deep(.btn-inner) {
        font-size: 3rem;
    }

    .copy-button :deep(.btn-inner svg) {
        font-size: 3rem;
    }
}

.start-button :deep(.btn-inner) {
    padding: 0.5rem 0.1rem;
}

.cancel-button :deep(.btn-inner) {
    padding: 0.5rem 0.1rem;
}

.player-list-title-container {
    padding-right: 1.5rem;
}

.buttons {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
    margin-top: auto;
}


.player-list-title {
    font-size: 50px;
    color: #ffffff;
    border-bottom: 3px solid white;
}

.player-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 1rem;
}

.player-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 3rem;
    color: #ffffff;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 3px solid white;
}

.player-name {
    overflow: hidden;
    text-wrap: nowrap;
}

.kick-button :deep(.btn-inner) {
    font-size: 2rem;
    padding: 5px 0px;
    min-width: 50px;
}



/* Question Analytics Styles */

.analytics-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding-bottom: 2rem;
    box-sizing: border-box;
}

.question-analytics{

    display: flex;
    min-width: 500px;
    flex-direction: column;
    gap: 1rem;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1rem;
    flex: 1;
    min-height: 0; /* Allow flex item to shrink below content size */
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.question-title {
    font-weight: bold;
    font-size: 2.5rem;
}

.question-time {
    font-size: 2rem;
}

.question-analytics-item-box {
    display: flex;
    height: 30px;
    background: #f0f0f0;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    max-height: 30vh;
}

.question-analytics-item-box-correct {
    background: #139705;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
}

.question-analytics-item-box-incorrect {
    background: #AA0707;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
}

.question-analytics-item-box-unanswered {
    background: white;
}
</style>