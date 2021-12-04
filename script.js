const grid = document.querySelector('.grid')
const cells = Array.from(grid.children)
cells.forEach((c, i) => {
	c.onclick = handleClick
})

const pl1 = document.querySelector('.pl1')
const figures1 = Array.from(pl1.children)
figures1.forEach((f, i) => {
	f.onclick = handleClick
})

const pl2 = document.querySelector('.pl2')
const figures2 = Array.from(pl2.children)
figures2.forEach((f, i) => {
	f.onclick = handleClick
})

const clicks = {
	prev: null,
	curr: null,
}

function handleClick(e) {
	clicks.prev = clicks.curr
	clicks.curr = e.target

	console.clear()
	console.log(clicks)

	if (has(clicks.prev, 'dot') && has(clicks.prev, 'unused') && has(clicks.curr, 'cell')) {
		handleMovement(clicks.prev, clicks.curr)
	}
	if (has(clicks.prev, 'dot') && has(clicks.prev, 'unused') && has(clicks.curr.parentNode, 'cell')) {
		handleMovement(clicks.prev, clicks.curr.parentNode)
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
	}

	if (Array.from(cell.children).length === 1) {
		const dotPrev = cell.children[0]

		if (samePl(dotCurr, dotPrev)) return
		if (!smaller(dotPrev, dotCurr)) return

		dotPrev.remove()
		doStuff()
	}
}

function smaller(d1, d2) {
	if (has(d1, 'small') && (has(d2, 'medium') || has(d2, 'large'))) return true
	if (has(d1, 'medium') && has(d2, 'large')) return true
	return false
}

function has(e, p) {
	return Array.from(e.classList).includes(p)
}

function samePl(e1, e2) {
	return (has(e1, 'pl1') && has(e2, 'pl1')) || (has(e1, 'pl2') && has(e2, 'pl2'))
}
