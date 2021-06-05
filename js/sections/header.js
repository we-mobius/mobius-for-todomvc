import { headerElement } from '../elements/header.js'
import { todosDriverScopeManager } from '../drivers/todos.js'
const {
  Data, Mutation, replayWithLatest,
  pipeAtom, binaryTweenPipeAtom,
  makeGeneralEventHandler
} = MobiusUtils
const { makeInstantComponent } = MobiusUI

const [addHandlerRD, , addTodoD] = makeGeneralEventHandler(title => ({ title }))

const { inputs: { add: addD } } = todosDriverScopeManager.scope('app')
binaryTweenPipeAtom(addTodoD, addD)

const titleRD = replayWithLatest(1, Data.of(''))
const resetInputM = Mutation.of(() => '')
pipeAtom(addTodoD, resetInputM, titleRD)

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
