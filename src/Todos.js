let Todos = (function() {
    class Todo {
        constructor(title, description, dueDate, priority) {
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
        }
    }

    class Project {
        constructor(title) {
            this.title = title;
            this.list = []; 
        }

        addTodo(Todo) {
            this.list.push(Todo);
        }

        deleteTodo(Todo) {
            let index = "Error: no todo of that value in the project"
            for(let i = 0; i < this.list.length; i++) {
                if (this.list[i] === Todo) {
                    index = i;
                }
            }
            if((typeof index) != 'string') {
                this.list.splice(index, 1);
            }
            else {
                console.log(index);
            }
            
        }

    

        

    }

    return {Todo, Project}
})();

export {Todos as default};