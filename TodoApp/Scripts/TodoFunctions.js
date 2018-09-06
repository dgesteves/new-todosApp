'use strict';

// Fetch existing todos from localStorage
const getSavedTodos = () => {
    const todosJSON = localStorage.getItem('todos');

    try {
        return todosJSON ? JSON.parse(todosJSON) : [];
    } catch (e) {
        return [];
    }
};

// Save todos to localStorage
const saveTodos = todos => localStorage.setItem('todos', JSON.stringify(todos));

// Remove a todos from the list
const removeTodo = id => {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
    }
};

// Toggle the completed value for a todos
const toggleTodo = id => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed
    }
};

// Render application todos based on filters
const renderTodos = (todos, filters) => {
    const todoElement = document.querySelector('#todos');
    const filteredTodos = todos.filter(todo => {
        const searchTextMach = todo.text.toLowerCase().includes(filters.searchText.toLowerCase());
        const hideCompletedMatch = !filters.hideCompleted || !todo.completed;

        return searchTextMach && hideCompletedMatch
    });
    const todosLeft = filteredTodos.filter(todos => !todos.completed);

    todoElement.innerHTML = '';
    todoElement.appendChild(generateSummaryDOM(todosLeft));

    if (filteredTodos.length > 0) {
        filteredTodos.forEach(todo => {
            todoElement.appendChild(generateTodoDOM(todo));
        });
    } else {
        const messageElement = document.createElement('p');
        messageElement.classList.add('empty-message');
        messageElement.textContent = 'No todos to Show';
        todoElement.appendChild(messageElement)
    }
};

// Get the DOM elements for an individual note
const generateTodoDOM = todo => {
    const todoElement = document.createElement('label');
    const containerElement = document.createElement('div');
    const checkBox = document.createElement('input');
    const textElement = document.createElement('span');
    const button = document.createElement('button');

    // Setup the todos checkbox
    checkBox.setAttribute('type', 'checkbox');
    checkBox.checked = todo.completed;
    containerElement.appendChild(checkBox);
    checkBox.addEventListener('change', () => {
        toggleTodo(todo.id);
        saveTodos(todos);
        renderTodos(todos, filters);
    });

    // Setup the todos text
    textElement.textContent = todo.text;
    containerElement.appendChild(textElement);

    // Setup container
    todoElement.classList.add('list-item');
    containerElement.classList.add('list-item__container');
    todoElement.appendChild(containerElement);

    // Setup the remove todos button
    button.textContent = 'remove';
    button.classList.add('button', 'button--text');
    todoElement.appendChild(button);
    button.addEventListener('click', () => {
        removeTodo(todo.id);
        saveTodos(todos);
        renderTodos(todos, filters);
    });

    return todoElement
};

// Get the DOM elements for list summary
const generateSummaryDOM = todosLeft => {
    const summary = document.createElement('h2');
    const plural = todosLeft.length === 1 ? '' : 's';
    summary.classList.add('list-title');
    summary.textContent = `You have ${todosLeft.length} todo${plural} left`;

    return summary
};
