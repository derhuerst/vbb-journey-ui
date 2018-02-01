'use strict'

const h = require('virtual-dom/h')
const vbb = require('vbb-client')
const toString = require('virtual-dom-stringify')

const renderJourney = require('.')

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
