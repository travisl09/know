<script setup>
import { Question } from '@/types';
import * as generate from '@/services/generate'
import { ref, watch } from 'vue';
import LoadModal from './LoadModal.vue'

const props = defineProps({
    context: String,
    advanceEvent: Boolean
})
const questions = ref([])
const questionIndex = ref(-1)
const question = ref(new Question())
const loading = ref(false)
const picked = ref(null)
watch(() => props.context, (newValue, oldValue) => {
    if (questions.value && questions.value.length && newValue !== oldValue) {
        questions.value = []
        questionIndex.value = -1
    }
})
watch(() => props.advanceEvent, async () => {
    picked.value = null
    await advanceQuestion()
})
async function advanceQuestion() {
    if (!props.context) {
        return
    }
    if (!questions.value || !questions.value.length) {
        loading.value = true
        if (await generate.isContent(props.context)) {
            try {
                questions.value = await generate.questions(props.context)
            }
            catch {
                question.value = null
            }
            finally {
                questionIndex.value = -1
            }
        }
        loading.value = false
    }
    const nextIndex = questionIndex.value + 1
    if (questions.value && nextIndex >= 0 && nextIndex < questions.value.length) {
        questionIndex.value = questionIndex.value + 1
        question.value = questions.value[questionIndex.value]
    }
    else {
        questionIndex.value = -1
        question.value = new Question()
    }
}

</script>

<template>
    <div class="question-view">
        <LoadModal :open="loading" />
        <div class="text">
            {{ question.text || 'No question to display...' }}
        </div>
        <div class="options">
            <div class="option" :key="option" v-for="(option, index) in question.options">
                <input :disabled="picked !== null" type="radio" :id="'option-' + index" :value="index" v-model="picked" />
                <label :for="'option-' + index"
                    :class="{
                        wrong: picked !== null && picked === index && question.answer !== index,
                        right: picked !== null && question.answer === index
                     }" >
                    {{ option }}
                </label>
            </div>
        </div>
        <div class="details" v-if="picked !== null">{{ question.explanation }}</div>
    </div>
</template>
<style scoped>
.question-view {
    font-size: 1.3rem;
}
.text {
    margin-bottom: 10px;
}
.option input,
.option label {
    cursor: pointer;
}
.option label {
    margin-left: 1rem;
}
.option .wrong {
    color: red;
}
.option .right {
    color: green;
}
.details {
    margin-top: 2rem;
}
</style>