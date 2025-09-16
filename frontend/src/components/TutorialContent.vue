<!-- 
    A component to display tutorial content with navigation between two pages:
    - Page 1: Text explanation and static image
    - Page 2: Animated example using AnimationComponent

    Usage:
    <TutorialContent title="DFS: Pre-order" :static="staticImagePath" @close="handleClose" @back="handleBack">
        <p>Your tutorial text here.</p>
    </TutorialContent>

    Note: The static prop should contain the imported static example image path.
-->
<template>
    <!-- This contain the first page with the text and static image example -->
    <div v-if="pageIndex === 0">
        <ModalPopup :title="title" @close="$emit('close')">
            <template #body>
                <div class="tutorial-body">
                    <div class="tutorial-content">
                        <slot />
                        <div class="example-container">
                            <img class="static-example" :src="static" alt="Tutorial Static Example"/>
                        </div>
                    </div>
                    <img @click="pageIndex = 1" :src="NavigateRight" alt="Navigate Right" class="navigate-right-icon" />
                </div>
            </template>
            <template #footer>
                <CustomButton :action="() => $emit('back')" type="neutral">Back</CustomButton>
                <CustomButton :action="() => $emit('close')" type="negative">Close</CustomButton>
            </template>
        </ModalPopup>
    </div>

    <!-- This contain the second page with the animated example -->
    <div v-if="pageIndex === 1">
        <ModalPopup :title="title" @close="$emit('close')">
            <template #body>
                <div class="tutorial-body">
                    <img @click="pageIndex = 0" :src="NavigateLeft" alt="Navigate Left" class="navigate-left-icon"/>
                    <div class="tutorial-content">
                        <h4 style="padding: 0 45px 20px 0">Here is an animated example with a larger tree:</h4>
                        <div class="example-container">
                            <AnimationComponent :title="title" />
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <CustomButton :action="() => $emit('back')" type="neutral">Back</CustomButton>
                <CustomButton :action="() => $emit('close')" type="negative">Close</CustomButton>
            </template>
        </ModalPopup>
    </div>
</template>

<script setup lang="ts">
import ModalPopup from './ModalPopup.vue';
import CustomButton from './CustomButton.vue';
import AnimationComponent from './AnimationsComponent.vue';
import NavigateLeft from '@/assets/navigate-left.svg';
import NavigateRight from '@/assets/navigate-right.svg';
import { defineProps, ref } from 'vue';

defineProps<{
    title: string;
    static: string;
}>();

let pageIndex = ref(0);
</script>

<style scoped>
.tutorial-body {
    display: flex;
    flex-direction: row;
    gap: 30px;
}

.tutorial-content {
    display: flex;
    flex-direction: column;
}

.example-container {
    display: flex;
    justify-content: center;;
}

.static-example { 
    height: 150px;
    padding-top: 10px;
}

.navigate-left-icon,
.navigate-right-icon {
    position: relative;
    height: 40px;
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;
}
</style>