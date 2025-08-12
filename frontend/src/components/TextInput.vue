<!--
Usage:
<TextInput
	ref="inputRef"
	placeholder="Enter text here..."
	:width="300"
	initial-value="Initial text"
/>
<CustomButton text="Enter" :action="handleEnter">Enter</CustomButton>

const inputRef = ref<InstanceType<typeof TextInput> | null>(null);

function handleEnter() {
	if (!inputRef.value) return;
	const value = inputRef.value.getValue();
	if (value !== "Correct Value") {
		inputRef.value.setError("Incorrect value, please try again.");
	} else {
		inputRef.value.clearError();
		alert("Correct value entered!", value);
	}
}

Import this component in your Vue file:
import TextInput from '@/components/TextInput.vue';

Props:
- placeholder (optional, string): Placeholder text for the input field. Defaults to an empty string.
- width (optional, number): Width of the input field in pixels. Defaults to 400.
- initialValue (optional, string): Initial value of the input field. Defaults to an empty string.
-->
<template>
	<div
		class="text-input-container"
		:class="{ 'has-error': errorMessage }"
		:style="{ width: width + 'px' }"
	>
		<input 
			class="text-input"
			:class="{ 'has-error': errorMessage }"
			:placeholder="placeholder"
			v-model="inputValue"
			@input="clearError"
		/>
		<span v-if="errorMessage" class="error-message">
			{{ errorMessage }}
		</span>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, withDefaults, ref, watch } from 'vue'

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		width?: number;
		initialValue?: string;
	}>(), { width: 400 }
);

// Internal initial state for the input value and error message
const inputValue = ref(props.initialValue);
const errorMessage = ref('');

// Watch for prop changes to update internal state
watch(() => props.initialValue, (newValue) => {
	inputValue.value = newValue;
});

// Methods to control error state from external code
const setError = (message: string) => {
	errorMessage.value = message;
};
const clearError = () => {
	if (!errorMessage.value) return;
	errorMessage.value = '';
};

// Expose methods for external use
defineExpose({
	setError,
	clearError,
	getValue: () => inputValue.value
});
</script>

<style scoped>
.text-input-container {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.text-input {
	width: 83%;
	/* Leave 17% space for the "!!!" */
	padding-right: 15%;
	padding-left: 2%;
	height: 40px;
	color: var(--background-color);
	font-size: 30px;
	border: none;
	padding-bottom: 7px;
	background-image: linear-gradient(to right, var(--background-color) 0%, var(--background-color) 100%);
	background-size: 100% 2px;
	background-repeat: no-repeat;
	background-position: bottom 5px left;
	transition: border-color 0.3s ease, border-width 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
	caret-color: var(--background-color);
	border: 0px solid transparent;
}

.text-input:focus {
	outline: none;
	transform: scale(1.02);
	box-shadow: 0 0 10px rgba(0, 8, 26, 0.2);
}

.text-input:not(:focus) {
	transform: scale(1);
	box-shadow: none;
}

.text-input:focus::after {
	content: '';
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 2px;
	height: 20px;
	background-color: var(--background-color);
	animation: blink 1s infinite;
}

@keyframes blink {
	0%,
	50% {
		opacity: 1;
	}

	51%,
	100% {
		opacity: 0;
	}
}

.text-input.has-error {
	background-image: linear-gradient(to right, var(--negative-color) 0%, var(--negative-color) 100%);
	border-color: var(--negative-color);
	border-width: 5px 2px 2px 5px;
	border-style: solid;
}

/* Floating "!!!" when there's an error */
.text-input-container.has-error::after {
	content: "!!!";
	position: absolute;
	right: 0;
	color: var(--negative-color);
	font-size: 50px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	animation: fadeIn 0.3s ease-in;
}

.error-message {
	font-size: 20px;
	width: 80%;
	align-self: flex-end;
	border-color: var(--negative-color);
	border-width: 5px 2px 2px 5px;
	border-style: solid;
	padding: 4px 6px;
	animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: scale(0.8);
	}

	to {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.text-input::placeholder {
	opacity: 0.58;
	color: var(--background-color);
}
</style>