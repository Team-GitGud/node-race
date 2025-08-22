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
					<CustomButton :action="() => joinIsOpen = false" type="positive">Connect</CustomButton>
					<CustomButton :action="() => joinIsOpen = false" type="negative">Close</CustomButton>
				</template>
			</ModalPopup>
	
			<CustomButton>Host</CustomButton>
			<CustomButton shrink :action="() => $router.push('/question/')">?</CustomButton>
		</div>
		<ConnectionStatus style="position: fixed; bottom: 0; right: 0; margin: 20px;" />
	</div>
</template>

<script lang="ts" setup>
import ScreenBackground from '@/components/ScreenBackground.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CustomButton from '@/components/CustomButton.vue'
import ModalPopup from '@/components/ModalPopup.vue'
import TextInput from '@/components/TextInput.vue';
import { ref } from 'vue';

const joinIsOpen = ref<boolean>(false);
const nicknameInput = ref<InstanceType<typeof TextInput> | null>(null);
const codeInput = ref<InstanceType<typeof TextInput> | null>(null);

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
