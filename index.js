const lists = [];
let selectedListId;

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup',event =>{
    event.preventDefault();
    console.log('here');
    showListAccordingToSearch();
})

function List(listName){
    this.id = 'a'+Date.now().toString();
    this.name = listName;
    this.tasks = [];
}

function Task(text){
    this.id = 'a'+Date.now().toString();
    this.text = text;
    this.marked = false;
}

function showListAccordingToSearch(){
    console.log('here1');
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("lists-list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("label")[0];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "flex";
        } else {
            li[i].style.display = "none";
        }
    }
}

function addToList(listName){
    const list = new List(listName);
    lists.push(list);
    showNewList(list)
    const nameElement = document.querySelector(`#${list.id}`);
    nameElement.addEventListener('click',event => {
        event.preventDefault();
        selectedListId = list.id
        if(event.target.className === 'del'){
            deleteList();
        }else{
            showTasksOfList();
        }
    })
}

function showNewList(list){
    const listsList = document.querySelector('#lists-list')
    const listElement = document.createElement('li');
    listElement.setAttribute('id',list.id);
    listElement.innerHTML = `
    <label>${list.name}</label>
    <button class="del">del</button>
    `
    listsList.appendChild(listElement);
}

function deleteList(){
    const index = lists.findIndex(list => list.id === selectedListId);
    lists.splice(index,1);
    const listsList = document.querySelector('#lists-list')
    const element = document.querySelector(`#${selectedListId}`);
    listsList.removeChild(element);
}

function showTasksOfList(){
    
    const selectedList = lists.find(list => list.id === selectedListId)
    
    const tasksList = document.querySelector('#tasks-list');
    tasksList.innerHTML = ''
    selectedList?.tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('id','l'+task.id);
        taskElement.innerHTML = `
        <div class="task-input-container">
        <input id="${task.id}" type="checkbox" ${task.marked ? 'checked':''}/>
        <label for="${task.id}" class=${task.marked ? "ticked":''}>${task.text}</label>
        <div>
        <button class="del">del</button>`
        tasksList.appendChild(taskElement);
        taskElement.addEventListener('click',event => {
            event.preventDefault();
            if(event.target.className === 'del'){
                deleteTask(task.id);
            }else{
                markDoneTask(task.id);
            }
        })
    })
    
}

function markDoneTask(taskId){
    const selectedListIndex = lists.findIndex(list => list.id === selectedListId)
    const index = lists[selectedListIndex].tasks.findIndex(task => task.id === taskId);
    lists[selectedListIndex].tasks[index].marked = !lists[selectedListIndex].tasks[index].marked;
    const marked = lists[selectedListIndex].tasks[index].marked
    const taskListElement = document.querySelector(`.task-input-container`);
    const taskInputElement = document.querySelector(`#${taskId}`);
    if(marked){
        taskListElement.setAttribute('class','task-input-container ticked');
        taskInputElement.setAttribute('checked',true);
    }else{
        taskListElement.setAttribute('class','task-input-container');
        taskInputElement.removeAttribute('checked');
    }
}

function deleteTask(taskId){
    const selectedListIndex = lists.findIndex(list => list.id === selectedListId)
    const newTasksList = lists[selectedListIndex].tasks.filter(task => task.id !== taskId);
    lists[selectedListIndex].tasks = newTasksList;
    const taskListElement = document.querySelector(`#l${taskId}`);
    const tasksList = document.querySelector('#tasks-list');
    tasksList.removeChild(taskListElement);
}

function addToTasks(taskName){

    const task = new Task(taskName);
    if(selectedListId){
        const listIndex = lists.findIndex(list => list.id === selectedListId)

        const list = lists[listIndex];
        const newTasks = [...list.tasks,task];
        const newList = {
            ...lists[listIndex],
            tasks: newTasks
        }

        lists[listIndex] = newList;

        const tasksList = document.querySelector('#tasks-list');
        const taskElement = document.createElement('li');
        taskElement.setAttribute('id','l'+task.id);
        taskElement.innerHTML = `
        <div class="task-input-container">
        <input id="${task.id}" type="checkbox" ${task.marked ? 'checked':''}/>
        <label for="${task.id}" class=${task.marked ? "ticked":''}>${task.text}</label>
        </div>
        <button class="del">del</button>`
        tasksList.appendChild(taskElement);
        taskElement.addEventListener('click',event => {
            event.preventDefault();
            if(event.target.className === 'del'){
                deleteTask(task.id);
            }else{
                markDoneTask(task.id);
            }
        })
    }
}

const listForm = document.querySelector('.list-input-form');
listForm.addEventListener('submit', event =>{
    event.preventDefault();
    const input = document.querySelector('#list-input');
    const listName = input.value;

    if(listName != ''){
        addToList(listName);
        input.value = '';
    }
})

const taskForm = document.querySelector('.task-input-form');
taskForm.addEventListener('submit', event =>{
    event.preventDefault();
    const input = document.querySelector('#task-input');
    const taskName = input.value;

    if(taskName != ''){
        addToTasks(taskName);
        input.value = '';
    }
})