'use strict';
const block = document.getElementById('block');
const inputForm = document.getElementById('input_form');
const addBtn = document.getElementById('btn_add');
const originalPlaceholder = inputForm.placeholder;
let pendingTasks = document.getElementById('sort_tasks');
let doneTask = document.querySelectorAll('.done');
let listContainer = document.getElementById('task_list');

let deleteTask, editTask, sortListAll, sortListPending, sortListDone;

function checkAndAddSelectedClass() {
  const listContainer = document.getElementById('task_list');
  let taskSortAll = document.getElementById('task_sort_all');

  if (listContainer.querySelectorAll('li').length > 0) {
    taskSortAll.classList.add('selected');
  } else {
    taskSortAll.classList.remove('selected');
  }
}
window.addEventListener('load', checkAndAddSelectedClass);

inputForm.addEventListener('click', function () {
  this.placeholder = '';
});

addBtn.addEventListener('click', addTask);

inputForm.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// !Function to add a task
function addTask() {
  if (inputForm.value === '') {
    alert('You must write something');
  } else {
    let li = document.createElement('li');
    li.innerHTML = inputForm.value;
    li.classList.add('pending');

    deleteTask = document.createElement('span');
    deleteTask.innerHTML = 'X';
    deleteTask.classList.add('delete-task');

    editTask = document.createElement('span');
    editTask.innerHTML = 'E';
    editTask.classList.add('edit-task');

    listContainer.appendChild(li);
    li.appendChild(editTask);
    li.appendChild(deleteTask);

    inputForm.value = '';
    document.getElementById('task_sort_all').classList.add('selected');
    saveData();
    checkAndAddSelectedClass();
  }
}

// Reset placeholder when the input loses focus
inputForm.addEventListener('blur', function () {
  inputForm.placeholder = originalPlaceholder;
});

function checkAndAddSelectedClass() {
  const listContainer = document.getElementById('task_list');
  const submitForm = document.getElementById('sumbit_form');
  const sortTasks = document.getElementById('sort_tasks');

  if (listContainer.querySelectorAll('li').length > 0) {
    sortTasks.classList.add('window_task');
    submitForm.classList.add('sub_form');
    sortTasks.style.display = 'flex';
    submitForm.style.paddingBottom = '30px';
  } else {
    sortTasks.classList.remove('window_task');
    submitForm.classList.remove('sub_form');
    sortTasks.style.display = 'none';
    submitForm.style.paddingBottom = '0px';
  }
}

//!EventListener Complete task
let toggleDone = listContainer.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    e.target.classList.toggle('done');
    e.target.classList.toggle('pending');

    let editTask = e.target.querySelector('.edit-task');
    if (e.target.classList.contains('done')) {
      editTask.style.backgroundColor = 'rgb(41, 138, 41)';
      editTask.style.color = 'black';
      listContainer.removeEventListener('click', toggleEditHandler);
    } else {
      editTask.style.backgroundColor = '';
      editTask.style.color = '';
      listContainer.addEventListener('click', toggleEditHandler);
    }
    saveData();
  }
});

//!EventListener Delete task
let removeItem = listContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-task')) {
    let liToRemove = e.target.closest('li');
    if (liToRemove) {
      liToRemove.remove();
      saveData();

      let taskSortAll = document.getElementById('task_sort_all');
      if (listContainer.querySelectorAll('li').length === 0) {
        taskSortAll.classList.remove('selected');
      }
    }
  }
});

//!EventListener Edit task
function toggleEditHandler(e) {
  if (e.target.classList.contains('edit-task')) {
    let liToEdit = e.target.closest('li');
    if (liToEdit) {
      e.target.textContent = 'S';
      let currentText = liToEdit.textContent;
      // Save existing "E" and "X" buttons
      let existingEditTask = liToEdit.querySelector('.edit-task');
      let existingDeleteTask = liToEdit.querySelector('.delete-task');

      // Create an input field
      let inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.value = currentText.slice(0, -2);
      inputField.classList.add('input-edit-task');

      // Clone "E" and "X" buttons
      let editTask = existingEditTask.cloneNode(true);
      let deleteTask = existingDeleteTask.cloneNode(true);

      //Replace the li's content with the input field and buttons
      liToEdit.innerHTML = '';
      liToEdit.appendChild(inputField);
      liToEdit.appendChild(editTask);
      liToEdit.appendChild(deleteTask);

      // Focus on the input field
      inputField.focus();

      // Add an event listener to handle editing when Enter is pressed
      inputField.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
          let newText = inputField.value;
          liToEdit.textContent = newText;

          // Restore existing "E" and "X" buttons to the edited li
          liToEdit.appendChild(existingEditTask);
          liToEdit.appendChild(existingDeleteTask);

          // Update the edit-task value to 'E'
          existingEditTask.textContent = 'E';

          saveData();
        } else if (e.key === 'Escape') {
          // Restore original text without saving changes
          liToEdit.textContent = currentText.slice(0, -2);

          // Restore existing "E" and "X" buttons to the edited li
          liToEdit.appendChild(existingEditTask);
          liToEdit.appendChild(existingDeleteTask);
          // Update the edit-task value to 'E'
          existingEditTask.textContent = 'E';

          saveData();
        }
      });

      // Add an event listener to handle editing when "E" is clicked
      editTask.addEventListener('click', function () {
        e.target.textContent = 'E';
        let newText = inputField.value;
        liToEdit.textContent = newText;

        // Restore existing "E" and "X" buttons to the edited li
        liToEdit.appendChild(existingEditTask);
        liToEdit.appendChild(existingDeleteTask);
      });
    }
  }
}
listContainer.addEventListener('click', toggleEditHandler);

//////////////////////! EventListener Sort Task List

////////////////////////////////////////////////////*SORT ALL
let sortAll = document.getElementById('task_sort_all');
sortAll.addEventListener('click', function () {
  let allItems = document.querySelectorAll('li');
  allItems.forEach(item => {
    item.style.display = 'flex';
  });
  saveData();
});

////////////////////////////////////////////////////*SORT PENDING
let sortPending = document.getElementById('task_sort_pending');

sortPending.addEventListener('click', function () {
  let pendingItems = document.querySelectorAll('.pending');

  pendingItems.forEach(item => {
    item.style.display = 'flex';
  });
  hideDoneTasks();
});

// Функция для прячущая все элементы с классом '.done'
function hideDoneTasks() {
  let doneTasks = document.querySelectorAll('.done');
  doneTasks.forEach(task => {
    task.style.display = 'none';
  });
}

////////////////////////////////////////////////////*SORT COMPLETED
let sortCompleted = document.getElementById('task_sort_completed');

sortCompleted.addEventListener('click', function () {
  // Получаем все элементы с классами '.done' и '.pending'
  let doneItems = document.querySelectorAll('.done');

  // Прячем все элементы с классом '.pending'
  hidePendingTasks();

  // Показываем только элементы с классом '.done'
  doneItems.forEach(item => {
    item.style.display = 'flex';
  });
});

// Функция для прячущая все элементы с классом '.pending'
function hidePendingTasks() {
  let pendingTasks = document.querySelectorAll('.pending');
  pendingTasks.forEach(task => {
    task.style.display = 'none';
  });
}

////////////////////////////////////////////////////*SORT CLEAR ALL
let sortClearAll = document.getElementById('task_sort_clear');

sortClearAll.addEventListener('click', function () {
  let allItemsClear = document.querySelectorAll('li');
  allItemsClear.forEach(item => {
    item.remove('li');
  });
  localStorage.clear();
  checkAndAddSelectedClass()
});

////////////////////////////////////////////////////*UnderLine
let sortSpans = document.querySelectorAll('#sort_tasks span');
sortSpans.forEach(span => {
  span.addEventListener('click', function () {
    sortSpans.forEach(s => {
      s.classList.remove('selected');
    });
    span.classList.add('selected');
  });
});

// !Function save data
function saveData() {
  localStorage.setItem('data', listContainer.innerHTML);
}

// !Function show data
function showTask() {
  listContainer.innerHTML = localStorage.getItem('data');
  let items = listContainer.querySelectorAll('li');
  items.forEach(item => {
    item.addEventListener('click', toggleDone);
    let deleteIcon = listContainer.querySelector('span');
    deleteIcon.addEventListener('click', removeItem);
  });
}

showTask();
