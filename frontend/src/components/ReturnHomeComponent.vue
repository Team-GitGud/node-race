<template>
    <img @click="handleHomeClick" class="back-logo" :src="Logo" alt="NodeRace Logo"/>
    <ModalPopup title="Exit Game?" v-if="isOpen" @close="isOpen = false">
        <template #body>
            <p v-html="props.message"></p>
        </template>
        <template #footer>
            <CustomButton
                :action="handleConfirmClick"
                type="positive"
            >
                Yes
            </CustomButton>
            <CustomButton
                :action="() => isOpen = false"
                type="negative"
            >
                No
            </CustomButton>
        </template>
    </ModalPopup>
</template>

<script lang="ts" setup>
import { ref, defineProps, withDefaults } from 'vue';
import ModalPopup from '@/components/ModalPopup.vue';
import CustomButton from '@/components/CustomButton.vue';
import Logo from '@/assets/logo.png';
import { useRouter } from 'vue-router';

const props = withDefaults(
    defineProps<{ 
        message?: string, 
        skipConfirm?: boolean 
    }>(),
    {
        message: 'Are you sure you want to return to the home page? <br/> You will be disconnected from the current game.',
        skipConfirm: false
    }
);

const router = useRouter();
const isOpen = ref(false);

const handleHomeClick = () => {
    if (props.skipConfirm) {
        handleConfirmClick();
        return;
    }
    isOpen.value = true;
}

const handleConfirmClick = () => {
    router.push('/');
}
</script>

<style scoped>
.back-logo {
    position: fixed;
    top: 25px;
    left: 30px;
    z-index: 900;
    margin: 0;
    padding: 0;
    height: 60px;
    width: auto;
    transition: opacity 0.3s;
}

.back-logo:hover {
    cursor: pointer;
    opacity: 0.7;
}
</style>