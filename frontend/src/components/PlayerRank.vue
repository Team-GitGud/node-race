<template>
    <div class="player-rank" v-if="session && session instanceof PlayerSession">
        <div class="row-one">
            <div class="rank">
                <span class="rank-number" :class="getRankColor(playerLobbyRank)">{{playerLobbyRank}}.</span>
                <span>{{ playerNickname }}</span>
            </div>
            <span>{{parseInt(playerScore.toString())}}</span>
        </div>
        <div class="row-two">
            <span>Total Time Spent:</span>
            <span>{{ formattedTime }}</span>
        </div>
        <div class="row-three">
            <span>Number Correct:</span>
            <span>{{session.getAnswers().filter(answer => answer).length}}/{{ session.getQuestions().length }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, onUnmounted } from "vue";
import { Session } from "@/types/Session";
import { PlayerSession } from "@/types/PlayerSession";

const timeSpent = ref();

const props = defineProps<{
    session: Session | null;
}>();

// Create computed properties to make player data reactive
const player = computed(() => {
    if (props.session instanceof PlayerSession) {
        return props.session.getPlayer();
    }
    return null;
});

const playerLobbyRank = computed(() => {
    return player.value?.getLobbyRank() ?? -1;
});

const playerScore = computed(() => {
    return player.value?.getScore() ?? 0;
});

const playerNickname = computed(() => {
    return player.value?.getNickname() ?? '';
});

const formattedTime = computed(() => {
    const minutes = Math.floor(timeSpent.value / 60);
    const seconds = timeSpent.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const getRankColor = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank >= 3) return 'bronze';
    return '';
};

onMounted(async () => {
    if (props.session instanceof PlayerSession) {
        timeSpent.value = (60 * 5) - (props.session.getGameTimer()?.getTimeLeft() ?? 0);
    }
});
</script>

<style scoped>
.player-rank {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 160px;
}


.row-one,
.row-two,
.row-three {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.row-one span {
    font-size: 51px;
}

.row-two span {
    font-size: 31px;
}

.row-three span {
    font-size: 31px;
}

.rank {
    display: flex;
    gap: 20px;
}

.rank-number {
    color: var(--text-color);
}

.rank-number.gold {
    color: var(--gold-color);
}

.rank-number.silver {
    color: var(--silver-color);
}

.rank-number.bronze {
    color: var(--bronze-color);
}
</style>