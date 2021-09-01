import Todos from './Todos.js';

let DOMfuncs = (function() {
    let projectsContainer = document.querySelector('#projectsContainer');
    console.log(projectsContainer)
    let todoContainer = document.querySelector('#todoContainer');

    function createTodoCard(Todo, project) {
        //creates container for Todo
        let todoDiv = document.createElement('div');
        todoDiv.setAttribute('id', `${Todo.title}div`);
        todoDiv.classList.add('todoCard');
        let todoData = {
            unopened: 'div',
            firstTwo: 'div',
            lastTwo: 'div',
            deleteTodo: 'button',
            checkbox: 'div',
            expand: 'div',
            down: 'img',
            editTodo: 'div',
            pencil: 'img',
        }

        let todoElements = {};
        for(let key in todoData) {
            todoElements[key] = document.createElement(todoData[key]);
            todoElements[key].classList.add(key);
        }
        todoElements.deleteTodo.textContent = "X"
        todoElements.deleteTodo.addEventListener('click', function() {
            removeTodo(Todo, project);
        })

        todoElements.checkbox.style.border = '2px solid #2B2B2B';
        todoElements.checkbox.addEventListener('click', () => {
            todoElements.checkbox.style.backgroundColor = "#2B2B2B"
            todoElements.checkbox.style.color = "white"
            todoElements.checkbox.textContent = "✓";
            
            setTimeout(function() {
                removeTodo(Todo, project);
            }, 1000)
            
        })
        todoElements.down.setAttribute('src', "https://www.shareicon.net/data/512x512/2015/12/06/683057_arrows_512x512.png");
        todoElements.expand.appendChild(todoElements.down);
        todoElements.down.addEventListener('click', function() {
            if(todoDiv.querySelector('.description')) {
                let x = todoDiv.querySelector('.description')
                todoDiv.removeChild(x)
                todoElements.down.style.cssText = "transform: scaleY(1)";
                todoDiv.removeChild(todoElements.editTodo)
                
                
            } else {
                addCardItem(Todo, 'description', 'p', todoDiv)
                todoElements.down.style.cssText = "transform: scaleY(-1)";
                todoDiv.appendChild(todoElements.editTodo)
            }
            
            
        })
        todoElements.pencil.setAttribute('src', 'http://simpleicon.com/wp-content/uploads/pencil.png')
        todoElements.editTodo.appendChild(todoElements.pencil);
        todoElements.editTodo.addEventListener('click', () => {todoAdder(project, Todo)});
        



        todoElements.firstTwo.appendChild(todoElements.checkbox);

        addCardItem(Todo, 'title', 'h2', todoElements.firstTwo);
        addCardItem(Todo, 'dueDate', 'p', todoElements.lastTwo);
        addCardItem(Todo, 'priority', 'p', todoElements.lastTwo);
        todoElements.lastTwo.appendChild(todoElements.deleteTodo);
        todoElements.unopened.appendChild(todoElements.firstTwo)
        todoElements.unopened.appendChild(todoElements.lastTwo);
        
        todoDiv.appendChild(todoElements.unopened);
        todoDiv.appendChild(todoElements.expand);
        
        todoContainer.appendChild(todoDiv);
        
    }

    function removeTodo(Todo, project) {
        let projList = JSON.parse(localStorage.getItem('projList'));
        let proj = new Todos.Project(project.title);
        proj.list = project.list;
        proj.deleteTodo(Todo);
        for(let i = 0; i < projList.length; i++) {
            if(proj.title == projList[i].title) {
                console.log(proj.title)
                projList[i] = proj;
            }
        }
        loadProject(proj);
        localStorage.setItem('projList', JSON.stringify(projList));
    }


    function addCardItem(Todo, property, element, parent) {
        let prop = document.createElement(element);
        prop.textContent = Todo[property];
        if(property == "priority") {
            switch(Todo[property]) {
                case 'High':
                    prop.style.backgroundColor = '#fa8072'
                    break;
                case 'Medium':
                    prop.style.backgroundColor = "#FFFF00"
                    break;
                case 'Low':
                    prop.style.backgroundColor = '#90ee90';
                    break;
                default:
                    break;
            }
        }
        prop.classList.add(`${property}`);
        parent.appendChild(prop);
        
    
    }

    function selectValues(val, parent) {
        let temp = document.createElement('option')
        temp.setAttribute('value', val)
        temp.textContent = val;


        parent.appendChild(temp);
    }

    function todoAdder(project, todo) {
        let body = document.querySelector('body');
        todoContainer.style.filter = "blur(5px)"
        projectsContainer.style.filter = "blur(5px)"
        let popupContainer = document.querySelector('#popupContainer');
        let properties = {
            title: 'text',
            description: 'text',
            dueDate: 'date',
            priority: 'text',
            submit: 'submit',
            cancel: 'button',
        }
        let form = document.createElement('div');
        form.setAttribute('id', 'todoPopup')
        let welcome = document.createElement('h2');
        welcome.textContent = "Add A New Todo";
        welcome.setAttribute('id', 'welcome')
        form.appendChild(welcome)
        for(let key in properties) {
            let temp;
            if(key == 'priority') {
                temp = document.createElement('select');
                selectValues('High', temp)
                selectValues('Medium', temp)
                selectValues('Low', temp)
            } else {
                temp = document.createElement('input')
                temp.setAttribute('type', properties[key])
                temp.setAttribute('placeholder', key);
                if(todo != undefined && key != 'submit') {
                    temp.setAttribute('value', todo[key]);
                }
            }
            temp.classList.add('todoInput')
            if(temp.getAttribute('type') == 'submit') {
                temp.addEventListener('click', () => {
                        let inputs = Array.from(document.querySelectorAll('.todoInput'));
                      
                        let newInputs = inputs.map(function(input) {
                            if(input.getAttribute('type') != 'submit') {
                                return input.value;
                            }                  
                        })
                        console.table(newInputs)
                        if(todo == undefined) {
                            let newObj = new Todos.Todo(newInputs[0], newInputs[1], newInputs[2], newInputs[3])
                            project.list.push(newObj);
                            loadProject(project);
                        } else { 
                            todo.title = newInputs[0];
                            todo.description = newInputs[1];
                            todo.dueDate = newInputs[2];
                            todo.priority = newInputs[3];
                            loadProject(project);

                        }
                        console.log(project)
                        updateStorage(project);
                        todoContainer.style.filter = "none"
                        projectsContainer.style.filter = "none"
                   
                    popupContainer.removeChild(form);
                })
            }
            else if(temp.getAttribute('type') == 'button') {
                console.log('das')
                temp.setAttribute('value', 'Cancel');
                temp.setAttribute('id', 'cancelTodo')
                temp.addEventListener('click', () => {
                    popupContainer.removeChild(form)
                    todoContainer.style.filter = "none"
                    projectsContainer.style.filter = "none"
                })

            }
            form.appendChild(temp)
        }
        popupContainer.appendChild(form);
    }
    function loadProject(project) {
        console.log(JSON.stringify(project, null, 4));
        todoContainer.textContent = ``;
        for(let i = 0; i < project.list.length; i++) {
            createTodoCard(project.list[i], project);
        }
        let button = document.createElement('button')
        button.classList.add('addTodo');
        button.textContent = "+ Add Todo";
        button.addEventListener('click', () => {
            todoAdder(project)
        })
        todoContainer.appendChild(button);
    }

    function addProjectToTree(project) {
        let addProj = document.querySelector('#addProj'); 
        if(existsInTree(project)) {
            return 0;
        }
        let temp = document.createElement('div');
        temp.setAttribute('id', project.title);
        temp.classList.add('projectLink');
        let tempLink = document.createElement('p')
        tempLink.textContent = `${project.title}`;
        if(project.title != 'Today') {
            temp.addEventListener('mouseenter', () => {
                if(document.querySelector('.deleteProj') == undefined) {
                    let deleteProj = document.createElement('button');
                    deleteProj.style = `background: none; 
                    font-weight: bold; 
                    color: #362222; 
                    font-size: 25px; 
                    font-family: inherit;
                    border: none;
                    `
                    deleteProj.classList.add('deleteProj')
                    deleteProj.textContent = 'X';
                    deleteProj.addEventListener('click', () => {
                        removeProjectFromTree(project);
                    })
                    temp.appendChild(deleteProj);
                }

            })
            temp.addEventListener('mouseleave', () => {
                if(temp.classList.contains('current')) {
                    return 0;
                }
                let deleteProj = document.querySelector('.deleteProj')
                temp.removeChild(deleteProj)
            })
            
        }

        temp.appendChild(tempLink);
        temp.addEventListener('click', () => {
            console.log(projectsContainer)
            let currentList = document.querySelectorAll('#projectsContainer div');
            currentList.forEach(element => {
                element.classList.remove('current')
                if(element.querySelector('.deleteProj') != undefined && temp.getAttribute('id') != 'Today') {
                    element.removeChild(element.querySelector('.deleteProj'));
                }
            })
            if(document.querySelector('.deleteProj') == undefined && temp.getAttribute('id') != 'Today') {
                    let deleteProj = document.createElement('button');
                    deleteProj.style = `background: none; 
                    font-weight: bold; 
                    color: #362222; 
                    font-size: 25px; 
                    font-family: inherit;
                    border: none;
                    `
                    deleteProj.classList.add('deleteProj')
                    deleteProj.textContent = 'X';
                    deleteProj.addEventListener('click', () => {
                        removeProjectFromTree(project);
                    })
                    temp.appendChild(deleteProj);
            }
            temp.classList.add('current')
            loadProject(project);
        })
        projectsContainer.insertBefore(temp, addProj);
        
        updateStorage(project)

    }

    function removeProjectFromTree(project) {
        let projTree = document.querySelectorAll('.projectLink')
        let projList = JSON.parse(localStorage.getItem('projList')) 
        for(let i = 0; i < projTree.length; i++) {
            if(project.title == projTree[i].getAttribute('id')) {
                projectsContainer.removeChild(projTree[i]);
                projList.splice(i, 1);
                localStorage.setItem('projList', JSON.stringify(projList))
                return 0;
            }
        }
    }

    function updateStorage(project) {
        if(localStorage.getItem('projList') != null) {
            let projList = JSON.parse(localStorage.getItem('projList'))      
            for(let i = 0; i < projList.length; i++) {
                if(projList[i].title == project.title) {
                    projList[i] = project;
                    localStorage.setItem('projList', JSON.stringify(projList));
                    return 0;
                }
            }
            
            projList.push(project);
            console.log(projList)
            localStorage.setItem('projList', JSON.stringify(projList));
            
        }
    }

    function existsInTree(project) {
        let projTree = document.querySelectorAll('.projectLink');
        for(let i = 0; i < projTree.length; i++) {
            console.log(projTree[i])
            if(projTree[i].getAttribute('id') == project.title) {
                return true;
            }
        }
        return false;
    }

    function projButton(element) {
        element.textContent = "";
        let text = document.createElement('p')
        text.textContent = "+ Add Project";
        text.setAttribute('id', 'addText')
        element.appendChild(text);
        element.removeAttribute('class')

    }

    function popup(element) {
        if(document.querySelector('.pressed') != null) {
            projButton(element)
            return 0;
        }
        if(document.querySelector('#projForm') != null) {
            return 0;
        }
        element.textContent = "";
        let form = document.createElement('div')
        form.setAttribute('id', 'projForm');
        let name = document.createElement('input')
        name.setAttribute('type', 'text');
        name.setAttribute('id', "projInput")
        name.setAttribute('placeholder', 'Project Name')
        let add = document.createElement('button')
        add.textContent = "Add"
        add.addEventListener('click', () => {
            let newProj = new Todos.Project(name.value);
            addProjectToTree(newProj);
            element.classList.toggle('pressed')

        })
        let cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.addEventListener('click', () => {
            element.classList.toggle('pressed')
        })

        add.setAttribute('id', 'add')
        cancel.setAttribute('id', 'cancl');
        form.appendChild(name);
        form.appendChild(add);
        form.appendChild(cancel);
        element.appendChild(form);
        
    }

    return {createTodoCard, addCardItem, addProjectToTree, popup, loadProject};
})();


export {DOMfuncs as default};