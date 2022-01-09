
class Task {
    constructor(value, status) {
      this.value = value;
      this.status = status;
      this.id = Math.random().toString(36).substr(2, 9);
    }
  }
  
  // const input = document.querySelector(".todo-input");
  
  class TodoList {
    constructor(el) {
      this.todos = [];
      this.findItems = [];
      this.el = el;
  
      this.el.addEventListener("click", (e) => {
        let target = e.target;
        let getId = target.parentElement.dataset.id;
        if (target.className === "completed-button") {
          this.changeStatus(getId);
          target.parentElement.classList.toggle("green");
        } else if (target.className === "trash-button") {
          this.removeTodo(getId);
          target.parentElement.remove();
        }
      });
    }
    addTodo(todo) {
      this.todos.push(todo);
    }
    removeTodo(id) {
      this.todos = this.todos.filter((el) => {
        return el.id !== id;
      });
    }
    getTodos() {
      return this.todos;
    }
    changeStatus(id) {
      let index = this.todos.findIndex((el) => el.id === id);
      this.todos[index].status = !this.todos[index].status;
    }
  
    findTask() {
      let tasks = this.getTodos();
      tasks.filter((tasks) => {
        if (tasks.value.includes(input.value)) {
          this.findItems.push(tasks);
        }
      });
    }
  
    render(boolen) {
      let list = "";
  
      if (boolen) {
        for (let el of this.todos) {
          if (!el) {
            return;
          } else {
            list += `<li data-id="${el.id}" class="todo-item">${el.value}
                <button class="completed-button"> &#9745; </button>
                <button class="trash-button"> &#10006; </button> 
                </li>`;
          }
        }
      } else if (!boolen) {
        for (let el of this.findItems) {
          if (!el) {
            return;
          } else {
            list += `<li data-id="${el.id}" class="todo-item">${el.value}
                <button class="completed-button"> &#9745; </button>
                <button class="trash-button"> &#10006; </button> 
                </li>`;
          }
        }
      }
      this.el.innerHTML = list;
    }
  }
 
  
  
  let createTodo = new TodoList(list);
  
  main.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;
    if (target.className === "todo-button") {
      createTodo.addTodo(new Task(input.value, false));
      createTodo.render(true);
      input.value = "";
    } else if (target.className === "search-button") {
      createTodo.findTask();
      createTodo.render(false);
    }
  });