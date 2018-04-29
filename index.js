'use strict'

const h = require('virtual-dom/h')
const colors = require('vbb-util/lines/colors')
const products = require('vbb-util/products')
const ms = require('ms')

const renderTransferPosition = require('./lib/render-transfer-position')

const cls = 'vbb-journey-ui-'

const pedestrians = [
	'🚶🏻‍♀️', '🚶🏼‍♀️', '🚶🏽‍♀️', '🚶🏾‍♀️', '🚶🏿‍♀️',
	'🚶🏻‍♂️', '🚶🏼‍♂️', '🚶🏽‍♂️', '🚶🏾‍♂️', '🚶🏿‍♂️'
]

const dirArrow = h('abbr', {title: 'in direction of'}, '→')

const setup = (formatTime, formatDelay, actions = {}) => {
	// todo: NOVE_ENV === 'dev'
	if ('function' !== typeof formatTime) {
		throw new Error('formatTime must be a function.')
	}
	if ('function' !== typeof formatDelay) {
		throw new Error('formatDelay must be a function.')
	}

	const renderTime = (d) => {
		return h('time', {
			datetime: d.toISOString()
		}, formatTime(d))
	}

	const pedestrian = pedestrians[Math.floor(Math.random() * pedestrians.length)]

	const renderMode = (leg, i, details) => {
		if (leg.mode === 'walking') {
			const t = new Date(leg.arrival) - new Date(leg.departure)
			const s = [pedestrian, 'walk']
			if (!Number.isNaN(t)) s.push('for', ms(t, {long: true}))
			// todo: distance
			return h('li', {
				className: cls + 'leg ' + cls + 'walking',
				style: {borderLeftColor: '#999'}
			}, [
				h('div', {
					className: cls + 'details'
				}, s.join(' '))
			])
		}
		return renderLine(leg, i, details)
	}

	const renderCycle = (leg) => {
		let res = null
		if (leg.alternatives) {
			let d = Infinity
			for (let a of leg.alternatives) {
				if (a.line.id !== leg.line.id) continue
				const aD = new Date(a.when)
				if (aD < d) d = aD
			}
			res = h('span', {}, [
				'also at ', renderTime(d)
			])
		} else if (leg.cycle && 'number' === typeof leg.cycle.min) {
			const c = leg.cycle
			let msg = 'every ' + ms(c.min * 1000)
			if ('number' === typeof c.max && c.max !== c.min) {
				msg += '–' + ms(c.max * 1000)
			}
			res = h('span', {}, msg)
		}
		return res
	}

	const renderLine = (leg, i, details) => {
		const line = leg.line
		let color = {}
		let symbol = null
		if (line.product) {
			symbol = h('img', {
				className: cls + 'product',
				alt: line.product,
				src: `https://cdn.rawgit.com/derhuerst/vbb-logos/v2/${line.product}.svg`
			})

			if (colors[line.product] && colors[line.product][line.name]) {
				color = colors[line.product][line.name]
			} else if (products[line.product]) {
				color = {fg: '#fff', bg: products[line.product].color}
			}
		}

		const passed = []
		if (details) {
			for (let stopover of leg.passed.slice(1, -1)) {
				passed.push(h('li', {}, renderPassed(stopover.station, color.bg)))
			}
		}

		const l = leg.passed.length
		const label = (l - 1) + ' ' + (l === 2 ? 'stop' : 'stops')

		const nrOfPassed = leg.passed ? h('span', {
			className: cls + 'link',
			'ev-click': details ? () => actions.hideLegDetails(i) : () => actions.showLegDetails(i)
		}, label) : null

		const duration = new Date(leg.arrival) - new Date(leg.departure)

		const transferPosition = details && leg.arrivalPosition ? h('div', {
			className: cls + 'transfer-position'
		}, [
			renderTransferPosition(leg.arrivalPosition)
		]) : null

		return h('li', {
			className: cls + 'leg',
			style: {
				borderLeftColor: color.bg || '#999'
			}
		}, [
			h('div', {className: cls + 'line-container'}, [
				h('span', {
					className: cls + 'line',
					style: {
						backgroundColor: color.bg || '#555',
						color: color.fg || '#fff'
					}
				}, line.name || '?'),
			]),
			symbol,
			leg.direction ? h('span', {className: cls + 'direction'}, [
				' ', dirArrow, ' ', leg.direction
			]) : null,
			h('div', {
				className: cls + 'details'
			}, [
				h('abbr', {
					title: ms(duration, {long: true})
				}, [
					ms(duration) + ' ride'
				]),
				' · ',
				renderCycle(leg),
				' · ',
				nrOfPassed,
				transferPosition
			]),
			passed.length > 0 ? h('ul', {
				className: cls + 'details'
			}, passed) : null
		])
	}

	const renderPassed = (station, color) =>
		h('div', {
			className: cls + 'link ' + cls + 'passed',
			style: {borderBottomColor: color},
			'ev-click': () => actions.selectStation(station.id)
		}, station.name)

	const renderStation = (station) =>
		h('div', {
			className: cls + 'link',
			'ev-click': () => actions.selectStation(station.id)
		}, station.name)

	const renderStopover = (station, departure, delay) => {
		const els = [
			h('div', {
				className: cls + 'name'
			}, [renderStation(station)])
		]

		if ('number' === typeof delay) {
			els.push(h('div', {
				className: cls + 'delay'
			}, [
				formatDelay(delay)
			]))
		}
		departure = new Date(departure)
		if (!Number.isNaN(+departure)) {
			els.splice(1, 0, h('div', {
				className: cls + 'when'
			}, [
				renderTime(departure)
			]))
		}
		return h('li', {
			className: cls + 'stopover'
		}, els)
	}

	const renderJourney = (journey, detailsFor = []) => {
		if (!journey) return null

		const legs = []
		for (let i = 0; i < journey.legs.length; i++) {
			const leg = journey.legs[i]

			legs.push(
				renderStopover(leg.origin, leg.departure, leg.departureDelay),
				renderMode(leg, i, detailsFor.includes(i))
			)

			const nextLeg = journey.legs[i + 1]
			const renderDest = !nextLeg || ( // leg.dest !== nextLeg.origin ?
				leg.destination &&
				nextLeg.origin &&
				nextLeg.origin.id !== leg.destination.id
			)
			if (renderDest) {
				legs.push(renderStopover(leg.destination, leg.arrival, leg.arrivalDelay))
			}
		}

		return h('ul', {
			className: cls + 'journey'
		}, legs)
	}

	return renderJourney
}

module.exports = setup
