import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../shared/config';

@Injectable()
export class LoginService {

    constructor(private http: Http) { }
    login(username, password) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        let data = `username=${username}&password=${password}&grant_type=password`;
        return this.http.post(Config.apiUrl + "/token", data, options).map(resp => resp.json());
    }
    getUserInfo() {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + "/api/user/info", {}, options).map(resp => resp.json());
    }
}
