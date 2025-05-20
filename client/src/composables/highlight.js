import { ref, onMounted, onUnmounted } from "vue";

export function useHighlight() {
    const selectedText = ref('')
    const primaryMouseButtonDown = ref(false)

    function onHighlight() {
        const selection = document.getSelection()
        const str = selection.toString()
        if (!primaryMouseButtonDown.value && str) {
            selectedText.value = selection.toString()
        }
    }

    function setPrimaryButtonState(e) {
        var flags = e.buttons !== undefined ? e.buttons : e.which;
        primaryMouseButtonDown.value = (flags & 1) === 1;
    }

    onMounted(() => {
        document.addEventListener('selectionchange', onHighlight)
        document.addEventListener("mousedown", setPrimaryButtonState);
        document.addEventListener("mousemove", setPrimaryButtonState);
        document.addEventListener("mouseup", setPrimaryButtonState);
        document.addEventListener("mouseup", onHighlight);
    })
    onUnmounted(() => {
        document.removeEventListener('selectionchange', onHighlight)
        document.removeEventListener("mousedown", setPrimaryButtonState);
        document.removeEventListener("mousemove", setPrimaryButtonState);
        document.removeEventListener("mouseup", setPrimaryButtonState);
        document.removeEventListener("mouseup", onHighlight);
    })

    return { selectedText, primaryMouseButtonDown }
}