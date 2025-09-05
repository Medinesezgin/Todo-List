const todoInput= document.getElementById("todoInput");
const todoList= document.getElementById("todoList");

const savedTodosJSON = localStorage.getItem("todos");
const savedTodos = savedTodosJSON ? JSON.parse(savedTodosJSON) : [];

const todoDeadlineInput = document.getElementById("todoDeadline");


let currentFilter = "all";


for(const todo of savedTodos){
    addTodoToList(todo);
}
updateTaskCount();

console.log(Date.now());


//yeni bir görev eklemek için fonksiyon.
function addTodo(){
    const todoText= todoInput.value.trim();
    const todoDeadline = todoDeadlineInput.value; // tarih al

    if(todoText=== ""){
        alert("Lütfen bir değer girin!...")
        return;
    } 

    const todo = {
        id: Date.now().toString(),
        text: todoText,
        completed: false,
        deadline: todoDeadline || null // eğer boşsa null
    };
    savedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    addTodoToList(todo);
    todoInput.value="";
    todoDeadlineInput.value = "";
    renderTodos();
    updateTaskCount();

};

// görevi tamamlandı durumunu değiştirmek için fonksiyon
function toggleComplete(id){
    const todo = savedTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed; //true= false, false=true yap;
    
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    const todoElement= document.getElementById(id);
    todoElement.classList.toggle("completed", todo.completed);

    
    updateTaskCount();


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

        if (index > -1) savedTodos.splice(index, 1);
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

    // Tarih varsa ekle (span ile)
    let deadlineHTML = "";
    if (todo.deadline) {
        deadlineHTML = `<span class="deadline"> (Son tarih: ${todo.deadline})</span>`;
    }

        li.innerHTML = `
       <span title="${todo.text}">${todo.text}</span>
       ${deadlineHTML}
       <button class="ok" onclick="toggleComplete('${todo.id}')"><i class="fa-solid fa-check"></i></button>
       <button class="edit" onclick="editTodo('${todo.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
       <button class="remove" onclick="removeTodo('${todo.id}')"><i class="fa-solid fa-trash-can"></i></button>
    `;

        li.classList.toggle("completed", todo.completed);

    // tarih geçmişse kırmızı olsun
    if (todo.deadline) {
        const now = new Date();
        const deadlineDate = new Date(todo.deadline);
        if (now >= deadlineDate) {
            li.classList.add("expired"); 
        }
    }

    
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

    const onay = confirm("Tamamlanmış görevleri silmek istediğinize emin misiniz?");
    if (!onay) return;  // İptal edilirse fonksiyondan çık
    
    const activeTodos= savedTodos.filter((todo)=> !todo.completed);

    localStorage.setItem("todos", JSON.stringify(activeTodos));


    savedTodos.length = 0;
    savedTodos.push(...activeTodos);
    localStorage.setItem("todos", JSON.stringify(savedTodos));

    updateTaskCount();

    renderTodos();
};

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

const listEl = document.getElementById("todoList");

new Sortable(listEl, {
  animation: 150,    
  onEnd: function () {

    // Sıralama sadece "Hepsi" filtresinde olsun aksi halde geri al ve uyar.
    if (currentFilter !== "all") {
      renderTodos(); 
      alert('Sıralama sadece "Hepsi" filtresinde yapılabilir.');
      return;
    }
    const orderIds = Array.from(listEl.children).map(li => li.id);
    savedTodos.sort((a, b) => orderIds.indexOf(a.id) - orderIds.indexOf(b.id));
    localStorage.setItem("todos", JSON.stringify(savedTodos));
  }
});