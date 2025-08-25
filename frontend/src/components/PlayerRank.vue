<template>
    <div class="player-rank">
        <div class="row-one">
            <div class="rank">
                <span class="rank-number">1.</span>
                <span>Alan</span>
            </div>
            <span>5000</span>
        </div>
        <div class="row-two">
            <span>Total Time:</span>
            <span>00:00</span>
        </div>
        <div class="row-three">
            <span>Number Correct:</span>
            <span>5/5</span>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.player-rank {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 5% 10%;
    box-sizing: border-box;
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