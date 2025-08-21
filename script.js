const listTasks = document.querySelector(".list-task");
const addTask = document.getElementById("addTask");
const inputTask = document.getElementById("inTask");

// to show notify if the add operation successfull or not
let notifyTimeoutId;
function notify(message) {
  const node = document.getElementById("alert");
  node.textContent = message;
  node.style.display = "block";
  clearTimeout(notifyTimeoutId);
  notifyTimeoutId = setTimeout(() => {
    node.style.display = "none";
  }, 4000);
}
function clearInputs() {
  inputTask.value = "";
}
function getInputs() {
  return { text: inputTask.value.trim(), completed: false };
}
// here i find that if we use an call back, that give me flixibility to can add or remove or set completed
function updateStorage(callBack) {
  const storedTask = localStorage.getItem("tasks");
  const parsedTask = JSON.parse(storedTask) || [];
  modifiedTask = callBack(parsedTask);
  const stringifyTask = JSON.stringify(modifiedTask);
  localStorage.setItem("tasks", stringifyTask);
}
function uploadStoreTask() {
  const storedTask = localStorage.getItem("tasks");
  const parsedTask = JSON.parse(storedTask) || [];
  const nodes = parsedTask.map((task) => {
    return creatTaskElement(task);
  });
  listTasks.append(...nodes);
}

// to creation the element based object
function creatTaskElement(element) {
  const task = document.createElement("li");
  task.classList.add("task");
  task.id = element.id;
  
  if (element.completed) task.classList.add("complete");

  const content = document.createElement("p");
  content.textContent = element.text;

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = element.completed;
  checkBox.dataset["id"] = element.id;

  const actionBtn = document.createElement("input");
  actionBtn.type = "button";
  actionBtn.value = "Delete";
  actionBtn.dataset["id"] = element.id;
  actionBtn.classList.add("remove");

  task.append(content, checkBox, actionBtn);

  return task;
}

// here buisness logic to add button action
addTask.addEventListener("click", function (event) {
  const task = { ...getInputs(), id: Math.random() };
  if (task.text == null || task.text == "") {
    alert("you should enter task first");
  } else {
    const element = creatTaskElement(task);
  
    listTasks.appendChild(element);
  
    clearInputs();
  
    notify(`Task name : ${element.text} was added successfully`);
  
    updateStorage(function addTask(parsedTask) {
      parsedTask.push(task);
      return parsedTask;
    });
  }
});

//Keyboard events (Enter key for adding)
inputTask.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    addTask.click();
  }
});

// here main logic to delete task and complete task
listTasks.addEventListener("click", function (event) {
  const actionElement = event.target;
  if (actionElement.type == "button" && actionElement.value == "Delete") {
    const id = actionElement.dataset.id;
    updateStorage(function removeTask(parsedTask) {
      return parsedTask.filter((item) => {
        return item.id !== Number(id);
      });
    });
    actionElement.parentElement.remove();
    notify(`Task name : ${element.text} was removed successfully`);
  } else if (actionElement.type == "checkbox") {
    const id = actionElement.dataset.id;
    // after some search i found the toggle function that help me to be more good
    actionElement.parentElement.classList.toggle("complete");
    updateStorage(function setCompleted(parsedTask) {
      return parsedTask.map((item) => {
        if (item.id === Number(id)) item.completed = actionElement.checked;
        return item;
      });
    });
    notify(`Task name : ${element.text} was Mark successfully`);
  }
});

document.addEventListener("DOMContentLoaded", (e) => {
  uploadStoreTask();
});


