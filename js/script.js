import {
    db,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    auth,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    query,
    where
} from "./firebase.js";

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskDate = document.getElementById("taskDate");
const completedList = document.getElementById("completedList");
const darkModeBtn = document.getElementById("darkModeBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

let tasks = [];

function createTask(taskObj) {

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

    checkbox.checked = taskObj.completed;

    span.classList.toggle("completed", taskObj.completed);

    // 完了チェック
    checkbox.addEventListener("change", function () {

        taskObj.completed = checkbox.checked;

        if (checkbox.checked) {

            taskObj.completedDate = new Date();

            date.textContent =
                new Date(taskObj.completedDate).toLocaleString("ja-JP");

            completedList.appendChild(li);

        } else {

            taskObj.completedDate = null;

            date.textContent = "";

            taskList.appendChild(li);

        }

        span.classList.toggle("completed", checkbox.checked);

    });

    // 編集
    const editBtn = document.createElement("button");

    editBtn.innerHTML = '<i class="material-icons">edit</i>';

    editBtn.addEventListener("click", async function () {

        const newTask = prompt("タスクを編集してください", taskObj.text);

        if (newTask !== null && newTask !== "") {

            taskObj.text = newTask;

            span.textContent = newTask;

            await updateDoc(doc(db, "tasks", taskObj.id), {
                text: newTask
            });

        }

    });

    // 削除
    const deleteBtn = document.createElement("button");

    deleteBtn.innerHTML = '<i class="material-icons">delete</i>';

    deleteBtn.addEventListener("click", async function () {

        try {

            await deleteDoc(doc(db, "tasks", taskObj.id));

            li.remove();

            tasks = tasks.filter(t => t.id !== taskObj.id);

        } catch (error) {

            console.log(error);

        }

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

// タスク追加
addBtn.addEventListener("click", async function () {

    if (!auth.currentUser) {
        alert("ログインしてください");
        return;
    }

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

    try {

        const docRef = await addDoc(collection(db, "tasks"), {
            text: taskObj.text,
            completed: taskObj.completed,
            date: taskObj.date,
            uid: auth.currentUser.uid
        });

        taskObj.id = docRef.id;

        tasks.push(taskObj);

        createTask(taskObj);

        taskInput.value = "";

    } catch (error) {

        console.log(error);

    }

});

// Enterキー
taskInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        addBtn.click();

    }

});

// DarkMode
darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("darkMode", "on");

        darkModeBtn.classList.remove("fa-moon");
        darkModeBtn.classList.add("fa-sun");

    } else {

        localStorage.setItem("darkMode", "off");

        darkModeBtn.classList.remove("fa-sun");
        darkModeBtn.classList.add("fa-moon");

    }

});

// Login
loginBtn.addEventListener("click", async function () {

    try {

        const result = await signInWithPopup(auth, provider);

        console.log(result.user);

        alert("ログイン成功");

    } catch (error) {

        console.log(error);

    }

});

// Logout
logoutBtn.addEventListener("click", async function () {

    await signOut(auth);

    alert("ログアウトしました");

});

// ログイン状態監視
onAuthStateChanged(auth, async function (user) {

    taskList.innerHTML = "";
    completedList.innerHTML = "";

    tasks = [];

    if (user) {

        userName.textContent = user.displayName;

        const q = query(
            collection(db, "tasks"),
            where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docItem) => {

            const taskObj = {
                id: docItem.id,
                ...docItem.data()
            };

            tasks.push(taskObj);

            createTask(taskObj);

        });

    } else {

        userName.textContent = "";

    }

});