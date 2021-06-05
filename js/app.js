/*global MobiusUI, MobiusUtils */

import { headerRD } from './sections/header.js'
import { mainRD } from './sections/main.js'
import { footerRD } from './sections/footer.js'

(function (window) {
	'use strict';

	const { render, makeInstantComponent } = window.MobiusUI

	const appRD = makeInstantComponent(
		[headerRD, mainRD, footerRD],
		([header, main, footer], template, mutation, contexts) => {
			return [header, main, footer]
		}
	)

	appRD.subscribe(({ value: template }) => {
		render(template, document.querySelector('.todoapp'))
	})

})(window);
