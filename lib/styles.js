'use strict'

const insert = require('insert-styles')

const prefix = 'vbb-journey-ui'

insert(`
.${prefix}.journey {
	margin: 0;
	padding-left: .2em;
	text-align: left;
	list-style: none;
	line-height: 1.4;
	color: #444;
}

.${prefix}.link {
	padding: 0 .25em;
	display: inline-block;
	line-height: 1.4;
	background-color: transparent;
	border-radius: .2em;
	cursor: pointer;
}
$.{prefix} .link:hover {
	background-color: rgba(52, 152, 219, .4);
}

.${prefix}.stopover {
	padding: .2em 0;
	margin-left: .2em;
}

.${prefix}.stopover::before {
	margin-right: .3em;
	display: inline-block;
	width: 1em;
	text-align: center;
	content: '◉';
	font-family: monospace;
	line-height: inherit;
	color: #666;
}

.${prefix}.leg {
	position: relative;
	margin-left: .5em;
	padding: .2em 0 .2em 1.4em;
	border-left: .4em solid #999;
	font-size: 90%;
}
.${prefix}.leg.walking {
	border-left-style: dotted;
}

.${prefix}.leg .line-container {
	position: absolute;
	top: .3em;
	left: 0;
	margin-left: -1.2em;
	width: 2em;
	text-align: center;
	z-index: 1;
}
.${prefix}.leg .line {
	display: inline-block;
	padding: 0 .2em;
	line-height: 1.3;
	border-radius: .2em;
	background-color: #999;
	color: #fff;
}

.${prefix}.leg .product {
	display: inline-block;
	width: 1.1em;
	height: 1.1em;
	vertical-align: middle;
}

.${prefix}.leg .details {
	padding: .2em 0;
	display: block;
	color: #777;
}
.${prefix}.leg .details:first-child {
	padding-top: 0;
}
.${prefix}.leg .details:last-child {
	padding-bottom: 0;
}

.${prefix}.leg .details .passed {
	position: relative;
	border-bottom-color: #999;
}
.${prefix}.leg .details .passed::before {
	content: '';
	position: absolute;
	display: block;
	top: 50%;
	left: -1.8em;
	margin-top: -.15em;
	width: .7em;
	height: 0;
	border-bottom-width: .3em;
	border-bottom-style: solid;
	border-bottom-color: inherit;
}
`)

module.exports = prefix
