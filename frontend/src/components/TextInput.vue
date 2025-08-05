<template>
  <div class="input-background-shadow" :class="[`type-${variant}`, { 'hasError': hasError }]">
    <input
        class="custom-input"
        :value="internalValue"
        :placeholder="placeholder"
        :style="{width: width ? `${width}px` : undefined }"
        :class="[`type-${variant}`, { 'hasError': hasError}]"
        @input="handleInput"
        @keydown.enter="handleEnter"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults, ref, watch } from 'vue'

// Text Input component parameters:
//     Optional:
//     - placeholder: string (placeholder text in input)
//     - variant: string (styling variant, default to neutral)
//     - hasError: boolean (error state styling, defaults to false)
//     - width: number (undefined default)
//     - initialValue: string (initial value, defaults to empty string)
const props = withDefaults(
    defineProps<{
      placeholder?: string;
      variant?: 'neutral' | 'positive' | 'negative' ;
      hasError?: boolean;
      width?: number;
      initialValue?: string;
    }>(),{
      placeholder: '',
      variant: 'neutral',
      hasError: false,
      initialValue: '',
    }
);

const internalValue = ref(props.initialValue);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  internalValue.value = target.value;
};


/**
 *  We can change this if we want to use the input as a button
 * */
const handleEnter = () => {
  emit('enter', internalValue.value);
};

const emit = defineEmits<{
  enter: [value: string];
}>();

// Watch for prop changes to update internal value
watch(() => props.initialValue, (newValue) => {
  internalValue.value = newValue;
});
</script>

<style scoped>
.custom-input {
  display: inline-flex;
  align-items: center;
  padding: 2px 30px;
  background-color: #00081A;
  border: 2px solid #fff;
  outline: none;
  transition: all 0.3s ease;
  transform: translate(4px, 4px);

  /* font */
  font-size: 25px;
  font-family: "Jersey 10", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.input-background-shadow {
  display: inline-block;
  padding: 0 4px 4px 0;
  transition: all 0.3s ease;
}

.custom-input:focus {
  transform: translate(8px, 8px);
}

.custom-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.type-neutral {
  border-color: #ffffff;
  color: #ffffff;
}

.type-neutral:focus {
  border-color: color-mix(in srgb, #ffffff 60%, black);
  color: color-mix(in srgb, #ffffff 100%, black);
  transition: all 0.1s linear;
}

.input-background-shadow.type-neutral {
  background-color: #fff;
}

.input-background-shadow.type-neutral:focus-within {
  background-color: color-mix(in srgb, #ffffff 60%, black);
  transition: all 0.1s linear;
}

.type-positive {
  border-color: #069701;
  color: white;
}

.type-positive:focus {
  border-color: color-mix(in srgb, #069701 40%, black);
  color: color-mix(in srgb, #ffffff 40%, black);
  transition: all 0.1s linear;
}

.input-background-shadow.type-positive {
  background-color: #069701;
}

.input-background-shadow.type-positive:focus-within {
  background-color: color-mix(in srgb, #069701 40%, black);
  transition: all 0.1s linear;
}

.type-negative {
  border-color: #8f0000;
  color: white;
}

.type-negative:focus {
  border-color: color-mix(in srgb, #8f0000 40%, black);
  color: color-mix(in srgb, #ffffff 40%, black);
  transition: all 0.1s linear;
}

.input-background-shadow.type-negative {
  background-color: #8f0000;
}

.input-background-shadow.type-negative:focus-within {
  background-color: color-mix(in srgb, #8f0000 40%, black);
  transition: all 0.1s linear;
}

.custom-input.hasError {
  opacity: 0.4;
  border-color: #5a5a5a;
}

.input-background-shadow.hasError {
  background-color: #5a5a5a;
}
</style>