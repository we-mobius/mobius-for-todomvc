import { footerElement } from '../elements/footer.js'
import { todosDriverScopeManager } from '../drivers/todos.js'

const { makeInstantComponent } = window.MobiusUI
const {
  Data,
  replayWithLatest, binaryTweenPipeAtom,
  mapT,
  makeGeneralEventHandler
} = window.MobiusUtils

const { inputs: { clearCompleted }, outputs: { todos: todosRD } } = todosDriverScopeManager.scope('app')

const isShowRD = todosRD.pipe(mapT(todos => todos.length > 0), replayWithLatest(1))
const remainingRD = todosRD.pipe(mapT(todos => todos.filter(todo => !todo.isCompleted).length), replayWithLatest(1))
const completedRD = todosRD.pipe(mapT(todos => todos.filter(todo => todo.isCompleted).length), replayWithLatest(1))

const [clearCompletedHandlerRD, , clearCompletedD] = makeGeneralEventHandler(e => e)

binaryTweenPipeAtom(clearCompletedD, clearCompleted)

export const footerRD = makeInstantComponent(
  [isShowRD, remainingRD, completedRD, clearCompletedHandlerRD],
  ([isShow, remaining, completed, clearCompletedHandler], template, mutation, contexts) => {
    return footerElement({
      styles: {
        isShow, remaining, completed
      },
      actuations: {
        clearCompletedHandler
      }
    })
  }
)
