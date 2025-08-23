import { ref } from 'vue';

class AlertServiceClass {
    public visible = ref(false);
    public message = ref('');

    public alert(msg: string) {
        this.message.value = msg;
        this.visible.value = true;
    }

    public close() {
        this.visible.value = false;
    }
}

export const AlertService = new AlertServiceClass();