import {Component, Inject, OnInit, OnDestroy} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';
import {TodoService, ITodo} from '../services/TodoService';

@Component({
    selector: 'todo-list',
    templateUrl: './source/templates/TodoList.html'
})
export class TodoList {
    todos: ITodo[];
    private todosSubscription;

    constructor(@Inject(TodoService) private _todoService) {
    }

    ngOnInit() {
        this._todoService.todos$
            .subscribe(updateTodos => this.todos = updateTodos);
        this._todoService.loadTodos();
    }

    /*todo section*/
    addTodo(newTodo, todo_new) {
        this._todoService.addTodo(newTodo.value);
        setTimeout(() => {
            this._todoService.loadTodos();
        }, 500);
        todo_new.add = false;
    }

    todoCreateState(todo_new) {
        todo_new.add = true;
    }

    updateEditingTodo(todo, editedName: string,  todo_id: number) {
        
        editedName = editedName.trim();
        if (editedName.length !== 0) {
            this._todoService.updateTodo(editedName, todo_id);
            todo.list_name = editedName;
        }
        todo.editing = false;
    }

    stopEditingTodo(todo, editedName: string) {
        todo.name = editedName;
        todo.editing = false;
    }

    cancelEditingTodo(todo) {
        todo.editing = false;
    }

    editTodo(todo) {
        todo.editing = true;
    }
    
    deleteTodo(todo_id: number) {
        this._todoService.deleteTodo(todo_id);
        /*lazy load */
        setTimeout(() => {
            this._todoService.loadTodos();
        }, 20000);
    }
    
    /*task section*/
    addTask(newTask: string, todo_id: number) {
        this._todoService.addTask(newTask, todo_id);
        /*lazy load */
        setTimeout(() => {
            this._todoService.loadTodos();
        }, 500);   
    }

    updateEditingTask(task, editedName: string, task_id: number, todo_id: number) {
        editedName = editedName.trim();
        task.editing = false;
        if (editedName.length === 0) {
            this.deleteTask(task_id, todo_id);
        } else {
            this._todoService.updateTask(editedName, task_id, todo_id);
            task.title = editedName;
        }

    }

    stopEditing(task, editedName: string) {
        task.name = editedName;
        task.editing = false;
    }

    cancelEditingTask(task) {
        task.editing = false;
    }

    editTask(task) {
        task.editing = true;
    }

    deleteTask(task_id, todo_id) {
        this._todoService.deleteTask(task_id, todo_id);
    }

    toggleCompletion(task, todo_id) {
        this._todoService.toggleCompletion(task, todo_id);
    }

    todo_new = { add: false };
    ngOnDestroy() {
        /*this.todosSubscription.unsubscribe();*/
    }
    logout(){
        this._todoService.logout();
    }
}
