<template>
	<div class="home">
		<ScreenBackground />
		<div class="button-container">
			<CustomButton :action="() => joinIsOpen = true">Join</CustomButton>
			<ModalPopup title="Join a Game" v-if="joinIsOpen" @close="joinIsOpen = false">
				<template #body>
					<div class="input-container">
						<h4 class="input-heading">Nickname: </h4>
						<TextInput
							ref="nicknameInput"
							placeholder="Jeff"
							:width="300"
						/>
					</div>
					<div class="input-container">
						<h4 class="input-heading">Game Code: </h4>
						<TextInput
							ref="codeInput"
							placeholder="30021c"
							:width="300"
						/>
					</div>
				</template>
				<template #footer>
					<CustomButton :action="() => joinGame()" type="positive">Connect</CustomButton>
					<CustomButton :action="() => joinIsOpen = false" type="negative">Close</CustomButton>
				</template>
			</ModalPopup>
	
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

const joinIsOpen = ref<boolean>(false);
const nicknameInput = ref<InstanceType<typeof TextInput> | null>(null);
const codeInput = ref<InstanceType<typeof TextInput> | null>(null);

function joinGame() {
	if (!codeInput.value || !nicknameInput.value) return;

	const code = codeInput.value.getValue();
	const name = nicknameInput.value.getValue();

	if (!code || !name) {
		alert('Please enter both lobby code and nickname.');
		return;
	}

	APIManager.getInstance().joinSession(code, name)
		.then(() => {
			router.push('/lobby');
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

.input-container {
	display: flex;
	justify-content: space-between;
	margin: 30px 15px 30px 15px;
}

.input-heading {
	margin-right: 40px;
}

</style>
