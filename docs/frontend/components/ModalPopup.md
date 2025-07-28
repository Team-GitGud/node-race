# ModalPopup Component

A flexible modal dialog component for the Vue.js frontend.

## Usage

```html
<ModalPopup title="My Modal" v-if="isOpen" @close="isOpen = false">
  <template #body>
    <p>Modal content here.</p>
  </template>
  <template #footer>
    <CustomButton text="Close" :action="() => isOpen = false" type="negative" />
  </template>
</ModalPopup>
```

## Props

- `title`: The title of the modal. If not provided, no title will be displayed.

## Slots
- `body`: Content to be displayed in the body of the modal.
- `footer`: Content to be displayed in the footer of the modal, typically action buttons.

## Events

- `close`: Emitted when the modal is closed. Use this to update the state in the parent component to hide the modal.

## Import

```typescript
import ModalPopup from '@/components/ModalPopup.vue';
```