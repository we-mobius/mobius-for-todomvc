import { mainElement } from '../elements/main.js'
import { todosDriverScopeManager } from '../drivers/todos.js'

const {
  Data, replayWithLatest,
  binaryTweenPipeAtom,
  makeGeneralEventHandler
} = MobiusUtils
const { makeInstantComponent } = MobiusUI

const [toggleEditingHandlerRD, , toggleEditingD] = makeGeneralEventHandler(e => e.target.dataset.index)
const [removeHandlerRD, , removeD] = makeGeneralEventHandler(e => e.target.dataset.index)
const [toggleCompleteHandlerRD, , toggleCompleteD] = makeGeneralEventHandler(e => e.target.dataset.index)
const [toggleAllHandlerRD, , toggleAllD] = makeGeneralEventHandler(e => e.target.checked)
const [modifyHandlerRD, , modificationD] = makeGeneralEventHandler(modification => modification)

const { inputs: { remove, toggleComplete, toggleEditing, modify, toggleAll }, outputs: { todos: todosRD } } = todosDriverScopeManager.scope('app')

binaryTweenPipeAtom(removeD, remove)
binaryTweenPipeAtom(toggleCompleteD, toggleComplete)
binaryTweenPipeAtom(toggleEditingD, toggleEditing)
binaryTweenPipeAtom(modificationD, modify)
binaryTweenPipeAtom(toggleAllD, toggleAll)

export const mainRD = makeInstantComponent(
  [todosRD, toggleEditingHandlerRD, removeHandlerRD, toggleCompleteHandlerRD, toggleAllHandlerRD, modifyHandlerRD],
  ([todos, toggleEditingHandler, removeHandler, toggleCompleteHandler, toggleAllHandler, modifyHandler], template, mutation, contexts) => {
    return mainElement({
      styles: {
        isShow: todos.length !== 0,
        todos: todos
      },
      actuations: {
        toggleEditingHandler, removeHandler, toggleCompleteHandler, toggleAllHandler, modifyHandler
      }
    })
  }
)
