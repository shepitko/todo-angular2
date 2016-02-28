import {Injectable} from 'angular2/core';

@Injectable()
export class UrlService{
    private baseUrl: string = 'http://rails-api-todo.herokuapp.com/api';

    constructor(){}

    public buildUrl = (url: string) => this.baseUrl + url;
}
