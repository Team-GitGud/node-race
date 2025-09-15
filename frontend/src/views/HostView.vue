<template>
    <ScreenBackground blur />
    <!-- Host View -->
    <div class="host-view">
        <ReturnHomeComponent
            message="Are you sure you want to return to the home page? <br/> The session will continue, but you will not be able to reconnect to it." />
        <!-- Logo -->
        <LogoComponent />

        <!-- Left Side: Lobby Controls -->
        <div class="lobby-left">
            <div class="lobby-content">
                <h1>Lobby</h1>

                <!-- Game Code Section --><!-- Game Code Section -->
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


// ===== DATA & STATE =====

// Host Session Data
const { lobbyCode, players, gameStarted } = useHostSession();

// Copy Status Tracking
type CopyStatus = 'idle' | 'success' | 'error';
const copyStatus = ref<CopyStatus>('idle');

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

// Navigation
const goHome = () => {
    router.push('/');
};

// Handle Cancel/End Game button
const handleCancel = async () => {
    if (gameStarted.value) {
        // End the game session if it has started
        const apiManager = APIManager.getInstance();
        const session = await apiManager.getSession();
        if (session instanceof HostSession) {
            session.endSession();
        }
    }
    // Clear persisted game state when navigating home
    localStorage.removeItem('host-game-started');
    // Navigate home regardless of game state
    goHome();
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

/* Custom scrollbar styling for webkit browsers */
.player-list::-webkit-scrollbar {
    width: 0.5rem;
}

.player-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.player-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
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
</style>