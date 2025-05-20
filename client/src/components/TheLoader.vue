<script setup>
import { ref, inject } from 'vue'
import { Titles, Title } from '@/repos/titles';
import * as extract from '@/services/extract'
import { PageTypes } from '@/repos/files';
import LoadModal from './LoadModal.vue';

const appProvider = inject('appProvider')
const titleRepo = new Titles()
const title = ref('')
const folder = ref('')
const isFileInput = ref(true)
const url = ref('')
const file = ref(null)
const fileEl = ref(null)
const error = ref(false)
const loading = ref(false)
const emits = defineEmits(['titlesChanged'])


function cancel() {
    appProvider.setView(null)
}
function fileChanged(event) {
    file.value = event.target.files ? event.target.files[0] : null
}
function resetForm() {
    title.value = ''
    file.value = null
    if (fileEl.value) {
        fileEl.value.value = ''
    }
    url.value = ''
    folder.value = ''
}
async function submit() {
    if (!(error.value = (!title.value ||
            (isFileInput.value && !file.value) || (!isFileInput.value && !url.value)
        ))) {
        let promise
        let srcBlob
        let srcUrl
        let pageType = PageTypes.NONE
        if (isFileInput.value) {
            srcBlob = file.value
            pageType = PageTypes.FORM_FEED
            promise = extract.file(file.value)
        }
        else {
            srcUrl = url.value
            promise = extract.url(url.value)
        }
        loading.value = true
        try {
            const response = await promise
            const text = await response.text()
            const txtBlob = new Blob([text])
            let newTitle = new Title(title.value, folder.value, undefined, undefined, srcUrl)
            newTitle = await titleRepo.addTitle(newTitle, txtBlob, pageType, srcBlob)
            resetForm()
            appProvider.setView(null)
            appProvider.setTitle(newTitle)
            emits("titlesChanged")
        }
        catch(e) {
            console.log(e)
        }
        finally {
            loading.value = false
        }
    }
}
</script>
<template>
    <div class="loader">
        <LoadModal :open="loading" />
        <h1>Load Document</h1>
        <div class="form">
            <div>
                <div class="control">
                    <input placeholder="Please enter a title" type="text" v-model="title" />
                    <span v-show="error && !title" class="error">*</span>
                </div>
                <div class="control">
                    <input placeholder="Optionally, enter a folder (e.g. my/folder/path)"
                        type="text" v-model="folder" />
                </div>
                <div class="control">
                    <input type="radio" id="is-file" :value="true" v-model="isFileInput" />
                    <label class="radio-label" for="is-file">File</label>

                    <input type="radio" id="is-url" :value="false" v-model="isFileInput" />
                    <label class="radio-label" for="is-url">Url</label>
                </div>
                <div class="control" v-if="isFileInput">
                    <input type="file" ref="fileEl" @change="fileChanged" />
                    <span v-show="error && isFileInput && !file" class="error">*</span>
                </div>
                <div class="control" v-else>
                    <input placeholder="Please enter a url"
                        type="text" v-model="url" />
                    <span v-show="error && !isFileInput && !url" class="error">*</span>
                </div>
            </div>
            <div class="actions">
                <div class="link-button">
                    <a @click="cancel">Cancel</a>
                </div>
                <div class="link-button">
                    <a @click="submit">Submit</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.loader {
    padding: 1rem;
}
.loader .form {
    display: flex;
    flex-direction: column;
    min-height: 100px;
}
.loader .form .control {
    margin-bottom: 5px;
}
.loader .form .control .error {
    color: purple;
}
.loader .form .control input {
    width: 300px;
    margin-right: 10px;
}
.loader .form .control input[type="radio"] {
    width: unset;
    margin-right: 10px;
}
.loader .form .control .radio-label {
    margin-right: 20px;
}
.loader .form .actions {
    display: flex;
    flex: 1;
    justify-content: center;
    place-items: end;
}
.loader .form .actions .link-button {
    cursor: pointer;
    margin-right: 30px;
}
</style>