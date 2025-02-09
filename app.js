let lastId = 3;

let todos = [
  {
    id: 1,
    title: "밥먹기",
    isComplete: false,
  },
  {
    id: 2,
    title: "영화보기",
    isComplete: false,
  },
  {
    id: 3,
    title: "코딩하기",
    isComplete: true,
  },
];

const noTodoText = document.querySelector("main > .no-todo-text");
const todoInputWrapper = document.querySelector("main > .todo-input-wrapper");
const todoInput = todoInputWrapper.querySelector(".todo-input");
const todoInputBtn = todoInputWrapper.querySelector("button");
const todoUl = document.querySelector("main > .todo-ul");
const hideToggleCompleteTodosBtn = document.querySelector(
  "main > .special-btns-container > .hide-toggle-complete-todos-btn"
);
const deleteAllTodosBtn = document.querySelector(
  "main > .special-btns-container > .delete-all-todos-btn"
);

/**
 * li 태그 만들기
 * @returns querySelectorAll 로 잡아낸 li 태그들
 */
function makeLis() {
  const lis = todos
    .map((todo) => {
      if (todo.isComplete) {
        return `
        <li class="todo-${todo.id}">
          <input type="checkbox" checked />
          <p class="complete">${todo.title}</p>
          <button>X</button>
        </li>
      `;
      } else {
        return `
        <li class="todo-${todo.id}">
          <input type="checkbox" />
          <p>${todo.title}</p>
          <button>X</button>
        </li>
      `;
      }
    })
    .join("");
  todoUl.innerHTML = lis;
  return document.querySelectorAll("main > .todo-ul > li");
}

/**
 * 체크박스 갱신
 * @param {*} currentLis 현재 li 태그들
 */
function setCheckboxes(currentLis) {
  const inputs = [];
  // NodeList 는 map, filter 못 씀
  currentLis.forEach((li) => inputs.push(li.querySelector("input")));
  inputs.forEach((input) => {
    input.addEventListener("change", (evt) => {
      const targetId = Number(evt.target.parentNode.className.split("-")[1]);
      const targetTodo = todos.filter((todo) => todo.id === targetId)[0];
      if (targetTodo.isComplete === true) {
        targetTodo.isComplete = false;
      } else {
        targetTodo.isComplete = true;
      }
      renderTodos();
    });
  });
}

/**
 * 삭제버튼 갱신
 * @param {*} currentLis 현재 li 태그들
 */
function setDeleteBtns(currentLis) {
  const deleteBtns = [];
  currentLis.forEach((li) => deleteBtns.push(li.querySelector("button")));
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (evt) => {
      const targetId = Number(evt.target.parentNode.className.split("-")[1]);
      todos = todos.filter((todo) => todo.id !== targetId);
      renderTodos();
    });
  });
}

/**
 * 화면 갱신 함수
 */
function renderTodos() {
  if (todos.length) {
    noTodoText.style.display = "none";
    todoUl.style.display = "none";
    hideToggleCompleteTodosBtn.style.display = "none";
    deleteAllTodosBtn.style.display = "none";

    // li 태그 만들기
    const currentLis = makeLis();

    // 체크박스 갱신
    setCheckboxes(currentLis);

    // 삭제 버튼 갱신
    setDeleteBtns(currentLis);

    todoUl.style.display = "block";
    hideToggleCompleteTodosBtn.style.display = "inline-block";
    deleteAllTodosBtn.style.display = "inline-block";
  } else {
    todoUl.style.display = "none";
    hideToggleCompleteTodosBtn.style.display = "none";
    deleteAllTodosBtn.style.display = "none";
    noTodoText.style.display = "block";
  }

  console.log(lastId);
  console.log(todos);
}

/**
 * 할 일 추가
 * 인풋창에서 엔터 입력 또는 추가 버튼 클릭 시 동작
 * 만약 빈 값이 들어올경우 그대로 리턴
 */
function addTodo() {
  if (!todoInput.value || todoInput.value.trim() === "") {
    todoInput.value = "";
    return;
  }

  todos = [
    ...todos,
    {
      id: ++lastId,
      title: todoInput.value.trim(),
      isComplete: false,
    },
  ];

  // 인풋을 빈 값으로
  todoInput.value = "";

  renderTodos();
}

todoInput.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    addTodo();
  }
});

todoInputBtn.addEventListener("click", () => {
  addTodo();
});

deleteAllTodosBtn.addEventListener("click", () => {
  todos = [];
  renderTodos();
});

hideToggleCompleteTodosBtn.addEventListener("click", () => {
  const lis = todoUl.querySelectorAll("li");
  if (hideToggleCompleteTodosBtn.classList.contains("hide-mode")) {
    lis.forEach((li) => {
      const p = li.querySelector("p");
      if (p.classList.contains("complete")) {
        li.classList.add("hide");
      }
    });
    hideToggleCompleteTodosBtn.textContent = "완료된 할 일 보이기";
    hideToggleCompleteTodosBtn.classList.replace("hide-mode", "show-mode");
  } else if (hideToggleCompleteTodosBtn.classList.contains("show-mode")) {
    lis.forEach((li) => {
      if (li.classList.contains("hide")) {
        li.classList.remove("hide");
      }
    });
    hideToggleCompleteTodosBtn.textContent = "완료된 할 일 숨기기";
    hideToggleCompleteTodosBtn.classList.replace("show-mode", "hide-mode");
  }
});

// 최초 렌더링
renderTodos();
