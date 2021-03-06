'use strict'

const h = require('virtual-dom/virtual-hyperscript/svg')

const CAR = 'm.15.15v10.7h25.7v-10.7zm1.7 1.85.15-.15h4l.15.15v7l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6.15-.15h4l.15.15v7l-.15.15h-4l-.15-.15v-7z'
const FIRST_CAR = 'm57.15 0.15v10.7h31.67l-1.945-10.7zm1.7 1.85.15-.15h4l.15.15v7l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v4l-.15.15h-4l-.15-.15zm6 0 .15-.15h4l.15.15v7l-.15.15h-4l-.15-.15zm6.65-.15h2l.15.15v4l-.15.15h-2l-.15-.15v-4z'

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
		transform: 'translate(3, 0)',
		'xlink:href': '#car'
	}),
	h('use', {
		transform: 'translate(30, 0)',
		'xlink:href': '#car'
	}),
	h('path', {
		fill: '#f0d722',
		stroke: '#000',
		'stroke-width': '.3',
		d: FIRST_CAR
	}),
	h('path', {
		fill: '#000',
		d: 'm91.5 1.5h2v5h-2z'
	}),
	h('circle', {
		cx: '92.5',
		cy: '3',
		fill: '#ff3939',
		r: '1.2'
	})
]

const renderTransferPosition = (pos) => {
	return h('svg', {
		viewBox: '0 0 90 19',
		width: '180',
		height: '38',
		preserveAspectRatio: 'xMinYMax meet',
		xmlns: 'http://www.w3.org/2000/svg',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink'
	}, [
		h('title', {}, [
			`For the smoothest transfer, try to enter the train at a position of ${pos}. 1 is the driver's end, 0 is the rear end.`
		]),
		...items,
		h('path', {
			d: 'm-2 6 2-6 2 6z',
			transform: `translate(${3 + pos * 90}, 13)`
		})
	])
}

module.exports = renderTransferPosition
