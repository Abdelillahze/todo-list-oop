class Task {
  constructor(value) {
    this.value = value;
    this.parent = document.querySelector(".tasks");
  }
  create(isFinished) {
    // creating elements
    let task = document.createElement("div");
    let p = document.createElement("p");
    let icons = document.createElement("div");
    let deleteImg = document.createElement("img");
    let editImg = document.createElement("img");

    // creating textNode
    let textNode = document.createTextNode(this.value);

    // manage src and classes
    task.classList.add("task");
    icons.classList.add("icons");
    deleteImg.src = "imgs/x.png";
    editImg.src = "imgs/quill.png";
    deleteImg.classList.add("deleteButton");
    editImg.classList.add("editButton");

    // if the task is finished or not
    if (isFinished) {
      p.classList.add("finish");
    } else {
      p.classList.remove("finish");
    }

    // append
    icons.append(editImg);
    icons.append(deleteImg);
    p.append(textNode);
    task.append(p);
    task.append(icons);
    this.parent.append(task);

    // add task as property
    this.task = task;
    this.p = p;
  }
  edit(newValue) {
    if (newValue == "") return;
    this.value = newValue;
    this.p.innerHTML = newValue;
  }
  delete() {
    this.task.remove();
  }
  finished(isFinished) {
    if (isFinished) this.p.classList.add("finish");
    else if (!isFinished) this.p.classList.remove("finish");
  }
}

class ToDoList {
  constructor() {
    this.tasksCount = 0;
    this.localStorage = JSON.parse(localStorage.getItem("tasks")) || [];
  }
  display() {
    // setting var
    let taskName = `task${this.tasksCount}`;
    this.inputValue = document.querySelector(".add");
    if (this.inputValue == "") return;

    // start display
    this[taskName] = new Task(this.inputValue.value);
    this[taskName].create();
    this[taskName].task.id = this.id;
    this[taskName].task.setAttribute("nameTask", taskName);
    this.inputValue.value = "";

    // increase counter
    this.tasksCount++;
  }
  addToLocalStorage() {
    this.id = generateID();
    this.inputValue = document.querySelector(".add");
    let obj = {
      value: this.inputValue.value,
      isFinished: false,
      id: this.id,
    };

    // add to local storage
    this.localStorage.push(obj);
    localStorage.setItem("tasks", JSON.stringify(this.localStorage));
  }
  displayLocalStorage() {
    for (let i = 0; i < this.localStorage.length; i++) {
      let taskName = `task${this.tasksCount}`;
      this[taskName] = new Task(this.localStorage[i].value);
      this[taskName].create(this.localStorage[i].isFinished);
      this[taskName].task.setAttribute("nameTask", taskName);
      this[taskName].task.id = this.localStorage[i].id;
      this.tasksCount++;
    }
  }
  removeFromLocalStorage(task) {
    for (let i = 0; i < this.localStorage.length; i++) {
      if (this.localStorage[i].id == task.id) {
        this.localStorage.splice(i, 1);
      }
    }
    localStorage.setItem("tasks", JSON.stringify(this.localStorage));
  }
  clearAll() {
    let tasksEls = document.querySelectorAll(".task");

    tasksEls.forEach((e) => e.remove());
    this.localStorage = [];
    localStorage.setItem("tasks", JSON.stringify(this.localStorage));
  }
  onlyActive() {
    let finished = document.querySelectorAll(".finish");
    finished.forEach((e) => (e.parentNode.style.display = "none"));
  }
  onlyFinished() {
    let tasksEls = document.querySelectorAll(".task");
    let finished = document.querySelectorAll(".finish");
    tasksEls.forEach((e) => (e.style.display = "none"));
    finished.forEach((e) => (e.parentNode.style.display = "flex"));
  }
}

// create ToDo
let toDo = new ToDoList();

// display to localStorage

toDo.displayLocalStorage();

// start the create funciton runner
let addBtn = document.querySelector(".addButton");
let input = document.querySelector(".add");
addBtn.addEventListener("click", () => {
  toDo.addToLocalStorage();
  toDo.display();
});

console.log();

input.addEventListener("keyup", (event) => {
  if (
    event.keyCode == 13 &&
    input.value.trim() != "" &&
    window.getComputedStyle(addBtn, null).display == "block"
  ) {
    addBtn.click();
  }
});

// function generate id

function generateID() {
  // var
  const numbers = "12345679".split("");
  let result = "";
  let localStorageValue = JSON.parse(localStorage.getItem("tasks")) || [];

  for (let i = 0; i < 9; i++) {
    let randomNumber = Math.floor(Math.random() * (numbers.length - 1));
    result += numbers[randomNumber];
  }

  for (let i = 0; i < localStorageValue.length; i++) {
    if (result == localStorageValue[i].id) {
      result = generateID();
    }
  }

  return result;
}

// start the delete function runner

function removeEl(arr) {
  for (let element of arr) {
    element.onclick = () => {
      toDo[element.parentNode.parentNode.getAttribute("nameTask")].delete();
      toDo.removeFromLocalStorage(element.parentNode.parentNode);
    };
  }
}

// start the edit function runner

function editEl(arr, eV) {
  // selectors
  let addButton = document.querySelector(".addButton");
  let editButton = document.querySelector(".editButtonTop");

  // loop
  for (let element of arr) {
    element.onclick = () => {
      // display value
      eV.value =
        toDo[element.parentNode.parentNode.getAttribute("nameTask")].value;

      // styling
      addButton.style.display = "none";
      editButton.style.display = "block";

      // edit Value
      editButton.onclick = () => {
        toDo[element.parentNode.parentNode.getAttribute("nameTask")].edit(
          eV.value
        );

        // empty the input
        eV.value = "";

        // styling
        addButton.style.display = "block";
        editButton.style.display = "none";
      };

      input.addEventListener("keyup", (event) => {
        if (
          event.keyCode == 13 &&
          input.value.trim() != "" &&
          window.getComputedStyle(editButton, null).display == "block"
        ) {
          editButton.click();
        }
      });
    };
  }
}

// start the finished function runner

function finished(arr) {
  for (let element of arr) {
    element.onclick = () => {
      let localStorageValue = JSON.parse(localStorage.getItem("tasks")) || [];

      // condition
      if (!element.classList.contains("finish")) {
        toDo[element.parentNode.getAttribute("nameTask")].finished(true);
        check = false;

        // change in localStorage
        for (let i = 0; i < localStorageValue.length; i++) {
          if (element.parentNode.id == localStorageValue[i].id) {
            localStorageValue[i].isFinished = true;
          }
        }
        localStorage.setItem("tasks", JSON.stringify(localStorageValue));
      } else {
        toDo[element.parentNode.getAttribute("nameTask")].finished(false);
        check = true;

        // change in localStorage
        for (let i = 0; i < localStorageValue.length; i++) {
          if (element.parentNode.id == localStorageValue[i].id) {
            localStorageValue[i].isFinished = false;
          }
        }
        localStorage.setItem("tasks", JSON.stringify(localStorageValue));
      }
    };
  }
}

// intervel to use functions

setInterval(() => {
  // selectors
  let deleteBtns = document.querySelectorAll(".deleteButton");
  let editBtns = document.querySelectorAll(".editButton");
  let ps = document.querySelectorAll(".tasks p");
  let inputValue = document.querySelector(".add");

  // functions
  removeEl(deleteBtns);
  editEl(editBtns, inputValue);
  finished(ps);
});

// done

let done = document.querySelector(".done");
let donePer = document.querySelector(".completion-percentage");

setInterval(() => {
  //time
  let date = new Date();
  let dateEl = document.querySelector(".date");
  let timeEl = document.querySelector(".time span");

  dateEl.innerHTML = `${date.toString().slice(4, 10)}, ${date
    .toString()
    .slice(11, 15)}`;

  timeEl.innerHTML = `${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  // length
  let lengthEl = document.querySelector(".length");
  lengthEl.innerHTML = toDo.tasksCount;

  // done
  let tasksEls = document.querySelectorAll(".task").length;
  let finished = document.querySelectorAll(".finish").length;
  let result = (finished * 100) / tasksEls;

  if (isNaN(result)) {
    result = 0;
  }

  done.style.width = `${result}%`;
  donePer.innerHTML = `${result.toFixed(2)}% done`;
});

// box

let li = document.querySelectorAll(".box ul li");

li[0].addEventListener("click", () => {
  toDo.clearAll();
});

li[1].addEventListener("click", () => {
  toDo.onlyActive();
});

li[2].addEventListener("click", () => {
  toDo.onlyFinished();
});
