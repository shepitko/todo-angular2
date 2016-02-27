import {Component, Inject, Input} from 'angular2/core';
import {TodoService, ITodo} from '../services/TodoService';

@Component({
    selector: 'todo-item',
    templateUrl: './source/templates/TodoItem.html'
})
export class TodoItem {
	@Input('todo-item') todoItem: ITodo;
    constructor() { }
}