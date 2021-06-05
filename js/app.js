/*global MobiusUI, MobiusUtils */

/**
 * 我们将整个 todo 应用分为三个部分，每一部分都可以视作一个小应用
 * 它们之间有业务联系，但在使用 Mobius 开发的情况下，三者在代码层面是完全没有耦合的
 * 亦即，去掉其中任何一部分，应用程序仍然可以合理地运行
 */

import { headerRD } from './sections/header.js'
import { mainRD } from './sections/main.js'
import { footerRD } from './sections/footer.js'

(function (window) {
	'use strict';

	const { render, makeInstantComponent } = window.MobiusUI

	// makeInstantComponent	是 MobiusUI 封装的一种创建没有复用需求的组件的方式
  // 一个组件实际上就是一个 Data，它的一般表现与 Observable 非常像
	// 当上游（header、main、footer）有值产生的时候，app 组件接收到上游的值，进行处理，然后传递给下游消费
	// 一般情况下，组件的值是 TemplateResult，可以理解为 lit-html 的 VDOM
  // 将它传递给 lit-html 的 render 函数，就能够渲染到页面上了
	const appRD = makeInstantComponent(
		[headerRD, mainRD, footerRD],
		([header, main, footer], template, mutation, contexts) => {
			return [header, main, footer]
		}
	)
	// 消费 app 组件的值，渲染到页面上，'.todoapp' 是页面中预置的渲染应用的容器
	appRD.subscribe(({ value: template }) => {
		render(template, document.querySelector('.todoapp'))
	})

	// 以上代码作用是：
	//   - 将应用的三个部分（header、main、footer）汇总起来的，统一渲染到目标容器中；
	//   - 当每个部分有更新的时候，会触发重新渲染，渲染机制基本由 lit-html 控制；

	// 简单的写法是：
	// combineLatestT(headerRD, mainRD, footerRD).pipe(replayWithLatest(1)).subscribe(({ value }) => {
	// 	render(value, document.querySelector('.todoapp'))
	// })

	// 也可以分开渲染，需要稍微改造一下目前页面中的容器结构：
	// headerRD.subscribe(({ value }) => {
	// 	render(value, document.querySelector('.todoapp .header'))
	// })
	// mainRD.subscribe(({ value }) => {
	// 	render(value, document.querySelector('.todoapp .main'))
	// })
	// footerRD.subscribe(({ value }) => {
	// 	render(value, document.querySelector('.todoapp .footer'))
	// })

	// 其它写法：……

})(window);
