const todoList = document.querySelector('.todo-list');
const todoItems = [];
const count = document.querySelector('.count');
let id = 0;

// Handling of storing and retrieving stored items
localStorage.setItem('todoItems', localStorage.getItem('todoItems') || []);

function renderStoredItems() {
	const storedItems = localStorage.getItem('todoItems');
	if (storedItems.length < 1) return;
	const parsedStoredItems = JSON.parse(storedItems);
	id = parsedStoredItems.length;

	parsedStoredItems.forEach((storedItem, i) => {
		createTodo(i, storedItem.name, storedItem.active, storedItem.done);
		todoItems.push({
			id: i,
			name: storedItem.name,
			active: storedItem.active,
			done: storedItem.done,
		});
		count.innerHTML = todoItems.length;
	});
}

renderStoredItems();

function updateStoredItems() {
	localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// Add Todo
function addTodo(event) {
	const input = document.querySelector('.todo-input');

	event.preventDefault();
	const todoText = input.value;
	if (todoText.length > 0) {
		createTodo(id, todoText, false);
		newItem = {
			id: id,
			name: todoText,
			active: false,
			done: false,
		};
		todoItems.push(newItem);
		input.value = '';
		id++;
	}

	count.innerHTML = todoItems.length;

	updateStoredItems();
}

//Create Todo
function createTodo(id, data, active) {
	const todo = `
    <li id=${id} class="todo draggable" draggable="true">
      <input type="checkbox" class="check-input"
        onchange="controlTodo('change-status', event)" 
      />
      <p class="todo-text" onclick="controlTodo('toggle-done', event)">${data}</p>
      <button class="delete" onclick="controlTodo('delete', event)">
        <img class="del" src="./images/icon-cross.svg" alt="" />
      </button>
    </li>
  `;

	const position = 'afterbegin';

	todoList.insertAdjacentHTML(position, todo);
}

// Toggle todo `active` status
function changeTodoStatus(element, item) {
	item.active = element.checked;
}

// Toggle todo `done` status
function toggleTodoDone(element, item) {
	if (item.active) {
		element.classList.toggle('completed');
		item.done = !item.done;
		element.previousElementSibling.checked = false;
		changeTodoStatus(element.previousElementSibling, item);
	}
}

// Delete todo
function deleteTodo(element, item) {
	element.classList.add('fall');

	removeItemFromList(item);

	count.innerHTML = todoItems.length;
	element.addEventListener('transitionend', () => {
		element.remove();
	});
}

// Control Task Element
function controlTodo(action, event) {
	// The todo whose `id` matches the event target's
	// is the active one
	const item = todoItems.filter(
		(item) => item.id === parseInt(event.target.parentElement.id)
	)[0];

	switch (action) {
		case 'change-status':
			changeTodoStatus(event.target, item);
			break;
		case 'toggle-done':
			toggleTodoDone(event.target, item);
			break;
		case 'delete':
			deleteTodo(event.target.parentElement, item);
			break;
		default:
			break;
	}

	updateStoredItems();
}

function filterTodos(action) {
	switch (action) {
		case 'show-all':
			filterShowAll();
			break;
		case 'show-active':
			itemsToHide = todoItems.filter((item) => !item.active || item.done);
			itemsToShow = todoItems.filter((item) => itemsToHide.indexOf(item) < 0);
			setActiveFilter(itemsToHide, itemsToShow, 'active-tasks');
			break;
		case 'show-done':
			itemsToHide = todoItems.filter((item) => !item.done);
			itemsToShow = todoItems.filter((item) => itemsToHide.indexOf(item) < 0);
			setActiveFilter(itemsToHide, itemsToShow, 'done-tasks');
			break;
	}
}

// Toggle active filter status
function setActiveFilter(itemsToHide, itemsToShow, action) {
	toggleHiddenState(itemsToHide, true);
	toggleHiddenState(itemsToShow, false);

	markActiveFilterOption(action);
}

function markActiveFilterOption(activeFilter) {
	document.querySelector('.todo-control .active').classList.remove('active');
	document
		.querySelector(`.todo-control .${activeFilter}`)
		.classList.add('active');
}

function toggleHiddenState(todoItems, shouldElementHide) {
	todoItems.forEach((item) => {
		const todoElement = document.getElementById(item.id);
		shouldElementHide
			? todoElement.classList.add('hide')
			: todoElement.classList.remove('hide');
	});
}

function filterShowAll() {
	const hiddenItems = document.querySelectorAll('.hide');
	hiddenItems.forEach((item) => {
		item.classList.remove('hide');
	});

	markActiveFilterOption('all-tasks');
}

// Clear todos marked as `done`
async function clearDone() {
	const doneItems = todoItems.filter((item) => item.done);

	for (const [i, item] of doneItems.entries()) {
		await asyncDeleteTodo(item, i);
	}

	updateStoredItems();
}

function asyncDeleteTodo(item, i) {
	return new Promise((resolve) =>
		setTimeout(() => {
			const doneItem = document.getElementById(item.id);
			deleteTodo(doneItem, item);
			resolve();
		}, 100 + 20 * i)
	);
}

const removeItemFromList = (item) => {
	todoItems.splice(todoItems.indexOf(item), 1);
};
