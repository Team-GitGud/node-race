<!--
Import this component in your Vue file:
import ScreenBackground from '@/components/ScreenBackground.vue';
-->
<template>
    <div :class="['bg-container', { type }]">
        <div v-if="type" class="overlay"></div>

		<!-- if text prop is true, use imgNormal, if noTree prop is true, use imgNoTree, otherwise use imgBlur -->
		<img v-else-if="text" :src="imgNormal" />
		<img v-else-if="noTree" :src="imgNoTree" />
		<img v-else :src="imgBlur" />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import imgNormal from '@/assets/home_page_as_image.png';
import imgBlur from '@/assets/home_page_as_image_no_text.png';
import imgNoTree from '@/assets/home_page_as_image_no_tree.png';

defineProps<{
  type?: string;
  blur?: boolean;
  noTree?: boolean;
  text?: boolean;
}>();

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
    z-index: -1;
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