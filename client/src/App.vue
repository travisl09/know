<script setup>
import { ref, shallowRef, provide, onMounted } from 'vue'
import IconSideNav from './components/IconSideNav.vue'
import IconDocumentation from './components/icons/IconDocumentation.vue'
import TheLibrary from './components/TheLibrary.vue'
import TheReader from './components/TheReader.vue'
import TheSwitcher from './components/TheSwitcher.vue'
import TheLoader from './components/TheLoader.vue'
import { Titles } from './repos/titles'

const repo = new Titles()
const titles = shallowRef(null)
const titleUpdateObj = ref(true)
const title = ref(null)
const view = ref(null)

async function setTitles() {
  titles.value = await repo.getTitles()
  titleUpdateObj.value = !titleUpdateObj.value //Force library to rebuild
}
function setTitle(t) {
  title.value = t
}
function setView(viewName) {
  view.value = viewName
}

function setTheme(value) {
  document.documentElement.className = value ? 'theme-light' : 'theme-dark'
}

onMounted(async () => {
  await setTitles()
})

setTheme(false)
provide('appProvider', {
  setTitle,
  setView,
  setTitles
})
</script>

<template>
  <nav class="top-nav">
    <IconSideNav>
      <template #top="{ setView }">
          <i @click="setView('library')">
              <IconDocumentation />
          </i>
      </template>
      <template #bottom>
          <i class="theme-switcher">
            <TheSwitcher @toggled="setTheme" />
          </i>
      </template>
      <template #drawer="slotProps">
        <TheLibrary :titles="titles" :key="titleUpdateObj" v-show="slotProps.view === 'library'" />
      </template>
    </IconSideNav>
  </nav>

  <main>
    <TheReader v-show="!view" :title="title" />
    <TheLoader v-show="view === 'loader'" @titlesChanged="setTitles()" />
  </main>
</template>

<style scoped>
.top-nav {
  min-width: 48px;
}
main {
  max-width: 1280px;
}
</style>
