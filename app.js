
const select_list = document.querySelector('.task-list');
const listform = document.querySelector('form');
const input = document.querySelector('input');
const deleteList = document.querySelector('#delete-list');
const deletecompletedtasks = document.querySelector('#delete-data');
const todolist = document.querySelector('.todo-list');
const listtitle = document.querySelector('.list-title');
const taskcount = document.querySelector('.task-count');
const select_task = document.querySelector('.tasks');
const tasktemplate = document.querySelector('#task-template');
const taskform = document.querySelector('.task-form');
const taskinput = document.querySelector('#task-form-input');
const deletestorage = document.querySelector('#delete-storage');


const LOCAL_STORAGE_LIST_KEY = 'list.tasks';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedlist';


let selectedlistid = null;
let tasks = [];

// localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
// JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) ||


listform.addEventListener('submit', (e) => {
    e.preventDefault();
    list_name = take_list();
    input.value = '';
    tasks.push(list_name)
    saveandrender();
})


taskform.addEventListener('submit', (e) => {
    e.preventDefault();
    task_name = take_task();
    taskinput.value = '';
    const selectedlist = tasks.find(task => task.id === selectedlistid);
    selectedlist.lists.push(task_name);
    saveandrender();
})


select_list.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedlistid = e.target.dataset.listId
        saveandrender();
    }
})


select_task.addEventListener('click', (e) => {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedlist = tasks.find(task => task.id === selectedlistid);
        const selectedTask = selectedlist.lists.find(list => list.id === e.target.id);
        selectedTask.complete = e.target.checked
        save()
        render_task_count(selectedlist)
    }
})

deleteList.addEventListener('click', (e) => {
    tasks = tasks.filter((task) => task.id !== selectedlistid)
    selectedlistid = null
    saveandrender();
})

deletecompletedtasks.addEventListener('click', (e) => {
    const selectedlist = tasks.find(task => task.id === selectedlistid);
    selectedlist.lists = selectedlist.lists.filter(list => !list.complete);
    saveandrender();
})


deletestorage.addEventListener('click', ()=> {
    localStorage.clear();
})








function take_list(){
    if (input.value === null || input.value === '') {
        return
    } else {
       return  {
           name : input.value,
            id : Date.now().toString(),
            lists : []
        }
    }
}

function take_task() {
    if (taskinput.value === null || taskinput.value === '') {
        return
    } else {
       return  {
           name : taskinput.value,
            id : Date.now().toString(),
            complete : false
        }
    }
}


function display_task(selectedlist){
    selectedlist.lists.forEach(task => {
        const taskelement = document.importNode(tasktemplate.content, true)
        const checkbox = taskelement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskelement.querySelector('#label');
        label.htmlFor = task.id;
        label.append(task.name);
        select_task.appendChild(taskelement);
    })
}


function display_list(){
    tasks.forEach( (task) => {
        const list_item = document.createElement('li');
        list_item.dataset.listId = task.id;
        list_item.classList.add('list-name');
        list_item.innerText = task.name;
        if(task.id === selectedlistid) list_item.classList.add('active-list')
        select_list.appendChild(list_item);
    })
}


function render_task_count(selectedtask){
    const incompletettaskcount = selectedtask.lists.filter(task => !task.complete).length;
    const takestring = incompletettaskcount === 1 ? 'task' : 'tasks'
    taskcount.innerHTML = `${incompletettaskcount} ${takestring} remaining`;
}


function clear_listitems(element){
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(tasks));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedlistid);
}


function render_data(){
    clear_listitems(select_list);
    display_list();
    const selectedlist = tasks.find(task => task.id === selectedlistid);
    if (selectedlistid === null) {
        todolist.style.display = 'none';
    } else {
        todolist.style.display = '';
        listtitle.innerHTML = selectedlist.name;
        render_task_count(selectedlist)
        clear_listitems(select_task);
        display_task(selectedlist);
    }
}


function saveandrender(){
    // save();
    render_data();
}


