const listTasks = document.querySelector(".list-task");
const addTask = document.getElementById("addTask");
const inputTask = document.getElementById("inTask");

// i test if i can show notify if the add operation successfull or not
let notifyTimeoutId;

/**
 * @param  message
 * show an alert in the dom contain the message for 4 seconds
 */
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
  
  const parsedTask = getDataFromStore();

  modifiedTask = callBack(parsedTask);

  const stringifyTask = JSON.stringify(modifiedTask);
  localStorage.setItem("tasks", stringifyTask);
}

function getDataFromStore() {
  const storedTask = localStorage.getItem("tasks");
  let parsedTask = [];
  try {
    parsedTask = JSON.parse(storedTask) || [];
  } catch (error) {
    localStorage.setItem("tasks", JSON.stringify(parsedTask));
    notify(`Failed Get Data try reload the page`);
    return;
  }
  // here i found an small bug that if i change the local storage to numeric value in the browser make bug
  if (!parsedTask.length) {
    parsedTask = [];
    localStorage.setItem("tasks", JSON.stringify(parsedTask));
  }
  return parsedTask;
}

function uploadStoreTask() {
  const parsedTask = getDataFromStore();
  const nodes = parsedTask.map((task) => {
    return creatTaskElement(task);
  });
  listTasks.append(...nodes);
}
/**
 * @param {*} element represent the task content {id,text,completed}
 * @returns nodes ready to add in the dom represent the task as a list item
 */
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
/**
 * @param {*} actionElement => element that initiate the event that represent the checkbox
 * @returns if the operation completed successfully or not
 */
function markTask(actionElement) {
  let markedTask = null;
  const id = actionElement.dataset.id;
  try {
    updateStorage(function setCompleted(parsedTask) {
      return parsedTask.map((item) => {
        if (item.id === Number(id)) {
          item.completed = actionElement.checked;
          markedTask = item;
        }
        return item;
      });
    });
  } catch (error) {
    return false;
  }
  if (markedTask) {
    // after some search i found the toggle function that help me to be more good
    actionElement.parentElement.classList.toggle("complete");
  }
  return markedTask;
}
/**
 * 
 * @param {*} actionElement element that initiate the event that represent the delete button
 * @returns if the operation completed successfully or not
 */
function removeTask(actionElement) {
  const id = actionElement.dataset.id;
  let removedTask = null;
  try {
    updateStorage(function removeTask(parsedTask) {
      const result = parsedTask.filter((item) => {
        return item.id !== Number(id);
      });
      removedTask = parsedTask.find((item) => item.id === Number(id));
      return result;
    });
  } catch (error) {
    return false;
  }

  if (removedTask) actionElement.parentElement.remove();

  return removedTask;
}
/*
  Event Part in the code
*/
// here buisness logic to add button action
addTask.addEventListener("click", function (event) {
  const task = { ...getInputs(), id: Math.random() };
  if (task.text == null || task.text == "") {
    alert("you should enter task first");
  } else {
    const element = creatTaskElement(task);

    updateStorage(function addTask(parsedTask) {
      parsedTask.push(task);
      return parsedTask;
    });

    listTasks.appendChild(element);
    clearInputs();

    notify(`Task name : ${task.text} was added successfully`);
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
    const result = removeTask(actionElement);
    if (result) {
      notify(`Task name : ${result.text} was removed successfully`);
    } else {
      notify(`Removed operation Failed try again or reload the page`);
    }
  } else if (actionElement.type == "checkbox") {
    const result = markTask(actionElement);

    if (result) {
      notify(`Task name : ${result.text} was Mark successfully`);
    } else {
      notify(`Mark operation Failed try again or reload the page`);
    }
  }
});
// load locally Data
document.addEventListener("DOMContentLoaded", (e) => {
  uploadStoreTask();
});
