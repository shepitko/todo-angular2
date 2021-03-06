import {Injectable, Inject} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Headers} from 'angular2/http';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {UrlService} from './UrlService';
import {Router} from 'angular2/router';

export interface ITodo{
    id: number;
    list_name: string;
    list_due_date: string;
    todo_items: any;
}

@Injectable()
export class TodoService{
    
    public todos$: Observable<ITodo[]>;
    private _todosObserver: any;
    private headers: Headers;
    private _dataStore: { todos: ITodo[] };

    constructor( @Inject(Http) private http: Http, @Inject(UrlService) private UrlService, @Inject(Router) public router: Router ) {

        this.todos$ = new Observable(observer =>
            this._todosObserver = observer).share();
        this._dataStore = { todos: [] };
    }

    updateTodos() {
        this._todosObserver.next(this._dataStore.todos);
    }

    getTokenHeaders(){
        let tokenHeaders = new Headers();
        tokenHeaders.append('Content-Type', 'application/json');
        tokenHeaders.append('Uid', localStorage.getItem('Uid'));
        tokenHeaders.append('Client', localStorage.getItem('Client'));
        tokenHeaders.append('Access-Token', localStorage.getItem('Access-Token'));
        return tokenHeaders;
    }
    loadTodos(){
        if(localStorage.length > 0){
            this.http.get(this.UrlService.buildUrl('/todo_lists'), {
                headers: this.getTokenHeaders()
            }).map(res => {
                if (res.status < 200 || res.status >= 300) {
                    console.log(res.status);
                } else {
                    return res.json();
                }
            }).subscribe(data => {
                this._dataStore.todos = data;
                this.updateTodos();
            });
        }
    }
    addTodo(newTodo: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var data = JSON.stringify({ "list_name": newTodo, "user_id": localStorage.getItem('user_id'), "list_due_date": this.getDateNow() });
        this.http.post(this.UrlService.buildUrl(`/todo_lists/`), data, { headers: this.getTokenHeaders() })
            .map(response => response.json())
            .subscribe(data => {
                this._dataStore.todos.push(data);
            }, error => {
                console.log('Could not update todo.');
;            });
    }

    updateTodo(editedName, todo_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var todo = JSON.stringify({ "list_name": editedName });
        this.http.put(this.UrlService.buildUrl(`/todo_lists/${todo_id}`), todo, { headers: this.getTokenHeaders() })
            .map(response => response.json()).subscribe(data => {
                this._dataStore.todos.forEach((todo, index) => {
                    if (todo.id === data.id) {
                        this._dataStore.todos[index] = data;
                    }
                });
                this.updateTodos();
            }, error => console.log('Could not update todo.'));
    }

    deleteTodo(todo_id: number){
        this.http.delete(this.UrlService.buildUrl(`/todo_lists/${todo_id}`), { headers: this.getTokenHeaders() }).subscribe(response => {
            this._dataStore.todos.forEach((todo, index) => {
                if(todo.id === todo_id){ 
                    this._dataStore.todos.splice(index, 1); 
                    this.updateTodos();
                }

            });
            
        }, error => console.log('Could not delete todo.'));
    }

    addTask(newTask:string, todo_id:number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var data = JSON.stringify({ "completed": 0, "title": newTask, "due_date": this.getDateNow(), "description": "test" });
        this.http.post(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items`), data, { headers: this.getTokenHeaders() })
            .map(response => response.json())
            .subscribe(data => {
                this._dataStore.todos.forEach((todo, index) => {
                    if (todo.id === data.id) {
                        this._dataStore.todos.push(data);
                        
                    }
                });
                
            }, error => console.log('Could not add task.'));

    }

    updateTask(editedName, task_id, todo_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var task = JSON.stringify({ "title": editedName});
        this.http.put(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items/${task_id}`), task, { headers: this.getTokenHeaders() })
            .map(response => response.json()).subscribe(data => {
            this._dataStore.todos.forEach((todo, index) => {
                if (todo.id === todo_id) {
                    todo.todo_items.forEach((task, i_index) => {
                        if (task.id === data.id) { 
                            this._dataStore.todos[index].todo_items[i_index] = data;
                          }
                    });
                }
            });
     
            this.updateTodos();
        }, error => console.log('Could not update todo.'));
    }

    toggleCompletion(task_info, todo_id) { 
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var task = JSON.stringify({ "completed": !task_info.completed, "updated_at": task_info.updated_at });
        this.http.put(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items/${task_info.id}`), task, { headers: this.getTokenHeaders() })
            .map(response => response.json()).subscribe(data => {
                this._dataStore.todos.forEach((todo, index) => {
                    if (todo.id === todo_id) {
                        todo.todo_items.forEach((task, i_index) => {
                            if (task.id === data.id) {
                                this._dataStore.todos[index].todo_items[i_index] = data;
                            }
                        });
                    }
                });
                this.updateTodos();
            }, error => console.log('Could not update todo.')); 

    }

    deleteTask(task_id, todo_id){
        this.http.delete(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items/${task_id}`), { headers: this.getTokenHeaders() }).subscribe(response => {           
            this._dataStore.todos.forEach((todo, index) => {
                if(todo.id === todo_id){ 
                    todo.todo_items.forEach((task, i_index) => {
                        if(task.id === task_id){ this._dataStore.todos[index].todo_items.splice(i_index, 1); }
                    });
                }
            });
        });
    }

    getDateNow(){
        var nowDate = new Date();
        return nowDate;
    }
    logout(){
        let publicRoutes = {
            '/login': true,
            '/signup': true
        };
        let url = this.router.lastNavigationAttempt;
        
        this.http.delete(this.UrlService.buildUrl('/auth/sign_out'), { headers: this.getTokenHeaders() })
            .subscribe(
            response => {
                localStorage.clear();
                if (!publicRoutes[url]) {
                    this.router.navigateByUrl('/login');
                }
            },
            error => {
                alert(error.text());
                console.log(error.text());
            });
    }
}