# vbb-journey-ui

**[virtual-dom](https://github.com/Matt-Esch/virtual-dom) UI components for displaying a journey** like in Google Maps.

[![npm version](https://img.shields.io/npm/v/vbb-journey-ui.svg)](https://www.npmjs.com/package/vbb-journey-ui)
[![build status](https://img.shields.io/travis/derhuerst/vbb-journey-ui.svg)](https://travis-ci.org/derhuerst/vbb-journey-ui)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-journey-ui.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install vbb-journey-ui
```


## Usage

`renderJourney` returns a [virtual-dom](https://github.com/Matt-Esch/virtual-dom) tree, which you can put into the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) or convert to an HTML string.

```js
const vbb = require('vbb-client')
const renderJourney = require('vbb-journey-ui')
const toString = require('virtual-dom-stringify')

vbb.journeys('900000003201', '900000024101', {results: 1})
.then((journeys) => {
	const tree = renderJourney(journeys[0])
	console.log(toString(tree))
})
.catch(console.error)
```

## API

```
renderJourney(journey, [detailsFor], [actions])
```

The structure of `journey` must follow the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

`detailsFor` may be an array of `journey.parts` indices that additional info like passed stations shall be shown for.

`actions` may be an object with the following methods:

- `actions.hidePartDetails(i)`
- `actions.showPartDetails(i)`
- `actions.selectStation(id)`


## Contributing

If you have a question or have difficulties using `vbb-journey-ui`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-journey-ui/issues).
