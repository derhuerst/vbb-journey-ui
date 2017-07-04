'use strict'

const h = require('virtual-dom/h')
const colors = require('vbb-util/lines/colors')
const products = require('vbb-util/products')
const ms = require('ms')

const prefix = require('./lib/styles')

const renderMode = (part, i, details, actions) => {
	if (part.mode === 'walking') {
		const t = new Date(part.arrival) - new Date(part.departure)
		const s = Number.isNaN(t) ? 'walk' : 'walk for ' + ms(t)
		// todo: distance
		return h('li', {
			className: prefix + ' part',
			style: {borderLeftColor: '#999'}
		}, [
			h('div', {
				className: prefix + ' details'
			}, s)
		])
	}
	return renderLine(part, i, details, actions)
}

const renderLine = (part, i, details, actions) => {
	const line = part.line
	let color = {}
	let symbol = null
	if (line.product) {
		symbol = h('img', {
			className: prefix + ' product',
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
		for (let stopover of part.passed.slice(1, -1)) {
			passed.push(h('li', {}, renderStation(stopover.station, actions)))
		}
	}

	const l = part.passed.length
	const label = (l - 1) + ' ' + (l === 2 ? 'station' : 'stations')

	const nrOfPassed = part.passed ? h('span', {
		className: prefix + ' link',
		'ev-click': details ? () => actions.hidePartDetails(i) : () => actions.showPartDetails(i)
	}, label) : null

	return h('li', {
		className: prefix + ' part',
		style: {
			borderLeftColor: color.bg || '#999'
		}
	}, [
		h('div', {className: prefix + ' line-container'}, [
			h('span', {
				className: prefix + ' line',
				style: {
					backgroundColor: color.bg || '#555',
					color: color.fg || '#fff'
				}
			}, line.name || '?'),
		]),
		symbol,
		part.direction ? ' → ' + part.direction : '',
		h('div', {
			className: prefix + ' details'
		}, [
			ms(new Date(part.arrival) - new Date(part.departure)),
			', ',
			nrOfPassed,
		]),
		h('div', {
			className: prefix + ' details'
		}, passed)
	])
}

const renderStation = (station, actions) =>
	h('div', {
		className: prefix + ' link',
		'ev-click': () => actions.selectStation(station.id)
	}, station.name)

const renderStopover = (station, actions) =>
	h('li', {
		className: prefix + ' stopover'
	}, [
		renderStation(station, actions)
	])

const renderJourney = (journey, detailsFor = [], actions = {}) => {
	if (!journey) return null

	const parts = []
	for (let i = 0; i < journey.parts.length; i++) {
		const part = journey.parts[i]

		if (i === 0) parts.push(renderStopover(part.origin, actions))

		parts.push(
			renderMode(part, i, detailsFor.includes(i), actions),
			renderStopover(part.destination, actions)
		)
	}

	return h('ul', {
		className: prefix + ' journey'
	}, parts)
}

module.exports = renderJourney
