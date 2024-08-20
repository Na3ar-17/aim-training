document.addEventListener('DOMContentLoaded', () => {
	const actionButton = document.querySelector('.action-button')
	const content = document.querySelector('.content')
	const displayScore = document.querySelector('.statistics .score')
	const displayAccuracy = document.querySelector('.statistics .accuracy')
	const statistics = document.querySelector('.statistics')
	const missMessage = document.querySelector('.miss-message')
	const screenCenter = document.querySelector('.screen-center')

	let isTrainingStarted = false
	let score = 0
	let trainingInterval
	let totalClicks = 0
	let successfulClicks = 1
	let accuracy = 100

	actionButton.addEventListener('click', toggleTraining)

	document.body.addEventListener('click', e => {
		if (!isTrainingStarted) return

		const clickedElement = e.target
		const circle = clickedElement.closest('.circle')
		const { clientX: x, clientY: y } = e

		totalClicks++

		if (circle) {
			circle.remove()
			score++
			successfulClicks++
			hideMissMessage()
		} else if (clickedElement !== actionButton) {
			score--
			showMissMessage(x, y)
		}

		updateStats()
	})

	function toggleTraining() {
		return isTrainingStarted ? endTraining() : startTraining()
	}

	function startTraining() {
		isTrainingStarted = true
		content.classList.add('started')
		actionButton.innerText = 'End Training'
		actionButton.classList.add('action-button-active')
		statistics.classList.add('statistics-active')

		screenCenter.classList.add('screen-center-active')

		trainingInterval = setInterval(generateCircles, 1 * 1000)
	}

	function endTraining() {
		isTrainingStarted = false
		content.classList.remove('started')
		actionButton.innerText = 'Start Training'
		actionButton.classList.remove('actionButton-active')
		statistics.classList.remove('statistics-active')
		screenCenter.classList.remove('screen-center-active')

		clearInterval(trainingInterval)
		deleteCircles()

		setTimeout(() => {
			score = 0
			accuracy = 100
			successfulClicks = 1
			totalClicks = 0
		}, 300)

		updateStats()
	}

	function generateCircles() {
		if (document.querySelectorAll('.circle').length >= 15) return

		const circle = document.createElement('div')
		const size = generateCircleSize(90, 50)
		const coords = generateRandomCoordinates(size.width)

		circle.style.top = `${coords.top}px`
		circle.style.left = `${coords.left}px`
		circle.style.width = `${size.width}px`
		circle.classList.add('circle')
		document.body.appendChild(circle)
	}

	function generateCircleSize(maxSize, minSize) {
		return {
			width: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
		}
	}

	function generateRandomCoordinates(circleSize) {
		const maxTop = window.innerHeight - circleSize
		const maxLeft = window.innerWidth - circleSize
		const {
			top: centerTop,
			left: centerLeft,
			width: centerWidth,
			height: centerHeight,
		} = screenCenter.getBoundingClientRect()

		let coords

		do {
			coords = {
				top: Math.floor(Math.random() * maxTop),
				left: Math.floor(Math.random() * maxLeft),
			}
		} while (
			coords.top < centerTop + centerHeight &&
			coords.top + circleSize > centerTop &&
			coords.left < centerLeft + centerWidth &&
			coords.left + circleSize > centerLeft
		)

		return coords
	}

	function deleteCircles() {
		document.querySelectorAll('.circle').forEach(circle => circle.remove())
	}

	function showMissMessage(x, y) {
		if (missMessage.style.animation) missMessage.style.animation = ''

		let left = x - missMessage.offsetWidth / 2
		let top = y - missMessage.offsetHeight / 2

		left = Math.max(
			10,
			Math.min(left, window.innerWidth - missMessage.offsetWidth - 10)
		)
		top = Math.max(
			10,
			Math.min(top, window.innerHeight - missMessage.offsetHeight - 10)
		)

		missMessage.style.top = `${top}px`
		missMessage.style.left = `${left}px`
		missMessage.style.animation = 'show 0.4s ease forwards'
	}

	function hideMissMessage() {
		missMessage.style.opacity = 0
		missMessage.style.visibility = 'hidden'
	}

	function updateStats() {
		accuracy = (successfulClicks / totalClicks) * 100
		displayScore.innerText = `Score: ${score}`
		displayAccuracy.innerText = `Accuracy: ${Math.floor(accuracy)}%`
	}
})
