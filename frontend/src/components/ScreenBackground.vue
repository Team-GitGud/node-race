<!--
Usage:
<ScreenBackground blur />

Import this component in your Vue file:
import ScreenBackground from '@/components/ScreenBackground.vue';
-->
<template>
    <div :class="['bg-container', { blur }]">
        <div v-if="blur" class="overlay"></div>
        <img :src="blur ? imgBlur : imgNormal" />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import imgNormal from '@/assets/home_page_as_image.png';
import imgBlur from '@/assets/home_page_as_image_no_text.png';
defineProps<{ blur?: boolean }>();
</script>

<style scoped>
.bg-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	z-index: -2;
}

.bg-container .overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 8, 26, 0.8);
    z-index: -1;
    backdrop-filter: blur(10px);
}

.bg-container img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	object-fit: cover;
	z-index: -2;
}
</style>