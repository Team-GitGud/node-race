<template>
  <div class="text-input-container" :class="{ 'has-error': hasError }" :style="{ width: getWidth() }">
    <input
        class="text-input"
        :value="internalValue"
        :placeholder="placeholder"
        :class="{ 'has-error': hasError }"
        @input="handleInput"
    />
    
    <span v-if="hasError && errorMessage" class="error-message">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, defineExpose, withDefaults, ref, watch } from 'vue'

// Text Input component parameters:
//     Optional:
//     - placeholder: string (placeholder text in input)
//     - variant: string (styling variant, default to neutral)
//     - hasError: boolean (error state styling, defaults to false)
//     - width: number (undefined default)
//     - initialValue: string (initial value, defaults to empty string)
//     - errorMessage: string (error message to display, defaults to empty string)
const props = withDefaults(
    defineProps<{
      placeholder?: string;
      variant?: 'neutral' | 'positive' | 'negative';
      hasError?: boolean;
      width?: number;
      initialValue?: string;
      errorMessage?: string;
    }>(), {
      placeholder: '',
      variant: 'neutral',
      hasError: false,
      initialValue: '',
      errorMessage: '',
    }
);

const internalValue = ref(props.initialValue);
const hasError = ref(props.hasError);
const errorMessage = ref(props.errorMessage);

const getWidth = () => {
  const width = props.width || 400;
  return `${width}px`;
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  internalValue.value = target.value;
  
  // Clear error when user starts typing
  if (hasError.value) {
    clearError();
  }
};

const emit = defineEmits<{
  errorCleared: [];
}>();

// Watch for prop changes to update internal state
watch(() => props.initialValue, (newValue) => {
  internalValue.value = newValue;
});

watch(() => props.hasError, (newValue) => {
  hasError.value = newValue;
});

watch(() => props.errorMessage, (newValue) => {
  errorMessage.value = newValue;
});

// Methods to control error state from external code
const setError = (message: string) => {
  hasError.value = true;
  errorMessage.value = message;
  emit('errorCleared');
};

const clearError = () => {
  hasError.value = false;
  errorMessage.value = '';
  emit('errorCleared');
};

// Expose methods for external use
defineExpose({
  setError,
  clearError,
  getValue: () => internalValue.value
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
  width: 85%; /* Leave 15% space for the "!!!" */
  padding-right: 15%;
  height: 40px;
  color: #00081A;
  font-size: 30px;
  border: none;
  padding-bottom: 7px;
  background-image: linear-gradient(to right, #00081A 0%, #00081A 100%);
  background-size: 100% 2px;
  background-repeat: no-repeat;
  background-position: bottom 5px left;
}

.text-input.has-error {
  background-image: linear-gradient(to right, #ff0000 0%, #ff0000 100%);
  border-top: 5px solid #AA0707;
  border-right: 2px solid #AA0707;
  border-bottom: 2px solid #AA0707;
  border-left: 5px solid #AA0707;
}

/* Floating "!!!" when there's an error */
.text-input-container.has-error::after {
  content: "!!!";
  position: absolute;
  right: 0;
  color: #ff0000;
  font-size: 50px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.error-message {
  font-size: 20px;
  width: 80%;
  align-self: flex-end;
  border-top: 5px solid #AA0707;
  border-right: 2px solid #AA0707;
  border-bottom: 2px solid #AA0707;
  border-left: 5px solid #AA0707;
  padding: 4px 6px;
}

.text-input::placeholder {
  opacity: 0.58;
  color: #00081A;
  font-size: 30px;
}
</style>