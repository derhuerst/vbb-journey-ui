'use strict'

const h = require('virtual-dom/h')
const colors = require('vbb-util/lines/colors')
const products = require('vbb-util/products')
const ms = require('ms')

const cls = 'vbb-journey-ui-'

const pedestrians = [
	'🚶🏻‍♀️', '🚶🏼‍♀️', '🚶🏽‍♀️', '🚶🏾‍♀️', '🚶🏿‍♀️',
	'🚶🏻‍♂️', '🚶🏼‍♂️', '🚶🏽‍♂️', '🚶🏾‍♂️', '🚶🏿‍♂️'
]

const setup = (formatTime, formatDelay, actions = {}) => {
	// todo: NOVE_ENV === 'dev'
	if ('function' !== typeof formatTime) {
		throw new Error('formatTime must be a function.')
	}
	if ('function' !== typeof formatDelay) {
		throw new Error('formatDelay must be a function.')
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
			leg.direction ? ' → ' + leg.direction : '',
			h('div', {
				className: cls + 'details'
			}, [
				h('abbr', {title: ms(duration, {long: true})}, [ms(duration)]),
				', ',
				nrOfPassed,
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

		departure = +new Date(departure)
		if ('number' === typeof delay) {
			departure -= delay * 1000
			els.push(h('div', {
				className: cls + 'delay'
			}, [
				formatDelay(delay)
			]))
		}
		if (departure) {
			els.splice(1, 0, h('div', {
				className: cls + 'when'
			}, [
				formatTime(new Date(departure))
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
