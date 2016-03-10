import { Component, Inject } from 'angular2/core';
import { Router, RouterLink } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { contentHeaders } from '../common/headers';
import {UrlService} from '../services/UrlService';

@Component({
	directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
	templateUrl: './source/templates/Login.html',
})

export class Login {
	constructor( @Inject(Router) public router: Router, @Inject(Http) public http: Http, @Inject(UrlService) private UrlService) {
	}

	login(event, email, password) {
		event.preventDefault();
		let body = JSON.stringify({ "email": email, "password": password });
		this.http.post(this.UrlService.buildUrl('/auth/sign_in'), body, { headers: contentHeaders })
			.subscribe(
			response => {
				let data = response.json();
				let headers = response.headers;
				localStorage.setItem('user_id', data.data.id);
				localStorage.setItem('Uid', headers.get('Uid'));
				localStorage.setItem('Client', headers.get('Client'));
				localStorage.setItem('Access-Token', headers.get('Access-Token'));
				localStorage.setItem('Expiry', headers.get('Expiry'));
				this.router.parent.navigateByUrl('/');
			},
			error => {
				alert(error.text());
				console.log(error.text());
			}
			);
	}

	signup(event) {
		event.preventDefault();
		this.router.parent.navigateByUrl('/signup');
	}

}