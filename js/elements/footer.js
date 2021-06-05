const { makeElementMaker } = MobiusUI

const pluralize =  (word, count) => word + (count === 1 ? '' : 's')

export const footerElement = makeElementMaker({
  marks: {},
  styles: {
    isShow: false,
    remaining: 0,
    completed: 0
  },
  actuations: {
    clearCompletedHandler: e => { console.warn('clearCompletedHandler is expected by footerElement') }
  },
  configs: {},
  handler: (view, { styles: { isShow, remaining, completed } }) => {

    return view`
      <!-- This footer should be hidden by default and shown when there are todos -->
      <footer class="footer" style="display: ${isShow ? 'block' : 'none'};">
        <!-- This should be "0 items left" by default -->
        <span class="todo-count"><strong>${remaining}</strong> ${pluralize('item', remaining)} left</span>
        <!-- Remove this if you don't implement routing -->
        <ul class="filters" style="display: none;">
          <li>
            <a class="selected" href="#/">All</a>
          </li>
          <li>
            <a href="#/active">Active</a>
          </li>
          <li>
            <a href="#/completed">Completed</a>
          </li>
        </ul>
        <!-- Hidden if no completed items are left ↓ -->
        <button class="clear-completed" style="display: ${completed === 0 ? 'none' : 'block'};" @click=${'clearCompletedHandler'} >Clear completed</button>
      </footer>
    `
  }
})
