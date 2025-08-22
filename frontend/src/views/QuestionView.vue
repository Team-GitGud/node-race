<template>
    <div class="question-view">
        <CustomButton :action="() => $router.push('/')" style="position: absolute; top: 20px; left: 20px;">Back to Home</CustomButton>
        <!-- <h2>{{ question.title }}</h2> -->
        <!-- <div class="tree-container">
            <TreeNode
                :node="question.root"
                :selectedOrder="selectedOrder"
                :result="result"
                @select="handleSelect"
                style="margin-top: 0px;"
            />
        </div>
        <div style="display: flex; justify-content: center; gap: 20px;">
            <CustomButton :action="() => checkAnswer()" type="positive" :disabled="answerReady() || result !== null">Submit</CustomButton>
            <CustomButton :action="() => resetOrder()" type="negative" :disabled="isOriginal() || result !== null">Reset</CustomButton>
        </div> -->
    </div>
</template>

<script lang="ts" setup>

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
</style>