const todoInput= document.getElementById("todoInput");
const todoList= document.getElementById("todoList");

const savedTodosJSON = localStorage.getItem("todos");
const savedTodos = savedTodosJSON ? JSON.parse(savedTodosJSON) : [];

let currentFilter = "all";


for(const todo of savedTodos){
    addTodoToList(todo);
}
updateTaskCount();

console.log(Date.now());
//yeni bir görev eklemek için fonksiyon.
function addTodo(){
    const todoText= todoInput.value.trim();
    if(todoText=== ""){
        alert("Lütfen bir değer girin!...")
        return;
    } 

    const todo = {
        id: Date.now().toString(),
        text: todoText,
        completed: false,
    };
    savedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    addTodoToList(todo);
    todoInput.value="";
renderTodos();
    
updateTaskCount();
}

// görevi tamamlandı durumunu değiştirmek için fonksiyon
function toggleComplete(id){
    const todo = savedTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed; //true= false, false=true yap;
    
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    const todoElement= document.getElementById(id);
    todoElement.classList.toggle("completed", todo.completed);

    todoElement.classList.toggle("completed", todo.completed);
    updateTaskCount();

    renderTodos();

}


//görevi düzenleme fonksiyonu
function editTodo(id){
    const todo = savedTodos.find((todo) => todo.id === id);
    const newText= prompt("Görevi düzenleyin: ", todo.text);
    if(newText !== null){
        todo.text = newText.trim();
        localStorage.setItem("todos", JSON.stringify(savedTodos));
        const todoElement= document.getElementById(id);
        todoElement.querySelector("span").textContent=newText;

    }
}



//görevi listeden kaldırma fonksiyonu
function removeTodo(id){
   const onay = confirm("Bu görevi silmek istediğinize emin misiniz?");
    if (!onay) return;  // İptal edilirse fonksiyondan çık

    const todoElement = document.getElementById(id);
    if (!todoElement) return;
    todoElement.style.animation='fadeOut 0.3s ease';

    setTimeout(() =>{
    savedTodos.splice(savedTodos.findIndex((todo) => todo.id === id), 1);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    todoElement.remove();
    updateTaskCount();
    renderTodos();
    }, 300);

    
}



//listeye ekleme fonksiyonu
function addTodoToList(todo) {

    const li = document.createElement("li");
    li.setAttribute("id", todo.id);
    li.innerHTML = `
       <span title="${todo.text}">${todo.text}</span>
       <button onclick="toggleComplete('${todo.id}')"><i class="fa-solid fa-check"></i></button>
       <button onclick="editTodo('${todo.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
       <button onclick="removeTodo('${todo.id}')"><i class="fa-solid fa-trash-can"></i></button>

    `;
    li.classList.toggle("completed", todo.completed);
    todoList.appendChild(li);
}

// enter tuşuna basıldığında addTodo çağır
todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }else if (event.key === "Escape") {
        todoInput.value = "";  // Esc inputu temizler
        todoInput.blur();      // odaktan çıkar
    }
});




function clearAll() {

    const onay = confirm("Bu görevi silmek istediğinize emin misiniz?");
    if (!onay) return;  // İptal edilirse fonksiyondan çık
    
    const activeTodos= savedTodos.filter((todo)=> !todo.completed);

    localStorage.setItem("todos", JSON.stringify(activeTodos));


    savedTodos.length = 0;
    savedTodos.push(...activeTodos);


    todoList.innerHTML = "";
    for (const todo of savedTodos){
        addTodoToList(todo);
    }

    updateTaskCount();

    renderTodos();
}


function updateTaskCount(){
    const activeCount= savedTodos.filter((todo)=> !todo.completed).length;
    document.getElementById("taskCount").textContent= `Aktif görev sayısı:  ${activeCount}`;

}
 

function setFilter(filter){
    currentFilter=filter;
    renderTodos();
}

function renderTodos(){
    todoList.innerHTML="";

    let filteredTodos =[];
    if(currentFilter==="all"){
        filteredTodos=savedTodos;

    }else if (currentFilter==="active"){
        filteredTodos=savedTodos.filter((todo)=> !todo.completed);
    }else if(currentFilter==="completed"){
        filteredTodos=savedTodos.filter((todo)=> todo.completed);
    }

    for (const todo of filteredTodos){
        addTodoToList(todo);
    }
    updateTaskCount();
  
}



