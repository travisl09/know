import { ref, onMounted, onUnmounted } from "vue";

export function useFullScreen() {
    const inFullScreen = ref(false)
    const fullScreenSupported = ref(false)
    const fullScreenEl = ref(null)

    function setInFullscreen() {
        inFullScreen.value = !!document.fullscreenElement
    }

    function toggleFullscreen() {
        if (fullScreenSupported.value) {
            if (!inFullScreen.value) {
                fullScreenEl.value.requestFullscreen()
            }
            else {
                document.exitFullscreen()
            }
        }
    }
    onMounted(() => {
        document.addEventListener("fullscreenchange", setInFullscreen)
        fullScreenEl.value = document.documentElement
        fullScreenSupported.value = fullScreenEl.value?.requestFullscreen ? true : false
    })
    onUnmounted(() => {
        document.removeEventListener("fullscreenchange", setInFullscreen)
    })

    return {toggleFullscreen, inFullScreen, fullScreenSupported}
}