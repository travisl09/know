<script setup>
import { computed, inject } from 'vue'
import { IconoirProvider, MultiplePagesPlus } from '@iconoir/vue';
import LibraryItem from './LibraryItem.vue'

const props = defineProps(['titles'])
const iconSideNavProvider = inject('iconSideNavProvider')
const { setView } = inject('appProvider')
const model = computed(() => {
    let root = { folders: {}, titles: []}
    if (!props.titles){
        return root
    }
    for (let title of props.titles) {
        let folderObj = root
        let folders = title.path.split('/').filter(s => s)
        for (let folder of folders) {
            folderObj.folders[folder] = folderObj.folders[folder] || {folders:{}, titles:[]}
            folderObj = folderObj.folders[folder]
        }
        folderObj.titles.push(title)
    }
    return root
})

function loadDocument() {
    iconSideNavProvider.setView(null)
    setView('loader')
}
</script>

<template>
<div class="library-container">
    <div class="header">
        <h1>Library</h1>
        <div class="icons">
            <IconoirProvider>
                <i @click="loadDocument">
                    <MultiplePagesPlus />
                </i>
            </IconoirProvider>
        </div>
    </div>
    <LibraryItem :isHidden="true" :model="model" />
</div>
</template>

<style scope>
.library-container {
    padding: .6rem;
    min-width: 350px;
    font-size: 1.1rem;
}
.library-container div {
    color: var(--color-heading)
}
.library-container .header {
    color: var(--color-text);
    display: flex;
    place-items: center;
}
.library-container .header .icons {
    display: flex;
    place-items: center;
    place-content: end;
    flex: 1;
}
</style>