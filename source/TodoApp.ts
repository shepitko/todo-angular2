import {Component, Inject} from 'angular2/core';
import {TodoList} from './components/TodoList';
import {Location, RouteConfig, RouterLink, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {LoggedInRouterOutlet} from './services/LoggedInOutlet';
import {Login} from './components/Login';
import {Signup} from './components/Signup';

@Component({
    selector: 'todo-app',
	templateUrl: './source/templates/TodoApp.html',
	directives: [TodoList, ROUTER_DIRECTIVES, LoggedInRouterOutlet]
})
@RouteConfig([
	{ path: '/', component: TodoList, as: 'TodoList' },
	{ path: '/login', component: Login, as: 'Login' },
	{ path: '/signup', component: Signup, as: 'Signup' }
])

export class TodoApp {
	public publicRoutes: any;
    constructor( @Inject(Router) public router: Router) {}
}