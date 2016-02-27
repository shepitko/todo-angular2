import {Injectable, Inject} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Headers} from 'angular2/http';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {UrlService} from './UrlService';


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

    constructor( @Inject(Http) private http: Http, @Inject(UrlService) private UrlService) {
        this.todos$ = new Observable(observer =>
            this._todosObserver = observer).share();
        this._dataStore = { todos: [] };
    }

    updateTodos() {
        this._todosObserver.next(this._dataStore.todos);
    }

    loadTodos(){
        this.http.get(this.UrlService.buildUrl('/todo_lists')).map(response => response.json()).subscribe(data => {
            this._dataStore.todos = data;
            this.updateTodos();
        });
    }
    addTodo(newTodo: string, user_id: number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var data = JSON.stringify({ "list_name": newTodo, "user_id": 1, "list_due_date": "2016-11-21" });
        this.http.post(this.UrlService.buildUrl(`/todo_lists/`), data, { headers: headers})
            .map(response => response.json())
            .subscribe(data => {
                this._dataStore.todos.push(data);
                this.updateTodos();
            }, error => console.log('Could not update todo.'));
    }
    deleteTodo(todo_id: number){
        this.http.delete(this.UrlService.buildUrl(`/todo_lists/${todo_id}`)).subscribe(response => {
            this._dataStore.todos.forEach((t, index) => {
                if(t.id === todo_id){ this._dataStore.todos.splice(index, 1); }
            });
            this.updateTodos();
        });
    }

    addTask(newTask:string, todo_id:number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
       /* console.log(this.getDateNow());*/
        var data = JSON.stringify({ "completed": 0, "title": newTask, "due_date":this.getDateNow(), "description":"test"});
        this.http.post(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items`), data, { headers: headers })
            .map(response => response.json())
            .subscribe(data => {
                console.log(this.getDateNow());
                this._dataStore.todos.push(data);
                this.updateTodos();
            });
    }

    updateTask(editedName, task_id, todo_id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var task = JSON.stringify({ "title": editedName});
        this.http.put(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items/${task_id}`), task, { headers: headers })
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
        this.http.delete(this.UrlService.buildUrl(`/todo_lists/${todo_id}/todo_items/${task_id}`)).subscribe(response => {           
            this._dataStore.todos.forEach((todo, index) => {
                if(todo.id === todo_id){ 
                    todo.todo_items.forEach((task, i_index) => {
                        if(task.id === task_id){ this._dataStore.todos[index].todo_items.splice(i_index, 1); }
                    });
                }
            });
            this.updateTodos();
        });
    }

    getDateNow(){
        var nowDate = new Date();
        return nowDate;
    }
}