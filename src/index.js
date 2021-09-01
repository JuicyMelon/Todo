import DOMfuncs from './DOM.js';
import Todos from './Todos.js';


//startup script

if(localStorage.getItem('projList') != null) {
    console.log("bruh")
    let projList = JSON.parse(localStorage.getItem('projList'));
    for(let i = 0; i < projList.length; i++) {
        DOMfuncs.addProjectToTree(projList[i]);
        if(i == 0) {
            DOMfuncs.loadProject(projList[i]);
        }
    }

} else {
    let defaultProject = new Todos.Project('Today');
    DOMfuncs.addProjectToTree(defaultProject);
    DOMfuncs.loadProject(defaultProject);
    let projList = []
    projList.push(defaultProject)
    console.log(projList)
    localStorage.setItem('projList', JSON.stringify(projList))
}


let addProj = document.querySelector('#addProj');
addProj.addEventListener('click', () => {DOMfuncs.popup(addProj)})



