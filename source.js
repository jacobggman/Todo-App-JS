// possible things to do:
// no empty task name
// confetti when finish a task
// can change order
// optional due date to task (edit and when create)
// show the time left to finish the task, if have due date
// optional more info about the task (when create and edit)
// better titie change like trello (to tasks names and board name). Only show outline when click, make text clickable.
// mutiple tasks boards (go back button, and edit board name)
// are you sure prompt when delete task or board
// borads page (can view, delete, edit name). On each board it will have the number of task and finished tasks 
// ship it to the cloud (share the board to view or edit)
// clear all date button
// offline mode

const TOGGLE_BUTTON_COMPETE_TEXT = "✔";
const UNCOMPETE_CLASS = "todo-item";
const COMPETE_CLASS = "todo-item completed";

let tasks = {
};

window.onload = function() {
    var input = document.getElementById("task-text-input");

    input.addEventListener("keypress", onKeyPress);


    let loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks)
    {
        tasks = JSON.parse(loadedTasks);
    }

    const todoList = document.getElementById("todo-list");
    Object.keys(tasks).forEach(function(taskid,index) {
        const task = tasks[taskid]
        todoList.appendChild(createTaskElement(task.name, task.compete, taskid));
    });
};

function onKeyPress(event) {
    if (event.key === "Enter") {
        addTask();
    }
}

function addTask () {
    const taskTextInput = document.getElementById("task-text-input");
    const taskName = taskTextInput.value;
    if (taskName)
    {
        const taskid = self.crypto.randomUUID();

        tasks[taskid] = {"name": taskName, "compete": false};

        const todoList = document.getElementById("todo-list");
        todoList.appendChild(createTaskElement(taskName, false, taskid));

        taskTextInput.value = "";

        saveTasks();
    }
}


function createTaskElement(taskName, taskCompete, taskid) {
    // <li class="todo-item">
    const taskElement = document.createElement('li');
    taskElement.id = taskid;
    
    let className = UNCOMPETE_CLASS;
    if (taskCompete)
    {
        className = COMPETE_CLASS;
    }
    taskElement.setAttribute('class', className);

    // <button class="toggle-btn"></button>
    const toogleButton = document.createElement('button');
    toogleButton.setAttribute('class', "toggle-btn");
    toogleButton.onclick = () => toggleTask(taskid);
    if (taskCompete)
    {
        toogleButton.innerHTML = TOGGLE_BUTTON_COMPETE_TEXT;
    }

    taskElement.appendChild(toogleButton);

    // TODO: check if empty (edit when lose fucus)
    // <input type="text" class="todo-text-input" value="Buy groceries">
    const input = document.createElement('input');
    input.setAttribute('type', "text");
    input.setAttribute('class', "todo-text-input");
    input.value = taskName;
    input.addEventListener('input', e => editTask(taskid, e.target.value));
    

    taskElement.appendChild(input);

    // <button class="delete-btn">Delete</button>
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', "delete-btn");
    deleteButton.innerHTML = "Delete"
    deleteButton.onclick = () => deleteTask(taskid);

    taskElement.appendChild(deleteButton);

    return taskElement;
}

function toggleTask(taskid) {
    const task = tasks[taskid];
    task.compete = !task.compete;

    const taskElement = document.getElementById(taskid);

    if (task.compete)
    {
        taskElement.setAttribute('class', COMPETE_CLASS);
        const toogleButton = taskElement.children[0];
        toogleButton.innerHTML = TOGGLE_BUTTON_COMPETE_TEXT;
    }
    else
    {
        taskElement.setAttribute('class', UNCOMPETE_CLASS);
        const toogleButton = taskElement.children[0];
        toogleButton.innerHTML = "";
    }

    saveTasks();
}

function deleteTask(taskid) {
    const taskElement = document.getElementById(taskid);
    taskElement.remove();

    delete tasks[taskid];

    saveTasks();
}

function editTask(taskid, newTaskName) {
    const task = tasks[taskid];
    const taskElement = document.getElementById(taskid);
    const input = taskElement.children[1];
    
    input.value = newTaskName;

    task.name = newTaskName;

    saveTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
