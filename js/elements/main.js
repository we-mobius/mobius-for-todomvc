const { makeElementMaker, repeat } = MobiusUI

const ENTER_KEY = 13
const ESC_KEY = 27

let disableBlurForOnce = false

export const mainElement = makeElementMaker({
  marks: {},
  styles: {
    isShow: false,
    todos: [
      // {
      //   title: string,
      //   isEditing: boolean,
      //   isCompleted: boolean
      // }
    ]
  },
  actuations: {
    toggleAllHandler: e => { console.warn('toggleAllHandler is expected by mainElement') },
    toggleCompleteHandler: e => { console.warn('toggleCompleteHandler is expected by mainElement') },
    toggleEditingHandler: e => { console.warn('toggleEditingHandler is expected by mainElement ') },
    modifyHandler: e => { console.warn('modifyHandler is expected by mainElement') },
    removeHandler: e => { console.warn('removeHandler is expected by mainElement ') }
  },
  configs: {},
  handler: (view, { styles, actuations }) => {
    const { isShow, todos } = styles
    const { toggleEditingHandler, modifyHandler, removeHandler } = actuations

    const getInputElementByEvent = e => document.querySelector(`input.edit[data-index="${e.target.dataset.index}"]`)
    // When editing mode is activated
    // it will hide the other controls and bring forward an input
    // that contains the todo title, which should be focused (.focus()).
    const _toggleEditingHandler = e => {
      toggleEditingHandler(e)

      const input = getInputElementByEvent(e)
      const todoIndex = e.target.dataset.index
      input.value = todos[todoIndex].title
      input.focus()
    }

    const discardModification = e => {
      toggleEditingHandler(e)
      const input = getInputElementByEvent(e)
      input.value = ''
    }
    // The edit should be saved on both blur and enter
    // and the editing class should be removed.
    const submitModification = e => {
      const todoIndex = e.target.dataset.index
      const trimedTitle = e.target.value.trim()
      if (trimedTitle) {
        modifyHandler({ index: todoIndex, title: trimedTitle })
        discardModification(e)
      } else {
        removeHandler(e)
      }
    }


    const blurHandler = e => {
      if (!disableBlurForOnce) {
        submitModification(e)
      }
      disableBlurForOnce = false
    }
    const keydownHandler = e => {
      if (e.keyCode === ENTER_KEY) {
        disableBlurForOnce = true
        submitModification(e)
      } else if (e.keyCode === ESC_KEY) {
        disableBlurForOnce = true
        discardModification(e)
      }
    }

    const items = repeat(todos, item => item.id, (todo, index) => {
      return view`
        <li class="${todo.isEditing ? 'editing' : ''} ${todo.isCompleted ? 'completed' : ''}">
          <div class="view">
            <input class="toggle" type="checkbox" .checked=${todo.isCompleted} @change=${'toggleCompleteHandler'} data-index=${index} >
            <label @dblclick=${_toggleEditingHandler} data-index=${index} >${todo.title}</label>
            <button class="destroy" @click=${'removeHandler'} data-index=${index} ></button>
          </div>
          <input class="edit" .value=${todo.title} @blur=${blurHandler} @keydown=${keydownHandler} data-index=${index} >
        </li>
      `
    })

    return view`
      <!-- This section should be hidden by default and shown when there are todos -->
      <section class="main" style="display: ${isShow ? 'block' : 'none'};">
        <input id="toggle-all" class="toggle-all" type="checkbox" @change=${'toggleAllHandler'} .checked=${todos.every(todo => todo.isCompleted)} >
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <!-- These are here just to show the structure of the list items -->
          <!-- List items should get the class "editing" when editing and "completed" when marked as completed -->
          ${items}
        </ul>
      </section>
    `
  }
})
