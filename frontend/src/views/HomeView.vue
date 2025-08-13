<template>
	<div class="home">
		<ScreenBackground />
		<div class="button-container">
			<CustomButton>Join</CustomButton>
			<CustomButton :action="() => handleHostClick()">Host</CustomButton>
			<CustomButton shrink :action="() => $router.push('/question/')">?</CustomButton>
		</div>
		<ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
	</div>
</template>

<script lang="ts" setup>
import ScreenBackground from '@/components/ScreenBackground.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
import APIManager from '@/types/APIManager';
import router from '@/router';

async function handleHostClick() {
	if (await APIManager.getInstance().createSession()) {
		router.push('/host');
	} else {
		alert('Failed to create a new session. Please try again later.');
	}
}
</script>

<style>
.button-container {
	display: flex;
	justify-content: center;
	position: fixed;
	top: calc(100vh - 45vh);
	width: 100%;
}
</style>
