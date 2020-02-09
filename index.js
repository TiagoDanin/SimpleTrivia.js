let score = 0
let trival = {}
const apiBase = 'https://opentdb.com/api.php?amount=1&type=multiple'

const showQuestion = () => {
    document.getElementById('app').hidden = false
    const questions = [...trival.incorrect_answers, trival.correct_answer] // TODO random 

    let htmlAnswers = '<h2 class="uk-card-title">Answers</h2>\n'
    for (let question of questions) {
        question = question.charAt(0).toUpperCase() + question.slice(1);
        htmlAnswers += `<button style="margin-bottom: 3%;" type="button" class="bt-select uk-button uk-text-large">${question}</button>\n`
    }

    document.getElementById('answers').innerHTML = htmlAnswers
    document.getElementById('question').innerHTML = trival.question
    document.getElementById('title').innerText = `Category: ${trival.category} (${trival.difficulty})`
    for (const answer of document.getElementsByClassName('bt-select')) {
        answer.addEventListener('click', checkAnswer, false)
    }
}

const getQuestions = () => {
    return fetch(apiBase)
        .then(res => res.json())
        .then(data => {
            if (data.response_code == 0) {
                trival = data.results[0]
                showQuestion()
            }
        }).catch(error => console.error)
}

const checkAnswer = async(eventClick) => {
    for (const answer of document.getElementsByClassName('bt-select')) {
        answer.removeEventListener('click', checkAnswer)
    }

    if (trival.correct_answer.toUpperCase() === eventClick.target.innerText.toUpperCase()) {
        switch (trival.difficulty) {
            case 'easy':
                score += 5;
                break;
            case 'medium':
                score += 10;
                break;
            case 'hard':
                score += 20;
                break;
            default:
                score += 5;
        }
        document.getElementById('score-point').innerText = `Points: ${score}`
        eventClick.target.style.background = '#32d296'
    } else {
        eventClick.target.style.background = '#f0506e'
    }
    eventClick.target.style.color = 'black'

    await new Promise(resolve => setTimeout(resolve, 1500));
    getQuestions()
}

getQuestions()