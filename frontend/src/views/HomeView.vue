<template>
	<div class="home">
		<div class="image-container">
			<img src="../assets/home_page_as_image.png" alt="Home page image"/>
		</div>
		<div class="button-container">
			<CustomButton>Join</CustomButton>
			<CustomButton>Host</CustomButton>
			<CustomButton shrink :action="() => $router.push('/question/')">?</CustomButton>
		</div>
		<ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
	</div>
</template>

<script lang="ts" setup>
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
</script>

<style>
.image-container {
	display: flex;
	justify-content: center;
	max-height: 100vh;
	overflow: hidden;
}

img {
	height: 100vh;
	width: auto;
	position: fixed;
	z-index: -1;
	overflow-y: hidden;
}

.button-container {
	display: flex;
	justify-content: center;
	position: fixed;
	top: calc(100vh - 45vh);
	width: 100%;
}
</style>
