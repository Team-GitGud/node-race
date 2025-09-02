<template>
    <div class="player-rank" v-if="session && session instanceof PlayerSession">
        <div class="row-one">
            <div class="rank">
                <span class="rank-number">1.</span>
                <span>{{ session.getPlayer().getNickname() }}</span>
            </div>
            <span>5000</span>
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
import { defineProps, computed, ref, onMounted } from "vue";
import { Session } from "@/types/Session";
import { PlayerSession } from "@/types/PlayerSession";

const timeSpent = ref();

const props = defineProps<{
    session: Session;
}>();

const formattedTime = computed(() => {
    const minutes = Math.floor(timeSpent.value / 60);
    const seconds = timeSpent.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
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
    color: #FFB246;
}
</style>