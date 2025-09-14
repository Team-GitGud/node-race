<template>
    <CustomButton shrink :action="() => isOpen = true">?</CustomButton>
    <ModalPopup title="Tutorial" v-if="isOpen" @close="isOpen = false">
        <template #body>
            <p style="padding-bottom: 15px">What do you want to learn?</p>
            <div class="tutorial-cards">
                <TutorialCard title="DFS:" subtitle="Pre-order" :image="imgDFSPre"/>
                <TutorialCard title="DFS:" subtitle="In-order" :image="imgDFSIn"/>
                <TutorialCard title="DFS:" subtitle="Post-order" :image="imgDFSPost"/>
                <TutorialCard title="BFS" :image="imgBFS"/>
            </div>
        </template>
        <template #footer>
            <CustomButton :action="() => isOpen = false" type="negative">Close</CustomButton>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from './CustomButton.vue';
import ModalPopup from './ModalPopup.vue';
import TutorialCard from './TutorialCard.vue';
import imgDFSPre from '@/assets/tutorial/DFS_pre-order_preview.png';
import imgDFSIn from '@/assets/tutorial/DFS_in-order_preview.png';
import imgDFSPost from '@/assets/tutorial/DFS_post-order_preview.png';
import imgBFS from '@/assets/tutorial/BFS_preview.png';

const isOpen = ref(false);
</script>


<style scoped>
.tutorial-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    justify-items: center;
    align-items: center;
}

@media (max-width: 600px) {
    .tutorial-cards {
        grid-template-columns: 1fr;
        max-height: 350px;
        overflow-y: auto;
    }
}
</style>