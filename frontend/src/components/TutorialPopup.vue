<template>
    <CustomButton shrink :action="() => isOpen = true">?</CustomButton>
    <ModalPopup title="Tutorial" v-if="isOpen && currentTutorial === null" @close="isOpen = false">
        <template #body>
            <p style="padding-bottom: 15px">What do you want to learn?</p>
            <div class="tutorial-cards">
                <CustomButton :shrink="true" :action="() => currentTutorial = 'DFS: Pre-order'">
                    <TutorialCard title="DFS:" subtitle="Pre-order" :image="previewDFSPre" />
                </CustomButton>

                <CustomButton :shrink="true" :action="() => currentTutorial = 'DFS: In-order'">
                    <TutorialCard title="DFS:" subtitle="In-order" :image="previewDFSIn"/>
                </CustomButton>

                <CustomButton :shrink="true" :action="() => currentTutorial = 'DFS: Post-order'">
                    <TutorialCard title="DFS:" subtitle="Post-order" :image="previewDFSPost"/>
                </CustomButton>

                <CustomButton :shrink="true" :action="() => currentTutorial = 'BFS'">
                    <TutorialCard title="BFS" :image="previewBFS"/>
                </CustomButton>
            </div>
        </template>
        <template #footer>
            <CustomButton :action="() => isOpen = false" type="negative">Close</CustomButton>
        </template>
    </ModalPopup>

    <TutorialContent v-if="currentTutorial === 'DFS: Pre-order'" title="DFS: Pre-order" :static="staticDFSPre" @close="handleClose" @back="handleBack">
        <p>
            For Pre-order Depth First Search, you follow a simple pattern. <br/>
            ‘Visit’ the initial root/center node, then visit the left child,<br/>
            and finally the right child. Follow this pattern through the<br/>
            entire tree.
        </p>
    </TutorialContent>
    <TutorialContent v-if="currentTutorial === 'DFS: In-order'" title="DFS: In-order" :static="staticDFSIn" @close="handleClose" @back="handleBack">
        <p>
            In-order Depth-First-Search is a bit more complex of a pattern. <br/>
            Within a branch, you visit the left child first, then return to <br/>
            the root node, and finally visit the right child. You repeat this <br/> 
            pattern for every branch in the tree.
        </p>
    </TutorialContent>
    <TutorialContent v-if="currentTutorial === 'DFS: Post-order'" title="DFS: Post-order" :static="staticDFSPost" @close="handleClose" @back="handleBack">
        <p>
            Post-order Depth-First-Search follows the pattern of visiting the <br/>
            left child first, then the right child, and finally the root node You <br/>
            repeat this pattern for every branch in the tree.
        </p>
    </TutorialContent>
    <TutorialContent v-if="currentTutorial === 'BFS'" title="BFS" :static="staticBFS" @close="handleClose" @back="handleBack">
        <p>
            For Breadth-First-Search, you traverse the tree in ‘rows’ you <br/>
            start from the root, then visit it’s children (left to right), then<br/>
            you visit all the root’s children’s children, and so on.
        </p>
    </TutorialContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from './CustomButton.vue';
import ModalPopup from './ModalPopup.vue';
import TutorialCard from './TutorialCard.vue';
import TutorialContent from './TutorialContent.vue';

import previewDFSPre from '@/assets/tutorial/DFS_pre-order_preview.png';
import previewDFSIn from '@/assets/tutorial/DFS_in-order_preview.png';
import previewDFSPost from '@/assets/tutorial/DFS_post-order_preview.png';
import previewBFS from '@/assets/tutorial/BFS_preview.png';

import staticDFSPre from '@/assets/tutorial/DFS_pre-order_example_static.png';
import staticDFSIn from '@/assets/tutorial/DFS_in-order_example_static.png';
import staticDFSPost from '@/assets/tutorial/DFS_post-order_example_static.png';
import staticBFS from '@/assets/tutorial/BFS_example_static.png';

const isOpen = ref(false);

const currentTutorial = ref<string | null>(null);

function handleClose() {
    isOpen.value = false;
    currentTutorial.value = null;
}

function handleBack() {
    currentTutorial.value = null;
}
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