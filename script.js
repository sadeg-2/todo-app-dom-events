const tasks = [
  {
    text: "Home Work 1",
    completed: true,
  },
  {
    text: "Home Work 2",
    completed: false,
  },
  {
    text: "Home Work 3",
    completed: false,
  },
  {
    text: "Home Work 4",
    completed: true,
  },
];

// to show notify if the add operation successfull or not
function notify(message) {
  const node = document.getElementById("alert");
  node.textContent = message;
  node.style.display = "block";
  setTimeout(() => {
    node.style.display = "none";
  }, 4000); // show every second
}

// to creation the element based object
function creatTaskElement(element) {
  const task = document.createElement("li");
  task.classList.add("task");
  if (element.completed) task.classList.add("complete");

  const content = document.createElement("p");
  content.textContent = element.text;
  task.appendChild(content);

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = element.completed;
  task.appendChild(checkBox);

  const actionBtn = document.createElement("input");
  actionBtn.type = "button";
  actionBtn.value = "Delete";
  actionBtn.classList.add("remove");
  task.appendChild(actionBtn);

  return task;
}

const listTasks = document.querySelector(".list-task");

// here to simulate dummy test
tasks.forEach(function (element) {
  const task = creatTaskElement(element);
  listTasks.appendChild(task);
});

const addTask = document.getElementById("addTask");
const inputTask = document.getElementById("inTask");

// here buisness logic to add button action
addTask.addEventListener("click", function (event) {
  const taskText = inputTask.value.trim();
  if (taskText == null || taskText == "") {
    alert("you should enter task first");
  } else {
    const element = { text: taskText, completed: false };
    tasks[tasks.length] = element;
    console.log(tasks);
    const task = creatTaskElement(element);
    listTasks.appendChild(task);
    inputTask.value = "";
    notify(`Task name : ${element.text} was added successfully`);
  }
});


