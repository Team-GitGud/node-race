<!-- 
    This component displays an animation for the selected graph traversal algorithm.
    It cycles through a series of images to illustrate the steps of the algorithm.

    Usage:
    <AnimationComponent title="DFS: Pre-order" />
-->
<template>
    <div>
        <img class="anim-image" />
    </div>
</template>

<script setup lang="ts">
// Import all JPGs from the BFS folder
import BFS_Slide1 from '@/assets/tutorial/BFS_animation/Slide1.jpg';
import BFS_Slide2 from '@/assets/tutorial/BFS_animation/Slide2.jpg';  
import BFS_Slide3 from  '@/assets/tutorial/BFS_animation/Slide3.jpg';
import BFS_Slide4 from  '@/assets/tutorial/BFS_animation/Slide4.jpg';
import BFS_Slide5 from  '@/assets/tutorial/BFS_animation/Slide5.jpg';
import BFS_Slide6 from  '@/assets/tutorial/BFS_animation/Slide6.jpg';
import BFS_Slide7 from  '@/assets/tutorial/BFS_animation/Slide7.jpg';

// Import all JPGs from the DFS In-order folder
import DFS_In_Order_Slide1 from '@/assets/tutorial/DFS_in-order_animation/Slide1.jpg';
import DFS_In_Order_Slide2 from '@/assets/tutorial/DFS_in-order_animation/Slide2.jpg';
import DFS_In_Order_Slide3 from '@/assets/tutorial/DFS_in-order_animation/Slide3.jpg';
import DFS_In_Order_Slide4 from '@/assets/tutorial/DFS_in-order_animation/Slide4.jpg';
import DFS_In_Order_Slide5 from '@/assets/tutorial/DFS_in-order_animation/Slide5.jpg';
import DFS_In_Order_Slide6 from '@/assets/tutorial/DFS_in-order_animation/Slide6.jpg';
import DFS_In_Order_Slide7 from '@/assets/tutorial/DFS_in-order_animation/Slide7.jpg';

// Import all JPGs from the DFS Post-order folder
import DFS_Post_Order_Slide1 from '@/assets/tutorial/DFS_post-order_animation/Slide1.jpg';
import DFS_Post_Order_Slide2 from '@/assets/tutorial/DFS_post-order_animation/Slide2.jpg';
import DFS_Post_Order_Slide3 from '@/assets/tutorial/DFS_post-order_animation/Slide3.jpg';
import DFS_Post_Order_Slide4 from '@/assets/tutorial/DFS_post-order_animation/Slide4.jpg';
import DFS_Post_Order_Slide5 from '@/assets/tutorial/DFS_post-order_animation/Slide5.jpg';
import DFS_Post_Order_Slide6 from '@/assets/tutorial/DFS_post-order_animation/Slide6.jpg';
import DFS_Post_Order_Slide7 from '@/assets/tutorial/DFS_post-order_animation/Slide7.jpg';

// Import all JPGs from the DFS Pre-order folder
import DFS_Pre_Order_Slide1 from '@/assets/tutorial/DFS_pre-order_animation/Slide1.jpg';
import DFS_Pre_Order_Slide2 from '@/assets/tutorial/DFS_pre-order_animation/Slide2.jpg';
import DFS_Pre_Order_Slide3 from '@/assets/tutorial/DFS_pre-order_animation/Slide3.jpg';
import DFS_Pre_Order_Slide4 from '@/assets/tutorial/DFS_pre-order_animation/Slide4.jpg';
import DFS_Pre_Order_Slide5 from '@/assets/tutorial/DFS_pre-order_animation/Slide5.jpg';
import DFS_Pre_Order_Slide6 from '@/assets/tutorial/DFS_pre-order_animation/Slide6.jpg';
import DFS_Pre_Order_Slide7 from '@/assets/tutorial/DFS_pre-order_animation/Slide7.jpg';

import { defineProps, onMounted } from 'vue';

// Arrays to hold the imported images for each algorithm
const bfs_slides = [BFS_Slide1, BFS_Slide2, BFS_Slide3, BFS_Slide4, BFS_Slide5, BFS_Slide6, BFS_Slide7];
const dfs_in_order_slides = [DFS_In_Order_Slide1, DFS_In_Order_Slide2, DFS_In_Order_Slide3, DFS_In_Order_Slide4, DFS_In_Order_Slide5, DFS_In_Order_Slide6, DFS_In_Order_Slide7];
const dfs_post_order_slides = [DFS_Post_Order_Slide1, DFS_Post_Order_Slide2, DFS_Post_Order_Slide3, DFS_Post_Order_Slide4, DFS_Post_Order_Slide5, DFS_Post_Order_Slide6, DFS_Post_Order_Slide7];
const dfs_pre_order_slides = [DFS_Pre_Order_Slide1, DFS_Pre_Order_Slide2, DFS_Pre_Order_Slide3, DFS_Pre_Order_Slide4, DFS_Pre_Order_Slide5, DFS_Pre_Order_Slide6, DFS_Pre_Order_Slide7];

const props = defineProps<{
    title: string;
}>();

let index = 0;

// Function to cycle through images based on the selected algorithm
function playAnimation() {
    updateAnimation(document.querySelector('.anim-image') as HTMLImageElement, index);
    let animation = setInterval(() => {
        if (index < 7) {
            const imgElement = document.querySelector('.anim-image') as HTMLImageElement;
            if (!imgElement) {
                // End interval
                clearInterval(animation);
                return;
            } else {
                updateAnimation(imgElement, index);
            }
            index++;
        } else {
            index = 0; 
        }
    }, 500); 
}

// Update the image source based on the current index and algorithm
function updateAnimation(img: HTMLImageElement, index: number) {
    const animationFrames = props.title === 'BFS' ? bfs_slides :
        props.title === 'DFS: In-order' ? dfs_in_order_slides :
        props.title === 'DFS: Post-order' ? dfs_post_order_slides :
        props.title === 'DFS: Pre-order' ? dfs_pre_order_slides : [];

    img.setAttribute('src', animationFrames[index]);
}

// Start the animation when the component is mounted
onMounted(() => {
    playAnimation();
});
</script>

<style scoped>
.anim-image {
    height: 350px;
}
</style>
