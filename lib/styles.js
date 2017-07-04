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
	color: #888;
}

.${prefix}.part {
	position: relative;
	margin-left: .5em;
	padding: .2em 0 .2em 1.4em;
	border-left: .4em solid #999;
	font-size: 90%;
}

.${prefix}.part .line-container {
	position: absolute;
	top: 50%;
	left: 0;
	margin-top: -.6em;
	margin-left: -1.2em;
	width: 2em;
	text-align: center;
}
.${prefix}.part .line {
	display: inline-block;
	padding: 0 .2em;
	line-height: 1.3;
	border-radius: .2em;
}

.${prefix}.part .product {
	display: inline-block;
	width: 1.1em;
	height: 1.1em;
	vertical-align: middle;
}

.${prefix}.part .details {
	padding: .2em 0;
	display: block;
	color: #777;
}
`)

module.exports = prefix
