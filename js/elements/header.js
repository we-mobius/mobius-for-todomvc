const { makeElementMaker } = window.MobiusUI

const ENTER_KEY = 13

export const headerElement = makeElementMaker({
  marks: {},
  styles: {
    title: ''
  },
  actuations: {
    addHandler: e => { console.warn('addHandler is expected by headerElement') }
  },
  configs: {},
  handler: (view, { styles: { title }, actuations }) => {
    const { addHandler } = actuations

    const _addHandler = e => {
      if (e.keyCode === ENTER_KEY) {
        if (e.target.value.trim()) {
          addHandler(e.target.value.trim())
        }
        document.querySelector('input.new-todo').value = title
      }
    }

    return view`
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" @keydown=${_addHandler} autofocus .value=${title} >
      </header>
    `
  }
})
