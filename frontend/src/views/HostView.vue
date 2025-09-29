<template>
    <!-- Screen Background -->
    <ScreenBackground blur />
    <!-- Host View -->
    <div class="host-view">

        <!-- Return Home Component -->
        <ReturnHomeComponent :message="exitModalMessage" :forceOpen="isExitModalOpen" :onConfirm="endGame"
            @modalClosed="isExitModalOpen = false" />

        <!-- Left Side: Lobby Controls -->
        <div class="lobby-left">

            <!-- if analytics should be shown, show analytics -->
            <div class="analytics-content" v-if="showAnalytics">

                <!-- Analytics Header -->
                <div class="analytics-header">
                    <!-- Title -->
                    <h1 title="Analytics">Analytics</h1>
                    <!-- Game Timer -->
                    <TimerComponent class="host-timer" :gameTimer="gameTimer" />
                </div>

                <!-- Question Analytics  -->
                <div class="question-analytics">
                    <div class="question-analytics-item" v-for="(question, index) in questions" :key="question.getId()">

                        <!-- Question Header -->
                        <div class="question-header">
                            <p class="question-title" title="">Q{{ index + 1 }}: {{ question.getTitle() }}</p>
                            <p class="question-time">Avg Time: {{ question.getAverageAnswerTime() }}</p>
                        </div>

                        <!-- Question Analytics Item Box -->
                        <div class="question-analytics-item-box">
                            
                            <!-- Correct Answers -->
                            <div v-if="question.getCorrectAnswerCount() > 0" class="question-analytics-item-box-correct"
                                :style="{ width: `${(question.getCorrectAnswerCount() / totalPlayers) * 100}%` }">
                                {{ question.getCorrectAnswerCount() }}
                            </div>
                            
                            <!-- Incorrect Answers -->
                            <div v-if="question.getIncorrectAnswerCount() > 0"
                                class="question-analytics-item-box-incorrect"
                                :style="{ width: `${(question.getIncorrectAnswerCount() / totalPlayers) * 100}%` }">
                                {{ question.getIncorrectAnswerCount() }}
                            </div>
                            
                            <!-- Unanswered Answers -->
                            <div class="question-analytics-item-box-unanswered"
                                :style="{ width: `${((totalPlayers - question.getCorrectAnswerCount() - question.getIncorrectAnswerCount()) / totalPlayers) * 100}%` }">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="buttons">
                    
                    <!-- Cancel/End Game button -->
                    <CustomButton :action="handleCancel" type="negative" class="cancel-button" :width="150">
                        {{ cancelButtonText }}
                    </CustomButton>
                </div>

            </div>

            <!-- else show lobby -->
            <div class="lobby-content" v-if="!showAnalytics">

                <!-- Title -->
                <h1 title="Lobby">Lobby</h1>

                <!-- Game Code Section -->
                <div class="game-code-container">
                    <p class="game-code-label" title="Game Code">Game Code:</p>
                    
                    <!-- Copy Game Code Button -->
                    <CustomButton :action="copyLobbyCode" :width="copyButtonWidth" :type="copyButtonType"
                        class="copy-button" title="Copy Game Code">
                        {{ lobbyCode }} &nbsp;
                        <FontAwesomeIcon :icon="faCopy" />
                    </CustomButton>
                </div>

                <!-- Buttons -->
                <div class="buttons">
                    <!-- Cancel/End Game button -->
                    <CustomButton :action="handleCancel" type="negative" class="cancel-button" :width="110" title="Cancel/End Game">
                        {{ cancelButtonText }}
                    </CustomButton>

                    <!-- Start Game Button -->
                    <CustomButton :action="startGame" :type="startButtonType" class="start-button" :width="110"
                        :disabled="startButtonDisabled" title="Start Game">
                        {{ startButtonText }}
                    </CustomButton>
                </div>
            </div>
        </div>

        <!-- Right Side: Players List -->
        <div class="lobby-right border">
            <div class="lobby-content player-content">
                <div class=" player-list-title-container">
                    <h2 class="player-list-title" title="Players List">Players ({{ playersData.length }})</h2>
                </div>
                <div class="player-list">
                    <!-- if analytics should be shown, show players with answers -->
                    <div v-if="showAnalytics">
                        <div v-for="PlayerAnswers in playersData" :key="PlayerAnswers.getId()" class="player-item">
                            
                            <!-- Player Info first row -->
                            <div class="player-info-top">
                                
                                <!-- Player Info grouped on the Left -->
                                <div class="player-info-left">
                                    <span class="player-rank" title="Rank" :style="{ color: getRankColor(playersData.indexOf(PlayerAnswers) + 1) }">{{ playersData.indexOf(PlayerAnswers) + 1 }}.</span>
                                    <span class="player-name" title="Player Name">{{ PlayerAnswers.getNickname() }}</span>
                                </div>
                            
                                <!-- Player Score -->
                                <span class="player-score" title="Score">{{ PlayerAnswers.getScore() }}</span>
                               
                                <!-- Kick Player Button -->
                                <div v-if="!gameEnded">
                                    <CustomButton :action="() => kickPlayer(PlayerAnswers.getId())" type="negative"
                                        class="kick-button" title="Kick player">
                                        X
                                    </CustomButton>
                                </div>
                            </div>

                            <!-- Player Info second row -->
                            <div class="player-info-bottom">
                                
                                <!-- Progress Indicators -->
                                <div class="progress-indicators">
                                   
                                    <!-- Answers Indicators -->
                                    <template v-for="(answer, index) in PlayerAnswers.getAnswers()" :key="index">
                                        
                                        <!-- Indicator -->
                                        <div class="indicator" :class="{
                                            'correct': answer === true,
                                            'incorrect': answer === false,
                                            'unanswered': answer !== true && answer !== false
                                        }" :title="index + 1 + '. ' + (answer === true ? 'Correct' : answer === false ? 'Incorrect' : 'Unanswered')">
                                        </div>
                                        
                                        <!-- Indicator Separator -->
                                        <span v-if="index < PlayerAnswers.getAnswers().length - 1"
                                            class="indicator-separator">-</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- else show just players -->
                    <div v-if="!showAnalytics">
                        <div v-for="player in playersData" :key="player.getId()" class="player-item">

                            <!-- Player Info first row -->
                            <div class="player-info-top">

                                <!-- Player Info grouped on the Left -->
                                <div class="player-info-left">
                                    <span class="player-name">{{ player.getNickname() }}</span>
                                </div>

                                <!-- Kick Player Button -->
                                <div v-if="!gameEnded">
                                    <CustomButton :action="() => kickPlayer(player.getId())" type="negative" class="kick-button">
                                        X
                                    </CustomButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

// Vue & Core Imports
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

// Components
import CustomButton from '@/components/CustomButton.vue';
import ReturnHomeComponent from '@/components/ReturnHomeComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import ScreenBackground from '@/components/ScreenBackground.vue';
import TimerComponent from '@/components/TimerComponent.vue';

// Types & Services
import APIManager from '@/types/APIManager';
import { HostSession } from '@/types/HostSession';
import { useHostSession } from '@/types/useHostSession';
import { GameTimer } from '@/types/GameTimer';

// ===== DATA & STATE =====

// Host Session Data
const { lobbyCode, playersData, questions, gameStarted, gameEnded, showAnalytics, gameTimer } = useHostSession();

// Router instance
const router = useRouter();

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
    return playersData.value && playersData.value.length > 0;
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

// Cancel button text based on analytics view state
const cancelButtonText = computed(() => {
    if (gameEnded.value) {
        return 'Return Home';
    }
    return showAnalytics.value ? 'End Game' : 'Cancel';
});

// Exit modal message based on analytics view state (used by all exit actions)
const exitModalMessage = computed(() => {
    return showAnalytics.value
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

// Get rank color based on position
const getRankColor = (rank: number) => {
    switch (rank) {
        case 1:
            return 'var(--gold-color)';
        case 2:
            return 'var(--silver-color)';
        case 3:
            return 'var(--bronze-color)';
        default:
            return 'var(--text-color)';
    }
};

// ===== METHODS =====

// Handle Cancel/End Game button
const handleCancel = async () => {
    // If game has ended, return home directly without warning
    if (gameEnded.value) {
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();
        if (session instanceof HostSession) {
            session.endGame();
        }
        router.push('/');
        return;
    }
    isExitModalOpen.value = true;
};

// Start Game Management
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

// End Game Management
const endGame = async () => {
    isNavigatingAway.value = true;

    const apiManager = APIManager.getInstance();
    const session = await apiManager.getSession();
    if (session instanceof HostSession) {
        session.endGame();
    }

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

// Window resize listener
onMounted(() => {
    window.addEventListener('resize', handleResize);
});

// Window resize listener cleanup
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

// Navigation state for back button handling
const isNavigatingAway = ref(false);
const navigationCallback = ref<((value: boolean) => void) | null>(null);

// Route leave guard for back button navigation
onBeforeRouteLeave((to: any, from: any, next: (value: boolean) => void) => {

    // If game has ended, allow navigation
    if (gameEnded.value) {
        next(true);
        return;
    }

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
const totalPlayers = computed(() => playersData.value.length);

</script>

<!-- Styles -->
<style scoped>

/* Layout */
.host-view {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    min-height: 100vh;
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
    color: var(--text-color);
}

@media (max-width: 1055px) {

    .lobby-right {
        max-height:none
    }
    .lobby-left {
        max-height: none;
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
}


.player-list-title {
    font-size: 50px;
    color: var(--text-color);
    border-bottom: 3px solid var(--accent-color);
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
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    align-items: center;
    font-size: 3rem;
    color: var(--text-color);
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 3px solid var(--accent-color);
}

.player-info-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
}

.player-info-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 2rem;
}

.player-info-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.player-name {
    overflow: hidden;
    text-wrap: nowrap;
    width: 250px;
    text-align: left;
}

.player-rank {
    font-weight: bold;
    min-width: 2rem;
}

.player-score {
    width: 5rem;
    text-align: right;
    overflow: hidden;
}

.progress-indicators {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    justify-content: space-between;
}

.indicator {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
}

.correct {
    background: var(--positive-color);
}

.incorrect {
    background: var(--negative-color);
}

.unanswered {
    background: rgba(255, 255, 255, 0.1);
}

.kick-button :deep(.btn-inner) {
    font-size: 2rem;
    padding: 5px 0px;
    min-width: 50px;
}

/* Host Timer */
.host-timer {
    margin-bottom: 2rem;
    align-self: flex-end;
}

/* Question Analytics Styles */
.analytics-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    gap: 2rem;
}

.question-analytics {
    display: flex;
    min-width: 500px;
    flex-direction: column;
    gap: 2.5rem;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    flex: 1;
    padding-right: 1rem;
    min-height: 0;
    /* Allow flex item to shrink below content size */
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    gap: 1rem;
}

.question-title {
    font-size: 2.5rem;
}

.question-time {
    font-size: 2rem;
}

/* Question Analytics Item Box */
.question-analytics-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.question-analytics-item-box {
    display: flex;
    height: 30px;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    max-height: 30vh;
}

.question-analytics-item-box-correct {
    background: var(--positive-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
}

.question-analytics-item-box-incorrect {
    background: var(--negative-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
}

.question-analytics-item-box-unanswered {
    background: rgba(255, 255, 255, 0.1);
}

.analytics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.host-timer {
    margin-right: 1.0rem;
}
</style>