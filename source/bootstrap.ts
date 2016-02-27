import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';

import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';

import {TodoApp} from './TodoApp';

import {TodoService} from './services/TodoService';
import {UrlService} from './services/UrlService';

bootstrap(TodoApp, [TodoService, UrlService, HTTP_PROVIDERS]);