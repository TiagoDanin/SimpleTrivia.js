/* eslint-disable no-undef */

let score = 0
let trival = {}

const colors = {
	green: '#32d296',
	red: '#f0506e'
}

const apiBase = 'https://opentdb.com/api.php?amount=1&type=multiple'

const useXHR = url => new Promise((resolve, reject) => {
	try {
		const xhr = new XMLHttpRequest()
		xhr.withCredentials = false

		xhr.open('GET', url)
		xhr.addEventListener('load', () => resolve(xhr.responseText))
		xhr.addEventListener('error', () => reject(xhr.statusText))
		xhr.send()
	} catch (error) {
		reject(error)
	}
})

const showQuestion = () => {
	document.querySelector('#app').hidden = false
	const questions = [...trival.incorrect_answers, trival.correct_answer].sort(() => 0.5 - Math.random())

	let htmlAnswers = '<h2 class="uk-card-title">Answers</h2>\n'
	for (let question of questions) {
		question = question.charAt(0).toUpperCase() + question.slice(1)
		htmlAnswers += `<button style="margin-bottom: 3%;" type="button" class="bt-select uk-button uk-text-large">${question}</button>\n`
	}

	document.querySelector('#answers').innerHTML = htmlAnswers
	document.querySelector('#question').innerHTML = trival.question
	document.querySelector('#title').innerText = `Category: ${trival.category} (${trival.difficulty})`
	for (const answer of document.querySelectorAll('.bt-select')) {
		answer.addEventListener('click', checkAnswer, false)
	}
}

const getQuestions = () => {
	if (typeof window.fetch === 'undefined') {
		window.fetch = useXHR
	}

	return fetch(apiBase)
		.then(res => typeof res.json === 'undefined' ? JSON.parse(res) : res.json())
		.then(data => {
			if (data.response_code === 0) {
				trival = data.results[0]
				showQuestion()
			}
		}).catch(error => console.error(error))
}

const checkAnswer = async eventClick => {
	for (const answer of document.querySelectorAll('.bt-select')) {
		answer.removeEventListener('click', checkAnswer)
		if (trival.correct_answer.toUpperCase() === answer.innerText.toUpperCase()) {
			answer.style.borderColor = colors.green
			answer.style.borderStyle = 'solid'
		}
	}

	if (trival.correct_answer.toUpperCase() === eventClick.target.innerText.toUpperCase()) {
		switch (trival.difficulty) {
			case 'easy':
				score += 5
				break
			case 'medium':
				score += 10
				break
			case 'hard':
				score += 20
				break
			default:
				score += 5
		}

		document.querySelector('#score-point').innerText = `Points: ${score}`
		eventClick.target.style.background = colors.green
	} else {
		eventClick.target.style.background = colors.red
	}

	eventClick.target.style.color = 'black'

	await new Promise(resolve => setTimeout(resolve, 1500))
	getQuestions()
}

getQuestions()
