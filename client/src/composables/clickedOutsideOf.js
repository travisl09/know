import { onMounted, onUnmounted } from "vue";

export function useClickedOutsideOf(targetRef, callback) {
    function clickHandler(e) {
        const withinBoundaries = e.composedPath().includes(targetRef.value)
        if (!withinBoundaries) {
            callback(e)
        }
    }
    onMounted(() => {
        document.addEventListener('click', clickHandler)
    })
    onUnmounted(() => {
        document.removeEventListener('click', clickHandler)
    })
}