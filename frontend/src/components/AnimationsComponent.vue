<template>
    <div>
        <img class="anim-image" />
    </div>
</template>

<script setup lang="ts">
import BFS_Slide1 from '@/assets/tutorial/BFS_animation/Slide1.jpg';
import BFS_Slide2 from '@/assets/tutorial/BFS_animation/Slide2.jpg';  
import BFS_Slide3 from  '@/assets/tutorial/BFS_animation/Slide3.jpg';
import BFS_Slide4 from  '@/assets/tutorial/BFS_animation/Slide4.jpg';
import BFS_Slide5 from  '@/assets/tutorial/BFS_animation/Slide5.jpg';
import BFS_Slide6 from  '@/assets/tutorial/BFS_animation/Slide6.jpg';
import BFS_Slide7 from  '@/assets/tutorial/BFS_animation/Slide7.jpg';

import DFS_In_Order_Slide1 from '@/assets/tutorial/DFS_in-order_animation/Slide1.jpg';
import DFS_In_Order_Slide2 from '@/assets/tutorial/DFS_in-order_animation/Slide2.jpg';
import DFS_In_Order_Slide3 from '@/assets/tutorial/DFS_in-order_animation/Slide3.jpg';
import DFS_In_Order_Slide4 from '@/assets/tutorial/DFS_in-order_animation/Slide4.jpg';
import DFS_In_Order_Slide5 from '@/assets/tutorial/DFS_in-order_animation/Slide5.jpg';
import DFS_In_Order_Slide6 from '@/assets/tutorial/DFS_in-order_animation/Slide6.jpg';
import DFS_In_Order_Slide7 from '@/assets/tutorial/DFS_in-order_animation/Slide7.jpg';

import DFS_Post_Order_Slide1 from '@/assets/tutorial/DFS_post-order_animation/Slide1.jpg';
import DFS_Post_Order_Slide2 from '@/assets/tutorial/DFS_post-order_animation/Slide2.jpg';
import DFS_Post_Order_Slide3 from '@/assets/tutorial/DFS_post-order_animation/Slide3.jpg';
import DFS_Post_Order_Slide4 from '@/assets/tutorial/DFS_post-order_animation/Slide4.jpg';
import DFS_Post_Order_Slide5 from '@/assets/tutorial/DFS_post-order_animation/Slide5.jpg';
import DFS_Post_Order_Slide6 from '@/assets/tutorial/DFS_post-order_animation/Slide6.jpg';
import DFS_Post_Order_Slide7 from '@/assets/tutorial/DFS_post-order_animation/Slide7.jpg';

import DFS_Pre_Order_Slide1 from '@/assets/tutorial/DFS_pre-order_animation/Slide1.jpg';
import DFS_Pre_Order_Slide2 from '@/assets/tutorial/DFS_pre-order_animation/Slide2.jpg';
import DFS_Pre_Order_Slide3 from '@/assets/tutorial/DFS_pre-order_animation/Slide3.jpg';
import DFS_Pre_Order_Slide4 from '@/assets/tutorial/DFS_pre-order_animation/Slide4.jpg';
import DFS_Pre_Order_Slide5 from '@/assets/tutorial/DFS_pre-order_animation/Slide5.jpg';
import DFS_Pre_Order_Slide6 from '@/assets/tutorial/DFS_pre-order_animation/Slide6.jpg';
import DFS_Pre_Order_Slide7 from '@/assets/tutorial/DFS_pre-order_animation/Slide7.jpg';

import { defineProps, onMounted } from 'vue';

const bfs_slides = [BFS_Slide1, BFS_Slide2, BFS_Slide3, BFS_Slide4, BFS_Slide5, BFS_Slide6, BFS_Slide7];
const dfs_in_order_slides = [DFS_In_Order_Slide1, DFS_In_Order_Slide2, DFS_In_Order_Slide3, DFS_In_Order_Slide4, DFS_In_Order_Slide5, DFS_In_Order_Slide6, DFS_In_Order_Slide7];
const dfs_post_order_slides = [DFS_Post_Order_Slide1, DFS_Post_Order_Slide2, DFS_Post_Order_Slide3, DFS_Post_Order_Slide4, DFS_Post_Order_Slide5, DFS_Post_Order_Slide6, DFS_Post_Order_Slide7];
const dfs_pre_order_slides = [DFS_Pre_Order_Slide1, DFS_Pre_Order_Slide2, DFS_Pre_Order_Slide3, DFS_Pre_Order_Slide4, DFS_Pre_Order_Slide5, DFS_Pre_Order_Slide6, DFS_Pre_Order_Slide7];

const props = defineProps<{
    title: string;
}>();

let index = 0;

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

function updateAnimation(img: HTMLImageElement, index: number) {
    const animationFrames = props.title === 'BFS' ? bfs_slides :
        props.title === 'DFS: In-order' ? dfs_in_order_slides :
        props.title === 'DFS: Post-order' ? dfs_post_order_slides :
        props.title === 'DFS: Pre-order' ? dfs_pre_order_slides : [];

    img.setAttribute('src', animationFrames[index]);
}

onMounted(() => {
    playAnimation();
});
</script>

<style scoped>
.anim-image {
    height: 350px;
}

</style>
