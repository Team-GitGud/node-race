<template>
    <div class="tree-node">
        <button class="node-btn" @click="handleClick">
            <span v-if="selectedOrder[node.id] !== -1">
                {{ selectedOrder[node.id] }}
            </span>
        </button>
        <div class="children">
            <TreeNode
                v-if="node.leftChild"
                :node="node.leftChild"
                :selectedOrder="selectedOrder"
                @select="emitSelect"
            />
            <TreeNode
                v-if="node.rightChild"
                :node="node.rightChild"
                :selectedOrder="selectedOrder"
                @select="emitSelect"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { Node } from '@/types/Node';

const props = defineProps<{
    node: Node;
    selectedOrder: Record<string, number>;
}>();

const emit = defineEmits<{
    (e: 'select', newOrder: Record<string, number>): void;
}>();

function handleClick() {
    let newOrder = { ...props.selectedOrder };
    const current = newOrder[props.node.id];
    if (current === -1) {
        // Not selected yet, set to highest number + 1
        const max = Math.max(...Object.values(newOrder), 0);
        newOrder[props.node.id] = max + 1;
    } else if (current === Object.keys(newOrder).length) {
        // At the end, reset to 1
        newOrder[props.node.id] = 1;
    } else {
        // Increase by 1
        newOrder[props.node.id] = current + 1;
    }

    emit('select', newOrder);
}

function emitSelect(newOrder: Record<string, number>) {
    emit('select', newOrder);
}
</script>

<style scoped>
.tree-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5rem;
}
.node-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 0.5rem;
    position: relative;
    background-color: #4F95D8;
    border: none;
    outline: none;
    box-shadow: 2px 2px 0 2px #235F9C;
}
.node-btn span {
    color: white;
    font-size: 2.4rem;
}
.children {
    display: flex;
    gap: 1rem;
}
</style>