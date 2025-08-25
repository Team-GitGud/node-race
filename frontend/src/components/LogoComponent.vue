<template>
    <img class="logo" :src="Logo" @click="click()" />
</template>

<script lang="ts" setup>
import Logo from "@/assets/logo.png";
import { useRouter } from "vue-router";
import { defineProps, withDefaults } from "vue";

const router = useRouter();

interface Props {
    action?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    action: () => undefined
});

const click = () => {
    if (props.action) {
        props.action();
    }
    router.push('/');
};

</script>

<style scoped>
.logo {
    position: absolute;
    top: 50px;
    left: 60px;
    width: 70px;
    height: 70px;
    cursor: pointer;
}
</style>