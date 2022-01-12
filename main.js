let requestURL = "http://localhost:3000/todos";

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

let changeJSON = function (url, data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      let status = xhr.status;
      if (xhr.readyState === 4) {
        resolve(xhr.responseText);
      } else {
        reject(status);
      }
    };

    xhr.send(JSON.stringify(data));
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
      let add = await saveJSON(requestURL, {
        task: input.value,
        complited: false,
      });
    } catch (error) {
      console.log(error);
    }

    this.render();
  }

  async getJSONData() {
    try {
      let data = await getJSON(requestURL);
      return data;
    } catch (error) {
      console.log(new Error(error));
    }
  }

  status(id) {
    this.getJSONData()
      .then((data) => {
        for (let item of data) {
          if (item.id == id) {
            item.complited = !item.complited;
            changeJSON(`${requestURL}/${id}`, {
              task: item.task,
              complited: item.complited,
            });
          }
        }
      })
      .catch((error) => error);

      this.render()
  }
  
  render() {
    let result = "";
    this.getJSONData()
      .then((data) => {
        for (const item of data) {
          if (!item) {
            return;
          } else {
            result += `<li data-id="${item.id}" class="todo-item ${
              item.complited ? "green" : "yellow"
            }">
                ${item.task}
              <button class="completed-button"> &#9745; </button>
              <button class="trash-button"> &#10006; </button> 
            </li>`;
          }
        }
        list.innerHTML = result;
      })
      .catch((error) => error);
  }
}

let todo = new TodoList();
todo.render();

list.addEventListener("click", (e) => {
  let target = e.target;
  let getId = target.parentElement.dataset.id;
  if (target.className === "completed-button") {
    todo.status(getId);
  }
});

main.addEventListener("click", (e) => {
  e.preventDefault();
  let target = e.target;
  if (target.className === "todo-button") {
    todo.addTodos();
    input.value = "";
  }
});
