<template>
	<div class="home">
		<ScreenBackground text />
		<div class="button-container">
			<CustomButton :action="() => $router.push('/practice')">Solo</CustomButton>
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
					<CustomButton :action="() => joinIsOpen = false" type="negative">Close</CustomButton>
					<CustomButton :action="() => handleJoinGame()" type="positive">Connect</CustomButton>
				</template>
			</ModalPopup>
	
			<CustomButton :action="() => HostisOpen = true">Host</CustomButton>

			<ModalPopup title="Host a Game" v-if="HostisOpen" @close="HostisOpen = false">
				<template #body>
					<h4> Would you like to create a game lobby? </h4>
				</template>

				<template #footer>
					<CustomButton :action="() => HostisOpen = false" type="negative">Close</CustomButton>
					<CustomButton :action="() => handleHostClick()" type="positive">Host</CustomButton>
				</template>
			</ModalPopup>
		</div>
		<div style="position: absolute; right: 20px; top: 20px; display: flex;">
			<GlobalLeaderboardPopup />
			<TutorialPopup />
		</div>
		<ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
		<BuildInfo />
	</div>
</template>

<script lang="ts" setup>
import ScreenBackground from '@/components/ScreenBackground.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
import ModalPopup from '@/components/ModalPopup.vue';
import TextInput from '@/components/TextInput.vue';
import BuildInfo from '@/components/BuildInfo.vue';
import APIManager from '@/types/APIManager';
import { AlertService } from '@/types/AlertService';
import router from '@/router';
import { ref } from 'vue';
import TutorialPopup from '@/components/TutorialPopup.vue';
import GlobalLeaderboardPopup from '@/components/GlobalLeaderboardPopup.vue';

async function handleHostClick() {
	if (await APIManager.getInstance().createSession()) {
		router.push('/host');
	} else {
		AlertService.alert('Failed to create a new session. Please try again later.');
	}
}

const joinIsOpen = ref<boolean>(false);
const HostisOpen = ref<boolean>(false);
const nicknameInput = ref<InstanceType<typeof TextInput> | null>(null);
const codeInput = ref<InstanceType<typeof TextInput> | null>(null);

async function handleJoinGame() {
	if (!codeInput.value || !nicknameInput.value) return;

	const code = codeInput.value.getValue();
	const name = nicknameInput.value.getValue();

	if (!code || !name) {
		AlertService.alert('Please enter both lobby code and nickname.');
		return;
	}

	if (await APIManager.getInstance().joinSession(code, name)) {
		router.push('/lobby');
	} else {
		AlertService.alert('Failed to join the session. Please check the code and try again.');
	}
}


</script>

<style>
.button-container {
	display: flex;
	justify-content: center;
	position: fixed;
	top: 56%;
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
