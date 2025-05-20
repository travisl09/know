export class Question {
    /**
     * 
     * @param {string} text 
     * @param {string[]} options 
     * @param {number} answer 
     * @param {string} explanation
     */
    constructor(text, options, answer, explanation) {
        this.text = text
        this.options = options
        this.answer = answer
        this.explanation = explanation
    }
}