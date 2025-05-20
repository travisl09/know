<script setup>
import { ref, inject } from 'vue'
import { IconoirProvider, NavArrowRight, NavArrowDown, Trash } from '@iconoir/vue';
import { Titles, Title } from '@/repos/titles';
const { setView } = inject('iconSideNavProvider')
const appProvider = inject('appProvider')
const props = defineProps(['isHidden', 'name', 'model'])
const repo = new Titles()
const isOpen = ref(props.isHidden)

function toggle() {
    isOpen.value = !isOpen.value
}
function selectTitle(title) {
    setView(null)
    appProvider.setTitle(title)
    appProvider.setView(null)
}
/**
 * 
 * @param {Title} title 
 */
async function deleteTitle(title) {
    await repo.deleteTitle(title.id, title.txtFileId, title.srcFileId)
    await appProvider.setTitles()
}
</script>

<template>
<div class="library-item" :class="{'hidden': isHidden}">
    <template v-if="!isHidden">
        <div class="item">
            <div class="name" @click="toggle">
                <IconoirProvider>
                    <NavArrowDown width="1em" height="1em" v-if="isOpen" />
                    <NavArrowRight width="1em" height="1em" v-else />
                    {{ name }}
                </IconoirProvider>
            </div>
        </div>
    </template>
    <template v-if="isOpen">
        <ul>
            <li v-for="(folder, key) in model.folders" :key="key">
                <LibraryItem :name="key" :model="folder" />
            </li>
        </ul>
        <ul>
            <li v-for="title in model.titles" :key="title.id">
                <div class="item">
                    <div class="title">
                        <a @click="selectTitle(title)">{{ title.name }}</a>
                    </div>
                    <div class="actions">
                        <IconoirProvider>
                            <div class="action" @click="deleteTitle(title)">
                                <Trash width="1em" height="1em" />
                            </div>
                        </IconoirProvider>
                    </div>
                </div>
            </li>
        </ul>
    </template>
</div>
</template>

<style scoped>
.library-item.hidden > ul {
    padding-inline-start: 0;
}
.library-item ul {
    padding-inline-start: 1rem;
    list-style-type: none;
}
.library-item .item {
    display: flex;
    place-items: center;
}
.library-item .actions {
    display: flex;
    place-items: center;
}
.library-item .actions .action{
    display: flex;
    place-items: center;
    color: var(--color-text);
    cursor: pointer;
}
.name {
    display: flex;
    align-items: center;
}
.name,
.title {
    cursor: pointer;
    margin-right: 5px;
}
</style>