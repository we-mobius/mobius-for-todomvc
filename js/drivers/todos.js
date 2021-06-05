const {
  Data, Mutation,
  replayWithLatest, pipeAtom,
  createGeneralDriver, useGeneralDriver,
  makeScopeManager
} = window.MobiusUtils

const deepClone = tar => JSON.parse(JSON.stringify(tar))
const DEFAULT_TODO = { title: '', isCompleted: false, isEditing: false }
const EXAMPLE_TODOS = [
  {
    title: 'Taste JavaScript',
    id: 1998,
    isCompleted: true,
    isEditing: false
  },
  {
    title: 'Buy Unicorn',
    id: 624,
    isCompleted: false,
    isEditing: false
  }
]

export const todosDriver = createGeneralDriver({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {

    // todos: [{ title: string, isCompleted: boolean, isEditing: boolean }]
    const todosRD = replayWithLatest(1, Data.of(EXAMPLE_TODOS))

    // add todo item
    const addD = Data.empty()
    const addM = Mutation.ofLiftBoth((add, todos) => {
      const _ = deepClone(todos)
      _.unshift({ ...DEFAULT_TODO, ...add, id: Date.now() })
      return _
    })
    pipeAtom(addD, addM, todosRD)

    // remove todo item
    const removeD = Data.empty()
    const removeM = Mutation.ofLiftBoth((targetIndex, todos) => {
      const _ = deepClone(todos)
      _.splice(targetIndex, 1)
      return _
    })
    pipeAtom(removeD, removeM, todosRD)

    // toggle todo's complete status
    const toggleCompleteD = Data.empty()
    const toggleCompleteM = Mutation.ofLiftBoth((targetIndex, todos) => {
      const _ = deepClone(todos)
      _[targetIndex].isCompleted = !_[targetIndex].isCompleted
      return _
    })
    pipeAtom(toggleCompleteD, toggleCompleteM, todosRD)

    // toggle all todo's complete status
    const toggleAllD = Data.empty()
    const toggleAllM = Mutation.ofLiftBoth((status, todos) => {
      const _ = deepClone(todos)
      _.forEach(todo => {
        todo.isCompleted = status
      })
      return _
    })
    pipeAtom(toggleAllD, toggleAllM, todosRD)

    // toggle todo's editing status
    const toggleEditingD = Data.empty()
    const toggleEditingM = Mutation.ofLiftBoth((targetIndex, todos) => {
      const _ = deepClone(todos)
      _[targetIndex].isEditing = !_[targetIndex].isEditing
      return _
    })
    pipeAtom(toggleEditingD, toggleEditingM, todosRD)

    // modify todo's title
    const modificationD = Data.empty()
    const modifyM = Mutation.ofLiftBoth((modification, todos) => {
      const _  = deepClone(todos)
      const { index, title } = modification
      _[index].title = title
      return _
    })
    pipeAtom(modificationD, modifyM, todosRD)

    // clear completed todos
    const clearCompletedD = Data.empty()
    const clearCompletedM = Mutation.ofLiftBoth((e, todos) => todos.filter(todo => !todo.isCompleted))
    pipeAtom(clearCompletedD, clearCompletedM, todosRD)

    return {
      inputs: {
        add: addD,
        remove: removeD,
        toggleComplete: toggleCompleteD,
        toggleEditing: toggleEditingD,
        modify: modificationD,
        toggleAll: toggleAllD,
        clearCompleted: clearCompletedD
      },
      outputs: {
        todos: todosRD
      }
    }
  }
})

export const useTodosDriver = useGeneralDriver(todosDriver)

export const todosDriverScopeManager = makeScopeManager(todosDriver)
