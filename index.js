'use strict'

const h = require('virtual-dom/h')
const colors = require('vbb-util/lines/colors')
const products = require('vbb-util/products')
const ms = require('ms')

const prefix = require('./lib/styles')

const renderMode = (leg, i, details, actions) => {
	if (leg.mode === 'walking') {
		const t = new Date(leg.arrival) - new Date(leg.departure)
		const s = Number.isNaN(t) ? '🚶 walk' : '🚶 walk for ' + ms(t)
		// todo: distance
		return h('li', {
			className: prefix + ' leg walking',
			style: {borderLeftColor: '#999'}
		}, [
			h('div', {
				className: prefix + ' details'
			}, s)
		])
	}
	return renderLine(leg, i, details, actions)
}

const renderLine = (leg, i, details, actions) => {
	const line = leg.line
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
		for (let stopover of leg.passed.slice(1, -1)) {
			passed.push(h('li', {}, renderPassed(stopover.station, actions, color.bg)))
		}
	}

	const l = leg.passed.length
	const label = (l - 1) + ' ' + (l === 2 ? 'stop' : 'stops')

	const nrOfPassed = leg.passed ? h('span', {
		className: prefix + ' link',
		'ev-click': details ? () => actions.hideLegDetails(i) : () => actions.showLegDetails(i)
	}, label) : null

	return h('li', {
		className: prefix + ' leg',
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
		leg.direction ? ' → ' + leg.direction : '',
		h('div', {
			className: prefix + ' details'
		}, [
			ms(new Date(leg.arrival) - new Date(leg.departure)),
			', ',
			nrOfPassed,
		]),
		passed.length > 0 ? h('div', {
			className: prefix + ' details'
		}, passed) : null
	])
}

const renderPassed = (station, actions, color) =>
	h('div', {
		className: prefix + ' link passed',
		style: {borderBottomColor: color},
		'ev-click': () => actions.selectStation(station.id)
	}, station.name)

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

	const legs = []
	for (let i = 0; i < journey.legs.length; i++) {
		const leg = journey.legs[i]

		if (i === 0) legs.push(renderStopover(leg.origin, actions))

		legs.push(
			renderMode(leg, i, detailsFor.includes(i), actions),
			renderStopover(leg.destination, actions)
		)
	}

	return h('ul', {
		className: prefix + ' journey'
	}, legs)
}

module.exports = renderJourney
