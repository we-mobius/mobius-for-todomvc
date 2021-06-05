// element 对应的是 ui = f(data) 的部分，data 是业务数据
//  -> 一个 element 可以是一个 TemplateResult，用于直接被渲染到页面上，
//     我们称之为“static element”（静态元素），常见网站的 About 页面就可以视作由多个 static element 组成
//  -> 也可以是一个函数，接受一组数据，返回相应的 TemplateResult，
//     我们称之为“dynamic element”（动态元素），粗略地说，涉及到填充动态数据的元素都属于动态元素
//  -> 此处 headerElement 是一个 dynamic element，它接受一组数据 props，
//     将它们应用到 TemplateResult，最终被渲染到页面上
import { headerElement } from '../elements/header.js'

// driver 即驱动，是对外暴露 inputs（输入端口）和 outputs（输出端口）的功能模块
// 驱动的想法很大程度上来自 CycleJS，人机交互中的“人”和“机”实际上可以视作两个驱动
//   -> “人”的输入是“机”呈现的视觉信息，“人”的输出是传递给“机”的操作指令
//   -> “机”的输入是“人”的操作指令，“机”的输出是呈现给“人”的视觉信息
//   -> 这个过程中涉及到的显示器、键鼠等设备，同样都是驱动
//   -> 驱动与驱动的输入和输出相连接，就构成了畅通的链路
//   -> 我们写的应用程序内部实际上也由驱动构成，这是 Mobius 的基本理念之一
// 这里我们创建了一个 todos 驱动：
//  -> 它内部维护了 todos 的状态，并暴露输入和输出接口
//  -> 输入和输出接口都是 Data
// scopeManager 是类似于 namespace 的概念
//  -> 驱动是可复用的，scopeManager 用于管理驱动实例，让它们互不冲突
import { todosDriverScopeManager } from '../drivers/todos.js'

// MobiusUtils 的接口几乎全部都是函数
// 这些东西实现了所谓「数据流动」
const {
  Data, Mutation, replayWithLatest,
  pipeAtom, binaryTweenPipeAtom,
  makeGeneralEventHandler
} = window.MobiusUtils

// MobiusUI 的接口也几乎全部都是函数
// MobiusUI 是基于 MobiusUtils「数据流动」理念创建的框架
// 包含元素复用、组件化等方案
const { makeInstantComponent } = window.MobiusUI

// 在 Mobius 里，element 中要绑定的事件函数也属于 data
// makeGeneralEventHandler 是一个帮助函数，它创建了两个 Data
//   -> addhandlerRD 是一个 Data，他的值是一个函数，
//      这个函数最终会作为事件处理函数被绑定在元素上，即 `click="addHandler"`
//   -> addTodoD 是一个 Data，它的值是 todo 的 title
//      addHandler 每次被触发，addTodoD 都会流出一个值
// 通过这种方式，用户对计算机的操作转换成了可以被消费的业务数据
const [addHandlerRD, , addTodoD] = makeGeneralEventHandler(title => ({ title }))

// 从 scopeManager 中获取“app 域”的 todosDriver，如果还不存在的化，scopeManager 会创建它，然后返回
// 同时解构出 todosDriver 中的输入接口
// add 是 创建一条 todo 的接口，它是一个 Data
const { inputs: { add: addD } } = todosDriverScopeManager.scope('app')
// binaryTweenPipeAtom 将用户的操作输出的数据对接到 todosDriver 的输入接口
// 两个 Data 可以直接连接吗？当然不可以
//   -> Data Mutation 的连接方式可以是：Mutation.observe(Data) | Data.beObservedBy(Mutation)
//   -> pipeAtom 是一个帮助函数，接受一连串的 Data 和 Mutation，从左到右将它们连接起来
//   -> pipeAtom(Data, Mutation, Data, Mutation, Data)
// 但很多时候，我们需要将两个 Data 相连，它们之间需要一个 asIs Mutation
//   -> 即 pipeAtom(Data, Mutation.of(d => d), Data)，这样做太麻烦了
//   -> binaryTweenPipeAtom（补间连接）可以避免这种麻烦
//   -> 它会根据相邻 Atom （Data 和 Mutation 都是 Atom）的类型
//   -> 创建相应的中间 Atom，然后进行连接
binaryTweenPipeAtom(addTodoD, addD)

// title 是 input 的值，初始为空
const titleRD = replayWithLatest(1, Data.of(''))
// 在 todo 添加成功之后，input 应该被重置为空
// 即 title 应该变成 ""
const resetInputM = Mutation.of(() => '')
// 下面这个连接的意思是：
//   -> 当 addTodoD 输出值的时候，意味着有一条 todo 要被创建了
//   -> 此时 input 应该被重置，这是一个变化，即 resetInputM 会运行
//   -> 重置的结果是 title 变成 ""，即 resetInputM 的结果要输出到 Data of title
pipeAtom(addTodoD, resetInputM, titleRD)

// 我们在 app.js 中已经见过 makeInstantComponent 了
//   -> 它收集一些业务数据
//   -> 然后把他们填充在 element 中
//   -> 然后会被 appRD 消费，与应用程序的其它部分（main、footer）组织在一起
//   -> 最终渲染到页面上
export const headerRD = makeInstantComponent(
  [titleRD, addHandlerRD],
  ([title, addHandler], template, mutation, contexts) => {
    return headerElement({
      styles: {
        title
      },
      actuations: {
        addHandler
      }
    })
  }
)
