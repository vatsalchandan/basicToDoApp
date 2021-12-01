function Task(text){
    this.id = 'a'+Date.now().toString();
    this.text = text;
    this.marked = false;
}

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

function renderTask(tasksList, task){
    const taskElement = document.createElement('li');
    taskElement.setAttribute('id','l'+task.id);
    taskElement.innerHTML = `
    <div class="task-input-container">
    <input id="${task.id}" type="checkbox" ${task.marked ? 'checked':''}/>
    <label for="${task.id}" contenteditable="true" class=${task.marked ? "ticked":''}>${task.text}</label>
    </div>
    <button class="material-icons del">delete_forever</button>`
    tasksList.appendChild(taskElement);
    const taskCheckbox = taskElement.getElementsByTagName('input')[0];
    const labelElement = taskElement.getElementsByTagName('label')[0];
    const deleteButton = taskElement.getElementsByClassName('material-icons del')[0];
    taskElement.addEventListener('click',event =>{
        if(event.target === taskCheckbox){
            markDoneTask(task.id);
        }else if(event.target === deleteButton){
            deleteTask(task.id);
        }else{
            event.preventDefault();
            return false;
        }
    })
    labelElement.addEventListener('focusout',event=>{
        event.preventDefault();
        updateLabelOfTask(task.id,labelElement.innerText)
    })
}

function showTasksOfList(){
    
    const selectedList = lists.find(list => list.id === selectedListId)
    
    const tasksList = document.querySelector('#tasks-list');
    tasksList.innerHTML = ''
    selectedList?.tasks.forEach(task => {
        renderTask(tasksList,task);
    })
    
}

function markDoneTask(taskId){
    const selectedListIndex = lists.findIndex(list => list.id === selectedListId)
    const index = lists[selectedListIndex].tasks.findIndex(task => task.id === taskId);
    lists[selectedListIndex].tasks[index].marked = !lists[selectedListIndex].tasks[index].marked;
    const marked = lists[selectedListIndex].tasks[index].marked
    const taskListElement = document.getElementById(`l${taskId}`);
    const labelTaskElement = taskListElement.getElementsByTagName('label')[0];
    const taskInputElement = document.getElementById(`${taskId}`);
    if(marked){
        labelTaskElement.setAttribute('class','task-input-container ticked');
        taskInputElement.setAttribute("checked","");
    }else{
        labelTaskElement.setAttribute('class','task-input-container');
        taskInputElement.removeAttribute("checked");
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

function updateLabelOfTask(taskId, updatedTaskName){
    const listIndex = lists.findIndex(list => list.id === selectedListId)
    const list = lists[listIndex];
    const index = list.tasks.findIndex(task => task.id === taskId);
    if(index > -1){
        list.tasks[index].text = updatedTaskName;
    }
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
        renderTask(tasksList,task);
    }
}