'use strict'

const vbb = require('vbb-client')
const toString = require('virtual-dom-stringify')

const renderJourney = require('.')

vbb.journeys('900000003201', '900000024101', {results: 1, passedStations: true})
.then((journeys) => {
	const tree = renderJourney(journeys[0])
	console.log(toString(tree))
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
