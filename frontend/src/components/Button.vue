
<template>  
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

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
</style>