const tasks =  {};
const finished =  {};

let finishedArray = [];
let tasksArray = [];
let task = '';
let paragraph = '';
let counter = 0;


const enterData = (event) => {
  task = event.target.value;
}

const updateToDoside = () => {
  const str = tasksArray.join('');
  document.getElementById('to-do-root').innerHTML = str;
}

const updateFinishedSide = () => {
  const str = finishedArray.join('');
  document.getElementsByClassName('done-root')[0].innerHTML = str;
}

const getFromServer = async (tasks, finished, tasksArray, finishedArray) => {
  const response = await fetch('http://localhost:8000/allTasks', {
    method: 'GET',
  });
  
  let result;

  if (response.ok) {
    result = await response.json();
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
  

  for (let el of result.data) {
    paragraph = `<div class="task" id="${el._id}">
                  <textarea disabled class="task-text">${el.text}</textarea>
                  <div class="buttons">
                    <button class="finish" onclick="finish(event)">${el.isCheck ? 'in To-Do' : 'finished'}</button>
                    <button class="edit" onclick="edit(event)">edit</button>
                    <button class="delete" onclick="remove(event)">delete</button>
                    <button class="return" style="display: none;">return</button>
                  </div>
                </div>`;

    !el.isCheck ? tasks[el._id] = paragraph : finished[el._id] = paragraph;
  }

  for (let key in tasks) {
    if (tasksArray.indexOf(tasks[key]) < 0) {
      tasksArray.unshift(tasks[key]);
    }
  }

  for (let key in finished) {
    if (finishedArray.indexOf(finished[key]) < 0) {
      finishedArray.unshift(finished[key]);
    }
  }

  updateToDoside();
  updateFinishedSide();

  return result;
}

const postOnServer = async () => {
  const response = await fetch('http://localhost:8000/createTask',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      text: task,
      isCheck: false
    })
  });
  const result = await response.json();

  if (response.ok) {
    paragraph = `<div class="task" id="${result._id}">
                  <textarea disabled class="task-text">${task}</textarea>
                  <div class="buttons">
                    <button class="finish" onclick="finish(event)">finished</button>
                    <button class="edit" onclick="edit(event)">edit</button>
                    <button class="delete" onclick="remove(event)">delete</button>
                    <button class="return" style="display: none;">return</button>
                  </div>
                </div>`;
    tasksArray = [];
    tasks[result._id] = paragraph;

    for (let key in tasks) {
      if (tasksArray.indexOf(tasks[key]) < 0) {
        tasksArray.unshift(tasks[key]);
      }
    }

    updateToDoside();
    document.getElementById('add-task').value = null;
    task = '';
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const patchOnServer = async (isCheck, elem, _id, action) => {
  const response = await fetch('http://localhost:8000/updateTask',{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8', 
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: elem.value,
      isCheck,
      _id
    })
  });

  if (response.ok) {
    const result = await response.json();
    elem.disabled = true;
    const isEditable = elem.nextElementSibling.children[1].classList[2];

    if (action === 'finish' && isCheck) {
      delete tasks[_id];

      finished[_id] = `<div class="task" id="${_id}">
                        <textarea disabled class="task-text">${elem.value}</textarea>
                        <div class="buttons">
                          <button class="finish" onclick="finish(event)">in To-Do</button>
                          <button class="edit ${isEditable ? 'non-edit' : ''}" onclick="edit(event)">edit</button>
                          <button class="delete" onclick="remove(event)">delete</button>
                          <button class="return" style="display: none;">return</button>
                        </div>
                      </div>`
      delete tasks[_id];
      tasksArray = [];
      finishedArray = [];

      for (let key in tasks) {
        if (tasksArray.indexOf(tasks[key]) < 0) {
          tasksArray.unshift(tasks[key]);
        }
      }

      for (let key in finished) {
        if (finishedArray.indexOf(finished[key]) < 0) {
          finishedArray.unshift(finished[key]);
        }
      }

      updateToDoside();
      updateFinishedSide();

      return;
    } else if (action === 'finish' && !isCheck) {
      delete finished[_id];

      tasks[_id] = `<div class="task" id="${_id}">
                        <textarea disabled class="task-text">${elem.value}</textarea>
                        <div class="buttons">
                          <button class="finish" onclick="finish(event)">finished</button>
                          <button class="edit non-edit" onclick="edit(event)">edit</button>
                          <button class="delete" onclick="remove(event)">delete</button>
                          <button class="return" style="display: none;">return</button>
                        </div>
                      </div>`;
      delete finished[_id];
      tasksArray = [];
      finishedArray = [];

      for (let key in tasks) {
        if (tasksArray.indexOf(tasks[key]) < 0) {
          tasksArray.unshift(tasks[key]);
        }
      }

      for (let key in finished) {
        if (finishedArray.indexOf(finished[key]) < 0) {
          finishedArray.unshift(finished[key]);
        }
      }

      updateToDoside();
      updateFinishedSide();

      return;
    }

    if (_id in tasks) {     
      const paragraph = `<div class="task" id="${_id}">
                          <textarea disabled class="task-text">${elem.value}</textarea>
                          <div class="buttons">
                            <button class="finish" onclick="finish(event)">finished</button>
                            <button class="edit" onclick="edit(event)">edit</button>
                            <button class="delete" onclick="remove(event)">delete</button>
                            <button class="return" style="display: none;">return</button>
                          </div>
                        </div>`;
      tasks[_id] = paragraph;
      tasksArray = [];

      for (let key in tasks) {
        if (tasksArray.indexOf(tasks[key]) < 0) {
          tasksArray.unshift(tasks[key]);
        }
      }
      updateToDoside();

    } else if (_id in finished) {      
      const paragraph = `<div class="task" id="${_id}">
                        <textarea disabled class="task-text">${elem.value}</textarea>
                        <div class="buttons">
                          <button class="finish" onclick="finish(event)">in To-Do</button>
                          <button class="edit" onclick="edit(event)">edit</button>
                          <button class="delete" onclick="remove(event)">delete</button>
                          <button class="return" style="display: none;">return</button>
                        </div>
                      </div>`;
      finished[_id] = paragraph;
      finishedArray = [];
              
      for (let key in finished) {
        if (finishedArray.indexOf(finished[key]) < 0) {
          finishedArray.unshift(finished[key]);
        }
      }

      updateFinishedSide();
    }
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const deleteFromServer = async (id) => {
  const response = await fetch(`http://localhost:8000/deleteTask?_id=${id}`,{
    method: 'DELETE',
  });
  
  if (response.ok) {
    const result = await response.json();

    delete tasks[result._id];
    delete finished[result._id];
  } else {
    alert(`Error HTTP: ${response.status}`);
  }
}

const initialPrint = (tasks, finished) => {
  for (let key in tasks) {
    if (tasksArray.indexOf(tasks[key]) < 0) {
      tasksArray.unshift(tasks[key]);
    }
  }

  for (let key in finished) {
    if (finishedArray.indexOf(finished[key]) < 0) {
      finishedArray.unshift(finished[key]);
    }
  }

  updateToDoside();
  updateFinishedSide();
}

const finish = async (event) => {
  const id = event.target.parentElement.parentElement.id;
  const div = document.getElementById(id);
  const textarea = div.children[0];
  const text = textarea.value;
  const isCheck = Object.keys(tasks).includes(id);
  patchOnServer(!isCheck, textarea, id, 'finish');
}

const edit = (event) => {
  if (event.target.classList[1] !== 'non-edit') {
    const id = event.target.parentElement.parentElement.id;
    const div = document.getElementById(id);
    const textarea = div.children[0];
    const ret = div.children[1].children[3];
    const editBtn = div.children[1].children[1];
    const val = textarea.value;
    
    textarea.disabled = false;
    ret.style.display = "block";

    ret.onclick = (event) => {
      const id2 = event.target.parentElement.parentElement.id;
      const textarea2 = document.getElementById(id).children[0];
      textarea2.value = val;
    };

    editBtn.onclick = async (el) => {
      ret.style.display = "none";
      const isCheck = Object.keys(tasks).includes(id);
      patchOnServer(isCheck, textarea, id);
    }
  }
}

const remove = async (event) => {
  const id = event.target.parentElement.parentElement.id;

  delete tasks[id];
  tasksArray = [];

  for (let key in tasks) {
    tasksArray.unshift(tasks[key]);
  }

  delete finished[id];
  finishedArray = [];

  for (let key in finished) {
    finishedArray.unshift(finished[key]);
  }

  updateFinishedSide();
  updateToDoside();
  deleteFromServer(id);
}


///////////////////////////////////////////////////////////////////////////////////////


window.onload = async () => {
  const input = document.getElementById('add-task');
  const button = document.getElementById('btn');
  const root = document.getElementById('root');

  getFromServer(tasks, finished, tasksArray, finishedArray);

  input.addEventListener('change', enterData);
  button.addEventListener('click', postOnServer);
  initialPrint(tasks, finished);
}
