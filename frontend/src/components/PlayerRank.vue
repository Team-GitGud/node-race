<template>
    <div class="player-rank" v-if="session && session instanceof PlayerSession">
        <div class="row-one">
            <div class="rank">
                <span class="rank-number" :class="getRankColor(playerRank)">{{playerRank}}.</span>
                <span>{{ session.getPlayer().getNickname() }}</span>
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
const playerRank = ref(-1);
const playerScore = ref(-1);

const props = defineProps<{
    session: Session | null;
}>();

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

// Event handler for rank updates
const handleRankUpdate = (data: { rank: number; lobbyRank: number }) => {
    console.debug("Rank updated", data);
    playerRank.value = data.rank;
};

// Event handler for score updates
const handleScoreUpdate = (data: { score: number; rank: number }) => {
    console.debug("Score updated", data);
    playerScore.value = data.score;
    playerRank.value = data.rank; // This is the lobby rank
};

onMounted(async () => {
    if (props.session instanceof PlayerSession) {
        playerRank.value = props.session.getPlayer().getLobbyRank();
        playerScore.value = props.session.getPlayer().getScore();
        timeSpent.value = (60 * 5) - (props.session.getGameTimer()?.getTimeLeft() ?? 0);
        
        // Listen for rank updates
        props.session.addEventListener("RANK_UPDATED", handleRankUpdate);
        
        // Listen for score updates
        props.session.addEventListener("SCORE_UPDATED", handleScoreUpdate);
    }
});

onUnmounted(() => {
    // Clean up event listeners
    if (props.session instanceof PlayerSession) {
        props.session.removeEventListener("RANK_UPDATED", handleRankUpdate);
        props.session.removeEventListener("SCORE_UPDATED", handleScoreUpdate);
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