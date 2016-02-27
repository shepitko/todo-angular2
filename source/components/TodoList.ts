import {Component, Inject, OnInit} from 'angular2/core';

import {TodoService, ITodo} from '../services/TodoService';
import {TodoItem} from './TodoItem';

@Component({
    selector: 'todo-list',
    templateUrl: './source/templates/TodoList.html',
    directives: [TodoItem]
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
    addTodo(newTodo: string, user_id: number) {
        this._todoService.addTodo(newTodo, user_id);
        this._todoService.loadTodos();
    }
    deleteTodo(todo_id: number) {
        console.log(todo_id);
        this._todoService.deleteTodo(todo_id);
        this._todoService.loadTodos();
    }
    addTask(newTask: string, todo_id: number) {
        this._todoService.addTask(newTask, todo_id);
        this._todoService.loadTodos();
    }

    stopEditing(task, editedName: string) {
        task.name = editedName;
        task.editing = false;
    }

    cancelEditingTask(task) {
        task.editing = false;
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

    editTask(task) {
        task.editing = true;
    }

    deleteTask(task_id, todo_id) {
        this._todoService.deleteTask(task_id, todo_id);
    }

    submitted = false;
    onSubmit() { this.submitted = true; }

    ngOnDestroy() {
        this.todosSubscription.unsubscribe();
    }
}

/*
add todo(project)
delete
edit name
*/