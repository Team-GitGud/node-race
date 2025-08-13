<template>
	<div class="home">
		<ScreenBackground />
		<div class="button-container">
			<CustomButton :action="() => handleJoinClick()">Join</CustomButton>
			<CustomButton :action="() => handleHostClick()">Host</CustomButton>
			<CustomButton shrink :action="() => $router.push('/question/')">?</CustomButton>
		</div>
		<ModalPopup title="Join Game" v-if="joinPopup" @close="joinPopup = false">
			<template #body>
				<TextInput
					ref="codeInput"
					placeholder="Enter lobby code..."
				/>
				<TextInput
					ref="nameInput"
					placeholder="Enter nickname"
				/>
			</template>
			<template #footer>
				<CustomButton
					:action="() => joinGame()"
					type="positive"
				>Join</CustomButton>
				<CustomButton
					:action="() => joinPopup = false"
					type="negative"
				>Cancel</CustomButton>
			</template>
		</ModalPopup>
		<ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
	</div>
</template>

<script lang="ts" setup>
import ScreenBackground from '@/components/ScreenBackground.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
import ModalPopup from '@/components/ModalPopup.vue';
import TextInput from '@/components/TextInput.vue';
import APIManager from '@/types/APIManager';
import router from '@/router';
import { ref } from 'vue';

async function handleHostClick() {
	if (await APIManager.getInstance().createSession()) {
		router.push('/host');
	} else {
		alert('Failed to create a new session. Please try again later.');
	}
}

const joinPopup = ref(false);
const codeInput = ref<InstanceType<typeof TextInput> | null>(null);
const nameInput = ref<InstanceType<typeof TextInput> | null>(null);

function handleJoinClick() {
	joinPopup.value = true;
}

function joinGame() {
	if (!codeInput.value || !nameInput.value) return;

	const code = codeInput.value.getValue();
	const name = nameInput.value.getValue();

	if (!code || !name) {
		alert('Please enter both lobby code and nickname.');
		return;
	}

	APIManager.getInstance().joinSession(code, name)
		.then(() => {
			router.push('/join');
		})
		.catch((error) => {
			alert(`Failed to join session: ${error.message}`);
		});
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
