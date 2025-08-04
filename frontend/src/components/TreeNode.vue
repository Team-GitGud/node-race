<template>
    <div class="tree-node" ref="container">
        <svg
            v-if="lines.length"
            class="lines-svg"
            :width="containerSize.width"
            :height="containerSize.height"
            style="position: absolute; top: 0; left: 0; pointer-events: none;"
        >
            <line
                v-for="(line, idx) in lines"
                :key="idx"
                :x1="line.x1"
                :y1="line.y1"
                :x2="line.x2"
                :y2="line.y2"
                stroke="white"
                stroke-width="4"
            />
        </svg>
        <button class="node-btn" ref="nodeBtn" @click="handleClick">
            <span v-if="selectedOrder[node.id] !== -1">
                {{ selectedOrder[node.id] }}
            </span>
        </button>
        <div class="children" ref="childrenContainer">
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
import { defineProps, defineEmits, ref, onMounted, watch, nextTick } from 'vue';
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
        const max = Math.max(...Object.values(newOrder), 0);
        newOrder[props.node.id] = max + 1;
    } else if (current === Object.keys(newOrder).length) {
        newOrder[props.node.id] = 1;
    } else {
        newOrder[props.node.id] = current + 1;
    }
    emit('select', newOrder);
}

function emitSelect(newOrder: Record<string, number>) {
    emit('select', newOrder);
}

const container = ref<HTMLElement | null>(null);
const nodeBtn = ref<HTMLElement | null>(null);
const childrenContainer = ref<HTMLElement | null>(null);

const lines = ref<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
const containerSize = ref({ width: 0, height: 0 });

function updateLines() {
    requestAnimationFrame(() => {
        nextTick(() => {
            if (!container.value || !nodeBtn.value || !childrenContainer.value) {
                lines.value = [];
                return;
            }

            const parentRect = nodeBtn.value.getBoundingClientRect();
            const containerRect = container.value.getBoundingClientRect();
            containerSize.value.width = containerRect.width;
            containerSize.value.height = containerRect.height;

            const parentCenter = {
                x: parentRect.left - containerRect.left + parentRect.width / 2,
                y: parentRect.top - containerRect.top + parentRect.height / 2,
            };

            // Only direct children
            const childNodes = Array.from(childrenContainer.value.children)
                .filter(el => el.classList.contains('tree-node')) as HTMLElement[];
            const newLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
            childNodes.forEach((childNode) => {
                const btn = childNode.querySelector('.node-btn') as HTMLElement | null;
                if (!btn) return;
                const childRect = btn.getBoundingClientRect();
                const childCenter = {
                    x: childRect.left - containerRect.left + childRect.width / 2,
                    y: childRect.top - containerRect.top + childRect.height / 2,
                };
                newLines.push({
                    x1: parentCenter.x,
                    y1: parentCenter.y,
                    x2: childCenter.x,
                    y2: childCenter.y,
                });
            });
            lines.value = newLines;
        });
    });
}

// Only update lines when node or children change
onMounted(updateLines);
watch(() => [props.node.leftChild, props.node.rightChild], updateLines);
</script>

<style scoped>
.tree-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 3rem 1rem 0 1rem;
    position: relative;
    min-width: 80px;
    min-height: 80px;
}
.lines-svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
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
    z-index: 1;
}
.node-btn span {
    color: white;
    font-size: 2.4rem;
}
.children {
    display: flex;
    gap: 1rem;
    position: relative;
    z-index: 1;
}
</style>