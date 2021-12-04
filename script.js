const grid = document.querySelector('.grid')
const cells = Array.from(grid.children)
cells.forEach((c, i) => {
	c.onclick = handleClick
})

const pl1 = document.querySelector('.pl.pl1')
const figures1 = Array.from(pl1.children)
figures1.forEach((f, i) => {
	f.onclick = handleClick
})

const pl2 = document.querySelector('.pl.pl2')
const figures2 = Array.from(pl2.children)
figures2.forEach((f, i) => {
	f.onclick = handleClick
})

const winningMessageElement = document.querySelector(`.winning-message`)
const winningMessageTextElement = document.querySelector(`.winning-message-text`)
const restartButton = document.querySelector(`.restart-button`)
restartButton.onclick = start

const combs = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
]

const clicks = {
	prev: null,
	curr: null,
}

let ended = true
let turn = 'pl2'

start()
function start() {
	ended = false
	turn = 'pl2'
	winningMessageElement.classList.remove('show')
	emptyGrid()
	replaceDots()
	handleTurns()
}

function emptyGrid() {
	cells.forEach((c, i) => {
		cells[i].replaceChildren()
	})
}

function replaceDots() {
	const dots1 = new Array(6).fill().map(() => document.createElement('div'))
	dots1.forEach((d1) => {
		d1.classList.add('dot', 'pl1', 'unused')
	})
	dots1[0].classList.add('large', 'top', 'left')
	dots1[1].classList.add('large', 'top', 'right')
	dots1[2].classList.add('medium', 'middle', 'left')
	dots1[3].classList.add('medium', 'middle', 'right')
	dots1[4].classList.add('small', 'bottom', 'left')
	dots1[5].classList.add('small', 'bottom', 'right')

	const dots2 = new Array(6).fill().map(() => document.createElement('div'))
	dots2.forEach((d2) => {
		d2.classList.add('dot', 'pl2', 'unused')
	})
	dots2[0].classList.add('large', 'top', 'left')
	dots2[1].classList.add('large', 'top', 'right')
	dots2[2].classList.add('medium', 'middle', 'left')
	dots2[3].classList.add('medium', 'middle', 'right')
	dots2[4].classList.add('small', 'bottom', 'left')
	dots2[5].classList.add('small', 'bottom', 'right')

	dots1.forEach((d1) => {
		d1.onclick = handleClick
	})
	dots2.forEach((d2) => {
		d2.onclick = handleClick
	})

	pl1.replaceChildren(...dots1)
	pl2.replaceChildren(...dots2)
}

function handleClick(e) {
	if (ended) return

	clicks.prev = clicks.curr
	clicks.curr = e.target

	console.log(clicks)

	if (has(clicks.prev, 'dot') && has(clicks.prev, 'unused') && has(clicks.curr, 'cell')) {
		if (has(clicks.prev, turn)) handleMovement(clicks.prev, clicks.curr)
	}
	if (has(clicks.prev, 'dot') && has(clicks.prev, 'unused') && has(clicks.curr.parentNode, 'cell')) {
		if (has(clicks.prev, turn)) handleMovement(clicks.prev, clicks.curr.parentNode)
	}
}

function handleMovement(dotCurr, cell) {
	const doStuff = () => {
		dotCurr.remove()
		dotCurr.classList.remove('unused')
		dotCurr.classList.remove('top', 'middle', 'bottom', 'left', 'right')
		dotCurr.onclick = null
		cell.appendChild(dotCurr)
	}

	if (Array.from(cell.children).length === 0) {
		doStuff()
		handleTurns()
	}

	if (Array.from(cell.children).length === 1) {
		const dotPrev = cell.children[0]

		if (samePl(dotCurr, dotPrev)) return
		if (!smaller(dotPrev, dotCurr)) return

		dotPrev.remove()
		doStuff()
		handleTurns()
	}
}

function handleTurns() {
	handleWinning()
	if (turn == 'pl1') {
		turn = 'pl2'
		pl1.style.boxShadow = ''
		pl2.style.boxShadow = '0 0 1vh 1vh hsla(0, 60%, 60%, 1)'
		return
	}
	if (turn == 'pl2') {
		turn = 'pl1'
		pl1.style.boxShadow = '0 0 1vh 1vh hsla(210, 60%, 60%, 1)'
		pl2.style.boxShadow = ''
		return
	}
}

function handleWinning() {
	if (ended) return
	let winPl = ''
	combs.forEach((comb) => {
		if (
			has(cells[comb[0]].children[0], 'pl1') &&
			has(cells[comb[1]].children[0], 'pl1') &&
			has(cells[comb[2]].children[0], 'pl1')
		)
			winPl = 'pl1'

		if (
			has(cells[comb[0]].children[0], 'pl2') &&
			has(cells[comb[1]].children[0], 'pl2') &&
			has(cells[comb[2]].children[0], 'pl2')
		)
			winPl = 'pl2'
	})
	if (cells.every((c) => has(c.children[0], 'dot'))) winPl = 'draw'

	if (winPl !== '') {
		ended = true

		winningMessageTextElement.innerText = winPl === 'draw' ? `Draw!` : `${winPl === 'pl1' ? `Blue` : `Red`} Wins!`
		winningMessageElement.classList.add('show')
	}
}

function smaller(d1, d2) {
	if (has(d1, 'small') && (has(d2, 'medium') || has(d2, 'large'))) return true
	if (has(d1, 'medium') && has(d2, 'large')) return true
	return false
}

function has(e, p) {
	return e && Array.from(e.classList).includes(p)
}

function samePl(e1, e2) {
	return (has(e1, 'pl1') && has(e2, 'pl1')) || (has(e1, 'pl2') && has(e2, 'pl2'))
}
