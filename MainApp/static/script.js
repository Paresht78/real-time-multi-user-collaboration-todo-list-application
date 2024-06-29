document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.querySelector('button.btn-primary');
    const taskList = document.getElementById('taskList');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteSelectedButton = document.getElementById('deleteSelected');
    const filterSelect = document.getElementById('filterTasks');
    const taskInput = document.getElementById('exampleFormControlInput1');

    addButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    taskList.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-task')) {
            const listItem = event.target.closest('.list-group-item');
            editTask(listItem);
            saveTasksToLocalStorage();
        } else if (event.target.classList.contains('delete-task')) {
            const listItem = event.target.closest('.list-group-item');
            deleteTask(listItem);
            saveTasksToLocalStorage();
        } else if (event.target.classList.contains('form-check-input')) {
            const listItem = event.target.closest('.list-group-item');
            updateTaskStatus(listItem);
            saveTasksToLocalStorage();
        }
    });

    selectAllCheckbox.addEventListener('change', function () {
        const checkboxes = taskList.querySelectorAll('.form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        saveTasksToLocalStorage();
    });

    deleteSelectedButton.addEventListener('click', function () {
        const checkboxes = taskList.querySelectorAll('.form-check-input:checked');
        checkboxes.forEach(checkbox => {
            const listItem = checkbox.closest('.list-group-item');
            deleteTask(listItem);
        });
        saveTasksToLocalStorage();
    });

    filterSelect.addEventListener('change', function () {
        filterTasks(filterSelect.value);
    });

    function addTask() {
        const inputValue = taskInput.value.trim();
        if (inputValue !== '') {
            addTaskToList(inputValue, false, null); // Initially set as unchecked and no due date
            saveTasksToLocalStorage();
            taskInput.value = '';
        }
    }

    function filterTasks(filter) {
        const taskItems = taskList.querySelectorAll('.list-group-item');
        taskItems.forEach(item => {
            const checkbox = item.querySelector('.form-check-input');
            switch (filter) {
                case 'all':
                    item.style.display = '';
                    break;
                case 'completed':
                    item.style.display = checkbox.checked ? '' : 'none';
                    break;
                case 'active':
                    item.style.display = !checkbox.checked ? '' : 'none';
                    break;
                default:
                    item.style.display = '';
                    break;
            }
        });
    }

    function addTaskToList(taskText, isChecked, dueDate) {
        const checkedAttribute = isChecked ? 'checked' : '';
        const dueDateElement = dueDate ? `<p class="small mb-0 task-due-date"><i class="fas fa-calendar-alt me-2"></i>${dueDate}</p>` : '';
        const listItem = `
            <li class="list-group-item d-flex align-items-center border-0 bg-transparent">
                <div class="form-check">
                    <input class="form-check-input me-0" type="checkbox" value="" aria-label="..." ${checkedAttribute}>
                </div>
                <div class="px-3 py-1 flex-grow-1">
                    <p class="lead fw-normal mb-0">${taskText}</p>
                </div>
                <div class="ps-3 pe-0 py-1">
                    <div class="d-flex flex-row justify-content-end mb-1">
                        <a href="#!" class="text-info edit-task" data-mdb-tooltip-init title="Edit todo"><i class="fas fa-pencil-alt"></i></a>
                        <a href="#!" class="text-danger delete-task" data-mdb-tooltip-init title="Delete todo"><i class="fas fa-trash-alt"></i></a>
                    </div>
                    <div class="text-end text-muted">
                        ${dueDateElement}
                        <a href="#!" class="text-muted" data-mdb-tooltip-init title="Created date">
                            <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${getFormattedDate()}</p>
                        </a>
                    </div>
                </div>
            </li>
        `;
        taskList.insertAdjacentHTML('beforeend', listItem);
    }

    function editTask(listItem) {
        const taskTextElement = listItem.querySelector('.lead');
        const currentTaskText = taskTextElement.textContent.trim();
        const newTaskText = prompt('Edit Task:', currentTaskText);
        if (newTaskText !== null && newTaskText !== '') {
            taskTextElement.textContent = newTaskText;
        }
    }

    function deleteTask(listItem) {
        if (confirm('Are you sure you want to delete this task?')) {
            listItem.remove();
        }
    }

    function updateTaskStatus(listItem) {
        const checkbox = listItem.querySelector('.form-check-input');
        const isChecked = checkbox.checked;
        const taskTextElement = listItem.querySelector('.lead');
        if (isChecked) {
            taskTextElement.classList.add('text-decoration-line-through');
        } else {
            taskTextElement.classList.remove('text-decoration-line-through');
        }
    }

    function getFormattedDate() {
        return new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToList(task.text, task.checked, task.dueDate);
        });
    }

    function saveTasksToLocalStorage() {
        const taskItems = taskList.querySelectorAll('.list-group-item');
        const tasks = [];
        taskItems.forEach(item => {
            const taskTextElement = item.querySelector('.lead');
            const taskText = taskTextElement.textContent.trim();
            const checkbox = item.querySelector('.form-check-input');
            const isChecked = checkbox.checked;
            const dueDateElement = item.querySelector('.task-due-date');
            const dueDate = dueDateElement ? dueDateElement.textContent.trim() : null;
            tasks.push({ text: taskText, checked: isChecked, dueDate: dueDate });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasksFromLocalStorage();
});
