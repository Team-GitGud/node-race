<template>  
    <button
        :class="['custom-button', `type-${type}`, { disabled }]"
        :disabled="disabled"
        :style="{ width: width ? `${width}px` : undefined }"
        @click="action"
    >
        <!-- {{ icon }}  Temperary until actual icons are implemented -->
        {{ text }}
    </button>
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
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-neutral {
  background-color: #e0e0e0;
  color: #333;
}

.type-positive {
  background-color: #4caf50;
  color: white;
}

.type-negative {
  background-color: #f44336;
  color: white;
}

.custom-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>