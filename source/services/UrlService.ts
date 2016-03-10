import {Injectable} from 'angular2/core';

@Injectable()
export class UrlService{
    private baseUrl: string = 'http://rails-api-todo.herokuapp.com/api';
    /*private baseUrl: string = 'http://localhost:3000/api';*/

    constructor(){}

    public buildUrl = (url: string) => this.baseUrl + url;
}
