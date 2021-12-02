const lists = [];
let selectedListId;

function List(listName){
    this.id = 'a'+Date.now().toString();
    this.name = listName;
    this.tasks = [];
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup',event =>{
    event.preventDefault();
    showListAccordingToSearch();
})

function showListAccordingToSearch(){
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
        selectedListId = list.id;
        if(event.target.className === 'material-icons del'){
            deleteList();
        }
        else{
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
    <button class="material-icons del">delete_forever</button>
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