<template>
	<Transition name="fade">
		<LoadingScreen v-if="isLoading" />
	</Transition>
	<router-view/>
</template>

<script lang="ts" setup>
import LoadingScreen from './components/LoadingScreen.vue';
import APIManager from './types/APIManager';

const isLoading = APIManager.getInstance().getIsLoading();
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.fade-enter-active {
  transition: none !important; /* No transition on enter */
}
.fade-enter-from {
  opacity: 1 !important;       /* Instantly visible */
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
</style>
