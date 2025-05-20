import { Question } from "@/types"
const apiUrl = import.meta.env.VITE_KNOW_API_URL + '/generate'
const isContentPath = apiUrl + '/is-content'
const questionsPath = apiUrl + '/questions'
const imagePromptPath = apiUrl + '/image-prompt'
const imagePath = apiUrl + '/image'

/**
 * 
 * @param {string} context 
 * @returns {Promise<boolean>}
 */
export async function image(prompt) {
    const formData = new FormData()
    formData.append('prompt', prompt)
    const response = await fetch(imagePath, {
        method: 'POST',
        body: formData
    })
    const obj = await response.json()
    return obj.image
}

/**
 * 
 * @param {string} context 
 * @returns {Promise<boolean>}
 */
export async function imagePrompt(context) {
    const formData = new FormData()
    formData.append('context', context)
    const response = await fetch(imagePromptPath, {
        method: 'POST',
        body: formData
    })
    const obj = await response.json()
    return obj.prompt
}

/**
 * 
 * @param {string} context 
 * @returns {Promise<boolean>}
 */
export async function isContent(context) {
    const formData = new FormData()
    formData.append('context', context)
    const response = await fetch(isContentPath, {
        method: 'POST',
        body: formData
    })
    const obj = await response.json()
    return obj.is_content
}

/**
 * 
 * @param {string} context 
 * @returns {Promise<Question[]>}
 */
export async function questions(context) {
    const formData = new FormData()
    formData.append('context', context)
    const response = await fetch(questionsPath, {
        method: 'POST',
        body: formData,
    })
    const obj = await response.json()
    /** @type {Question[]} */
    const questions = obj.questions
    return questions.map(q => Object.assign(new Question(), q))
}