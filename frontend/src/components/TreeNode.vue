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
        <button 
            class="node-btn"
            ref="nodeBtn"
            @click="handleClick"
            :class="{ 
                'selected': selectedOrder.has(node.id), 
                'duplicate': Array.from(selectedOrder.values()).filter(v => v === selectedOrder.get(node.id)).length > 1,
                'incorrect': result === false,
                'correct': result === true
            }"
        >
            <span v-if="selectedOrder.has(node.id)">
                {{ selectedOrder.get(node.id) }}
            </span>
        </button>
        <div class="children" ref="childrenContainer">
            <TreeNode
                v-if="node.leftChild"
                :node="node.leftChild"
                :selectedOrder="selectedOrder"
                :result="result"
                @select="emitSelect"
            />
            <TreeNode
                v-if="node.rightChild"
                :node="node.rightChild"
                :selectedOrder="selectedOrder"
                :result="result"
                @select="emitSelect"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, watch, nextTick } from 'vue';
import { Node } from '@/types/tree/Node';

const props = defineProps<{
    node: Node;
    selectedOrder: Map<number, number>;
    result: boolean | null;
}>();

const emit = defineEmits<{
    (e: 'select', newOrder: Map<number, number>): void;
}>();

function handleClick() {
    console.log('Click detected on node:', props.node);
    console.log('Node ID:', props.node.id);
    console.log('Node type:', typeof props.node.id);
    
    let newOrder = new Map(props.selectedOrder);
    const current = newOrder.get(props.node.id);
    
    if (current === undefined) {
        // Node hasn't been selected yet, add it to the next position
        const nextPosition = newOrder.size + 1;
        newOrder.set(props.node.id, nextPosition);
        console.log(`Node ${props.node.id} selected as position ${nextPosition}`);
        console.log('New order map:', newOrder);
    } else {
        // Node already selected, remove it
        newOrder.delete(props.node.id);
        console.log(`Node ${props.node.id} deselected`);
        console.log('New order map:', newOrder);
    }
    
    emit('select', newOrder);
}

function emitSelect(newOrder: Map<number, number>) {
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
    border: none;
    outline: none;
    z-index: 1;
    transition: background-color 0.3s, box-shadow 0.3s;
    cursor: pointer;
}
.node-btn.duplicate:not(.incorrect):not(.correct), .node-btn:not(.selected):not(.incorrect):not(.correct) {
    background-color: var(--secondary-color);
    box-shadow: 2px 2px 0 2px var(--tertiary-color);
}
.node-btn.selected:not(.duplicate):not(.incorrect):not(.correct), .node-btn:not(.selected):not(.incorrect):not(.correct):hover {
    background-color: var(--primary-color);
    box-shadow: 2px 2px 0 2px var(--secondary-color);
}
.node-btn.incorrect {
    background-color: var(--negative-color);
    box-shadow: 2px 2px 0 2px color-mix(in srgb, var(--negative-color) 40%, black);
}
.node-btn.correct {
    background-color: var(--positive-color);
    box-shadow: 2px 2px 0 2px color-mix(in srgb, var(--positive-color) 40%, black);
}
.node-btn span {
    color: var(--text-color);
    font-size: 2.4rem;
}
.children {
    display: flex;
    gap: 1rem;
    position: relative;
    z-index: 1;
}
</style>