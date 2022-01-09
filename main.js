let getJSON = function (url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open("get", url, true);

    xhr.responseType = "json";

    xhr.onload = () => {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };

    xhr.send();
  });
};

let delJSON = function (url, id) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);

    xhr.onload = function () {
      let status = xhr.status;
      if (xhr.readyState === 4) {
        resolve(xhr.responseText);
      } else {
        reject(status);
      }
    };

    xhr.send(JSON.stringify({ id }));
  });
};

let saveJSON = function (url, data) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.responseType = "json";

    xhr.onload = () => {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject("Error!", status);
      }
    };

    xhr.send(JSON.stringify(data));
  });
};

///////////////////////////////////////////
const input = document.querySelector(".todo-input");
const main = document.querySelector(".main");
const list = document.querySelector(".todo-list");

class TodoList {
  constructor() {}

  async addTodos() {
    try {
      let add = await saveJSON("http://localhost:3000/todos/", {
        task: input.value,
        complited: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getJSONData() {
    try {
      let data = await getJSON("http://localhost:3000/todos");
      return data
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async changeStatus() {
    let id = await saveJSON("http://localhost:3000/todos")
    return id
  }

  status() {
    this.changeStatus()
      .then(data => console.log(data))
  }

  async removeTodos() {
    try {
      let del = await delJSON("http://localhost:3000/todos", 3);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    let result = ''
    this.getJSONData()
      .then(data => {
        for (const item of data) {
          if(!item) {
            return
          } else {
            result += 
            `<li data-id="${item.id}" class="todo-item">
                ${item.task}
              <button class="completed-button"> &#9745; </button>
              <button class="trash-button"> &#10006; </button> 
            </li>`
          }
        } 
        list.innerHTML = result
    }).catch(error => error)
  }
}

let a = new TodoList();


list.addEventListener("click", (e) => {
  let target = e.target;
  let getId = target.parentElement.dataset.id;
  if (target.className === "completed-button") {
    console.log(getId)
    target.parentElement.classList.toggle("green");
  } else if (target.className === "trash-button") {
    
  }
});

main.addEventListener("click", (e) => {
  e.preventDefault();
  let target = e.target;
  if (target.className === "todo-button") {
    a.addTodos()
    input.value = "";
  } else if (target.className === "search-button") {
    a.removeTodos();
  }
});
a.render();