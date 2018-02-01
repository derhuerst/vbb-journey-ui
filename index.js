'use strict'

const h = require('virtual-dom/h')
const colors = require('vbb-util/lines/colors')
const products = require('vbb-util/products')
const ms = require('ms')

const cls = 'vbb-journey-ui-'

const setup = (actions = {}) => {
	const renderMode = (leg, i, details) => {
		if (leg.mode === 'walking') {
			const t = new Date(leg.arrival) - new Date(leg.departure)
			const s = Number.isNaN(t) ? '🚶 walk' : '🚶 walk for ' + ms(t)
			// todo: distance
			return h('li', {
				className: cls + 'leg ' + cls + 'walking',
				style: {borderLeftColor: '#999'}
			}, [
				h('div', {
					className: cls + 'details'
				}, s)
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
				ms(new Date(leg.arrival) - new Date(leg.departure)),
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

	const renderStopover = (station) =>
		h('li', {
			className: cls + 'stopover'
		}, [
			renderStation(station)
		])

	const renderJourney = (journey, detailsFor = []) => {
		if (!journey) return null

		const legs = []
		for (let i = 0; i < journey.legs.length; i++) {
			const leg = journey.legs[i]

			if (i === 0) legs.push(renderStopover(leg.origin, leg.departure))

			legs.push(
				renderMode(leg, i, detailsFor.includes(i)),
				renderStopover(leg.destination)
			)
		}

		return h('ul', {
			className: cls + 'journey'
		}, legs)
	}

	return renderJourney
}

module.exports = setup
