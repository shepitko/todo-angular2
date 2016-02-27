import {Component, Inject} from 'angular2/core';
import {TodoList} from './components/TodoList';

@Component({
    selector: 'todo-app',
	templateUrl: './source/templates/TodoApp.html',
	directives: [TodoList]
})
export class TodoApp {
    constructor() {}
}