<template>
	<div class="button-background-shadow" :class="[`type-${type}`, { disabled }]">
		<button
			:class="['custom-button', `type-${type}`, { disabled }]"
			:disabled="disabled"
			:style="{ width: width ? `${width}px` : undefined }"
			@click="action"
		>
			<!-- {{ icon }}  Temperary until actual icons are implemented -->
			{{ text }}
		</button>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

// Button component parameters:
//     Mandatory: text and action
//     Optional:
//     - type: string (values of neutral, positive, negative with a default of neutral)
//     - disabled: boolean (whether or not the button is disabled, defaults to false)
//     - icon: string (a fontawesome icon string, undefined default)
//     - width: number (undefined default)
withDefaults(
	defineProps<{
		text: string;
		action: () => void;
		type?: 'neutral' | 'positive' | 'negative';
		disabled?: boolean;
		icon?: string;
		width?: number;
	}>(),
	{
		text: 'this is a button',
		type: 'neutral',
		disabled: false,
	}
);

</script>

<style>
.custom-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px 30px;
	background-color: #00081A;
	border: 2px solid #fff;
	cursor: pointer;
	transition: all 0.3s ease;
	transform: translate(4px, 4px);

	/* font */
	font-size: 25px;
	font-family: "Jersey 10", sans-serif;
	font-weight: 400;
	font-style: normal;
}

.button-background-shadow {
	display: inline-block;
	padding: 0 4px 4px 0;
	transition: all 0.3s ease;
}

.custom-button:hover:not(.disabled) {
	transform: translate(8px, 8px);
}

.type-neutral {
	border-color: #ffffff;
	color: #ffffff;
}

.type-neutral:active:not(.disabled) {
	border-color: color-mix(in srgb, #ffffff 40%, black);
	color: color-mix(in srgb, #ffffff 40%, black);
	transition: all 0.1s linear;
}

.button-background-shadow.type-neutral {
	background-color: #fff;
}

.button-background-shadow.type-neutral:active:not(.disabled) {
	background-color: color-mix(in srgb, #ffffff 40%, black);
	transition: all 0.1s linear;
}

.type-positive {
	border-color: #069701;
	color: white;
}

.type-positive:active:not(.disabled) {
	border-color: color-mix(in srgb, #069701 40%, black);
	color: color-mix(in srgb, #ffffff 40%, black);
	transition: all 0.1s linear;
}

.button-background-shadow.type-positive {
	background-color: #069701;
}

.button-background-shadow.type-positive:active:not(.disabled) {
	background-color: color-mix(in srgb, #069701 40%, black);
	transition: all 0.1s linear;
}

.type-negative {
	border-color: #8f0000;
	color: white;
}

.type-negative:active:not(.disabled) {
	border-color: color-mix(in srgb, #8f0000 40%, black);
	color: color-mix(in srgb, #ffffff 40%, black);
	transition: all 0.1s linear;
}

.button-background-shadow.type-negative {
	background-color: #8f0000;
}

.button-background-shadow.type-negative:active:not(.disabled) {
	background-color: color-mix(in srgb, #8f0000 40%, black);
	transition: all 0.1s linear;
}

.custom-button.disabled {
	opacity: 0.4;
	border-color: #5a5a5a;
	cursor: not-allowed;
}

.button-background-shadow.disabled {
	background-color: #5a5a5a;
}
</style>