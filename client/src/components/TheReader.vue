<script setup>
import { ref, computed, watch } from 'vue'
import { IconoirProvider, Text, NavArrowRight, NavArrowLeft, Expand, Collapse } from '@iconoir/vue'
import { Files, FileRecord, PageTypes } from '../repos/files'
import { marked } from 'marked'
import QuestionView from './QuestionView.vue'
import { useHighlight } from '@/composables/highlight'
import { useFullScreen } from '@/composables/fullScreen'
import * as generate from '@/services/generate'
import LoadModal from './LoadModal.vue'
import { useSwipe } from '@vueuse/core'

const STROKE_WIDTH = 2
const FONT_INCREMENT = .07

const props = defineProps(['title'])
const { selectedText } = useHighlight()
const { toggleFullscreen, inFullScreen, fullScreenSupported } = useFullScreen()
const fileRepo = new Files()
const file = ref(new FileRecord(null))
const pages = ref([])
const page = ref(0)
const contentView = ref('')
const questionAdvanceEvent = ref(false)
const fontSize = ref(1.4)
const contentEl = ref(null)
const contentStyle = computed(() => ({
    'line-height': (fontSize.value * 1.4) + 'rem',
    'font-size': fontSize.value + 'rem'
}))
const imageLoading = ref(false)
const getImages = ref(false)
const image = ref('')
const imagePrompt = ref(null)
const contentViewContainer = ref(null)
const { direction } = useSwipe(contentViewContainer, {
    onSwipeEnd() {
        if (direction.value === 'left') {
            if (contentView.value === '') {
                advancePage()
            }
            else if (contentView.value === 'question') {
                advanceQuestion()
            }
        }
        else if (direction.value === 'right') {
            if (contentView.value === '') {
                advancePage(true)
            }
        }
    }
})

function splitPages(text, pageType) {
    const docFn = (t) => t.split('\f')
    const defaultFn = (t) => t.split(/(?<=\..*)[\r\n]/)
    if (pageType === PageTypes.FORM_FEED && text.search(/\f/) > 0) {
        return docFn(text)
    }
    return defaultFn(text)
}
watch(() => props.title, async (newTitle, oldTitle) => {
    if (props.title && newTitle.txtFileId != oldTitle?.txtFileId) {
        file.value = await fileRepo.getFile(newTitle.txtFileId)
        const text = await file.value.blob.text()
        pages.value = splitPages(text, file.value.pageType)
        page.value = 0
    }
})
watch(selectedText, () => {
    console.log(selectedText.value)
})
watch([getImages, page], async ([newGetImages, newPage]) => {
    if (newGetImages && validPageSelected()) {
        imagePrompt.value = null
        image.value = await getImageBase64(pages.value[newPage])
    }
})
function validPageSelected() {
    return pages.value && page.value >= 0 && page.value < pages.value.length
}
const pageText = computed(() => {
    return validPageSelected() ? pages.value[page.value] : ''
})
const content = computed(() => {
    return validPageSelected() ?
        marked.parse(pages.value[page.value]) : 'No content to display...';
})
function advanceQuestion() {
    if (pageText.value) {
        contentView.value = 'question'
        questionAdvanceEvent.value = !questionAdvanceEvent.value
        window.scrollTo(0,0)
    }
}
function advancePage(back) {
    let pageOffset = back ? -1 : 1
    if (contentView.value) {
        pageOffset = back ? 0 : pageOffset
        contentView.value = ''
    }
    setPageOrderIfNew(page.value + pageOffset)
}
function setPageOrderIfNew(order) {
    if (order < 0) {
        order = 0
    }
    else if (order >= pages.value.length) {
        order = pages.value.length - 1
    }
    if (order != page.value) {
        page.value = order 
        window.scrollTo(0,0)
    }
}
async function getImageBase64(context) {
    let imageBase64 = ''
    imageLoading.value = true
    try {
        if (imagePrompt.value) {
            imageBase64 = await generate.image(imagePrompt.value)
        }
        else if (context && await generate.isContent(context)) {
            imagePrompt.value = await generate.imagePrompt(context)
            if (imagePrompt.value) {
                imageBase64 = await generate.image(imagePrompt.value)
            }
        }
    }
    finally {
        imageLoading.value = false
    }
    return imageBase64
}
async function clickImage() {
    image.value = await getImageBase64(pages.value[page.value])
}
</script>

<template>
<div class="reader-container">
    <div class="controls top">
        <div class="top-control" v-if="file.blob">
            <input id="chk-image" class="check" type="checkbox" v-model="getImages" />
            <label for="chk-image">Images</label>
        </div>
        <div class="top-control" v-if="file.blob">
            <input class="txt-page" type="number" v-model.lazy.number="page" /> / {{ pages.length }}
        </div>
    </div>
    <div class="content-view" ref="contentViewContainer">
        <div v-show="contentView === ''" class="content-container">
            <div class="content" ref="contentEl" :style="contentStyle" v-html="content"></div>
            <div class="image" v-if="getImages" >
                <img v-if="!imageLoading && image" @click="clickImage"
                    :src="`data:image/png;base64, ${image}`" :title="imagePrompt" />
                <LoadModal v-else-if="imageLoading" :open="imageLoading" :teleport="false" />
                <div v-else>(No image to display)</div>
            </div>
        </div> 
        <QuestionView v-show="contentView === 'question'" class="content-container"
                    :advanceEvent="questionAdvanceEvent" :context="pageText" />
    </div>
    <div class="controls bottom icons">
        <IconoirProvider
            :icon-props="{
            }">
            <div class="control" @click="fontSize -= FONT_INCREMENT">
                <Text :stroke-width="STROKE_WIDTH"/>-
            </div>
            <div class="control" @click="fontSize += FONT_INCREMENT">
                <Text :stroke-width="STROKE_WIDTH"/>+
            </div>
            <div class="control" @click="toggleFullscreen" v-if="fullScreenSupported">
                <Expand :stroke-width="STROKE_WIDTH" v-if="!inFullScreen"/>
                <Collapse :stroke-width="STROKE_WIDTH" v-else/>
            </div>
            <div class="control" @click="advancePage(true)">
                <NavArrowLeft :stroke-width="STROKE_WIDTH"/>
            </div>
            <div class="control" @click="advanceQuestion">
                <NavArrowRight :stroke-width="STROKE_WIDTH"  />?
            </div>
            <div class="control" @click="advancePage()">
                <NavArrowRight :stroke-width="STROKE_WIDTH"  />
            </div>
        </IconoirProvider>
    </div>
</div>
</template>

<style scoped>
.reader-container .content-view {
    min-height: 100vh;
}
.reader-container .content-container {
    padding: 1.5rem;
    margin-top: 48px;
    margin-bottom: 48px;
}
.reader-container .image {
    margin-top: calc(48px + 1.5rem);
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;
    min-height: 512px;
}
.reader-container .image img {
    max-width: calc(100% - 1.5rem);
    height: auto;
    border-radius: 5px;
}
.reader-container .controls {
    min-height: 48px;
    min-width: calc(100% - 48px);
    background: var(--color-background-soft);
    position: fixed;
}
.reader-container .controls.top {
    top: 0;
    display:flex;
    align-items: center;
    justify-content: end;
    padding-right: 1em;
}
.reader-container .top-control {
    margin-left: 15px;
}
.reader-container .check {
    margin-right: 5px;
}
.reader-container .controls.top .txt-page {
    width: 60px;
    background: var(--color-background);
    color: var(--color-text)
}
.reader-container .controls.bottom {
    bottom: 0;
    opacity: .75;
    display: flex;
    align-items: center;
    justify-content: end;
}
.reader-container .control {
    padding: .5rem;
    cursor: pointer;
}
</style>