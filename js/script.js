const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskDate = document.getElementById("taskDate");
const completedList = document.getElementById("completedList");
const darkModeBtn = document.getElementById("darkModeBtn");

let tasks = [];

function createTask(taskObj){
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = taskObj.text;
    const taskDateText = document.createElement("small");
    taskDateText.textContent = taskObj.date;

    const date = document.createElement("small");

    if (taskObj.completedDate) {
        date.textContent =
        new Date(taskObj.completedDate).toLocaleString("ja-JP");
    }

    // 初期状態
    checkbox.checked = taskObj.completed;
    span.classList.toggle("completed", taskObj.completed);

    checkbox.addEventListener("change", function () {

        taskObj.completed = checkbox.checked;
    
        // 完了日時
        if (checkbox.checked) {
            taskObj.completedDate = new Date();
    
            date.textContent =
              new Date(taskObj.completedDate).toLocaleString("ja-JP");
    
        } else {
            taskObj.completedDate = null;
    
            date.textContent = "";
        }
    
        span.classList.toggle("completed", checkbox.checked);
    
        localStorage.setItem("tasks", JSON.stringify(tasks));
    
        // 移動処理
        if (checkbox.checked) {
            completedList.appendChild(li);
        } else {
            taskList.appendChild(li);
        }
    
    });
    //editBtn
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="material-icons">edit</i>';

    editBtn.addEventListener("click", function () {

        const newTask = prompt("タスクを編集してください", taskObj.text);
    
        if (newTask !== null && newTask !== "") {
    
            taskObj.text = newTask;
    
            span.textContent = newTask;
    
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });

    //deletBtn
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="material-icons">delete</i>';

    deleteBtn.addEventListener("click", function () {
        li.remove();

        tasks = tasks.filter(t => t !== taskObj);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(date);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(taskDateText);
    li.classList.add("task-item");
    
    if (taskObj.completed) {
        completedList.appendChild(li);
    } else {
        taskList.appendChild(li);
    }

}

addBtn.addEventListener("click", function () {
    const task = taskInput.value;

    if (task === "") {
        alert("タスクを入力してください！");
        return;
    }

    const taskObj = {
        text: task,
        date: taskDate.value,
        completed: false,
        completedDate: null
    };

    createTask(taskObj);

    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
});

window.addEventListener("load", function () {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);

        tasks.forEach(function (taskObj) {
            createTask(taskObj);
        });
    }

    const savedMode = localStorage.getItem("darkMode");

    if (savedMode === "on") {

        document.body.classList.add("dark-mode");

        darkModeBtn.classList.remove("fa-moon");
        darkModeBtn.classList.add("fa-sun");

    }
});

taskInput.addEventListener("keydown", function(e){
    if (e.key === "Enter") {
        e.preventDefault(); // ← これ追加
        addBtn.click();
    }
});
darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("darkMode", "on");

        // アイコン変更
        darkModeBtn.classList.remove("fa-moon");
        darkModeBtn.classList.add("fa-sun");

    } else {

        localStorage.setItem("darkMode", "off");

        // アイコン戻す
        darkModeBtn.classList.remove("fa-sun");
        darkModeBtn.classList.add("fa-moon");

    }

});