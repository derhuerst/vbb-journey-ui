'use strict'

const {DateTime} = require('luxon')
const ms = require('ms')
const h = require('virtual-dom/h')
const toString = require('virtual-dom-stringify')

const createRenderJourney = require('.')

const formatTime = (when) => {
	return DateTime.fromJSDate(when, {
		zone: 'Europe/Berlin',
		locale: 'de-DE'
	}).toLocaleString(DateTime.TIME_SIMPLE)
}

const formatDelay = (delay) => {
	if (delay === 0) return null
	if (delay < 0) return '-' + ms(-delay * 1000)
	return '+' + ms(delay * 1000)
}

const renderJourney = createRenderJourney(formatTime, formatDelay, {})

const css = `\
body {
	margin: 1rem;
	font-size: 100%;
	font-family: sans-serif;
	background-color: #fff;
}`

const range = (l) => {
	const arr = new Array(l)
	for (let i = 0; i < l; i++) arr.push(i)
	return arr
}

const renderPage = (body) => {
	return h('html', {}, [
		h('head', {}, [
			h('style', {}, css),
			h('link', {href: 'styles.css', rel: 'stylesheet'}, [])
		]),
		h('body', {}, [body])
	])
}

vbb.journeys('900000100001', '900000100013', {results: 1, passedStations: true})
.then(([journey]) => {
	const page = renderPage(renderJourney(journey, range(journey.legs.length)))
	console.log('<!DOCTYPE html>\n' + toString(page))
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
