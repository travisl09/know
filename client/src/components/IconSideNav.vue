<script setup>
import {ref, provide} from 'vue'
import { useClickedOutsideOf } from '@/composables/clickedOutsideOf';

const view = ref(null)
const drawer = ref(null)
const container = ref(null)
useClickedOutsideOf(container, onClickedOutside)
function onClickedOutside() {
    if (view.value) {
        setView(null)
    }
}
function setView(component) {
    if (!view.value || view.value != component) {
        view.value = component
    } else {
        view.value = null
    }
}
defineProps(['handler'])
provide('iconSideNavProvider', {
    setView
})
</script>

<template>
<div ref="container" class="icon-side-nav">
    <div class="icons">
        <div class="top">
            <slot name="top" :setView="setView"></slot>
        </div>
        <div class="bottom">
            <slot name="bottom" :setView="setView"></slot>
        </div>
    </div>
    <div class="drawer" ref="drawer">
        <slot name="drawer" :view="view"></slot>
    </div>
</div>
</template>

<style scoped>
.icon-side-nav {
    display: flex;
    height: 100vh;
    position: fixed;
    z-index: 1;
}
.icon-side-nav .icons {
    display: flex;
    place-items: center;
    place-content: start;
    flex-direction: column;
    background: var(--color-background-mute);
    max-width: 48px;
}
.icon-side-nav .icons .top {
    display: flex;
    place-items: center;
    place-content: start;
    flex-direction: column;
}
.icon-side-nav .icons .bottom {
    flex: 1;
    display: flex;
    place-items: center;
    flex-direction: column;
    place-content: end;
}
.drawer {
    background: var(--color-background-soft);
    max-width: 350px;
}
</style>
<style>
.icon-side-nav .icons i {
    color: var(--color-text);
    display: flex;
    place-items: center;
    place-content: center;
    width: 48px;
    height: 48px;
    cursor: pointer;
}
</style>