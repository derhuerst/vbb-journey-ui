'use strict'

const h = require('virtual-dom/h')

const CAR = 'm.15.15v10.7h25.7v-10.7zm1.7 1.85.15-.15h4l.15.15v7l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6.15-.15h4l.15.15v7l-.15.15h-4l-.15-.15v-7z'
const FIRST_CAR = 'm55.15 1.15v10.7h31.67l-1.945-10.7zm1.7 1.85.15-.15h4l.15.15v7l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v7l-.15.15h-4l-.15-.15zm6.65-.15h2l.15.15v4l-.15.15h-2l-.15-.15v-4z'

const items = [
	h('defs', {}, [
		h('path', {
			id: 'car',
			fill: '#f0d722',
			stroke: '#000',
			'stroke-width': '.3',
			d: CAR
		})
	]),
	h('use', {
		transform: 'translate(1, 1)',
		'xlink:href': '#car'
	}),
	h('use', {
		transform: 'translate(28, 1)',
		'xlink:href': '#car'
	}),
	h('path', {
		fill: '#f0d722',
		stroke: '#000',
		'stroke-width': '.3',
		d: FIRST_CAR
	}),
	h('path', {
		stroke: '#000',
		'stroke-width': '.3',
		d: 'm91 4v8'
	}),
	h('circle', {
		cx: '90.4',
		cy: '4',
		fill: '#ff3939',
		r: '.7'
	}),
	h('path', {
		stroke: '#000',
		'stroke-width': '.3',
		d: 'm90.5 3h.5v3h-.5z'
	})
]

const renderTransferPosition = (pos) => {
	return h('svg', {
		viewBox: '0 0 92 20',
		width: '138',
		height: '30',
		preserveAspectRatio: 'xMinYMax meet',
		xmlns: 'http://www.w3.org/2000/svg',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink'
	}, [
		h('title', {}, [
			`For the smoothest transfer, try to enter the train at a position of ${pos}. 1 is the driver's end, 0 is the rear end.`
		]),
		...items,
		h('path', {
			d: 'm-1.5 4 1.5-4 1.5 4z',
			transform: `translate(${pos * 92}, 15)`
		})
	])
}

module.exports = renderTransferPosition
