<!--
Usage:
<CustomButton
	:action="() => isModalOpen = true"
	type="positive"
	:isDisabled="isDisabled"
	:width="200"
>
	Button Text
</CustomButton>

Import this component in your Vue file:
import CustomButton from '@/components/CustomButton.vue';

Props:
- action (optional, function): The function to call when the button is clicked. Defaults to returning null.
- type (optional, string): The type of button, can be 'neutral', 'positive', or 'negative'. Defaults to 'neutral'.
- disabled (optional, boolean): Whether the button is disabled. Defaults to false.
- width (optional, number): The width of the button in pixels. Defaults to undefined (auto width).
-->
<template>
	<button 
		:class="['btn', `${type}`, { disabled }]"
		:disabled="disabled"
		type="button"
		@click="action"
	>
		<div class="btn-inner" :style="{ width: width ? `${width}px` : undefined }">
			<slot />
		</div>
	</button>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';
withDefaults(
	defineProps<{
		action?: () => void;
		type?: 'neutral' | 'positive' | 'negative';
		disabled?: boolean;
		width?: number;
	}>(),
	{
		action: () => { return null; },
		type: 'neutral',
		disabled: false,
	}
);
</script>

<style scoped>
/* Button styles */
.btn {
	--transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, filter 0.1s linear;
	display: inline-block;
	padding: 0 4px 4px 0;
	margin: 10px 5px;
	outline: none;
	border: none;
	cursor: pointer;
	transition: var(--transition);
}
.btn-inner {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px 30px;
	background-color: var(--background-color);
	border: 2px solid var(--text-color);
	transition: var(--transition);
	transform: translate(4px, 4px);
	font-size: 25px;
}

/* Button hover effect */
.btn:hover:not(.disabled) .btn-inner {
	transform: translate(8px, 8px);
}

/* Type modifiers */
.btn.neutral {
	background-color: var(--text-color);
}
.btn.neutral .btn-inner {
	border-color: var(--text-color);
	color: var(--text-color);
}

.btn.positive {
	background-color: var(--positive-color);
}
.btn.positive .btn-inner {
	border-color: var(--positive-color);
	color: var(--text-color);
}

.btn.negative {
	background-color: var(--negative-color);
}
.btn.negative .btn-inner {
	border-color: var(--negative-color);
	color: var(--text-color);
}

/* Active states */
.btn:active:not(.disabled) {
	filter: brightness(0.4);
}

/* Disabled state */
.btn.disabled {
	background-color: var(--disabled);
	cursor: not-allowed;
}
.btn.disabled .btn-inner {
	opacity: 0.4;
	border-color: var(--disabled);
}
</style>