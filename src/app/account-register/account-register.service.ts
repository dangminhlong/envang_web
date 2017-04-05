import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../shared/config';

@Injectable()
export class AccountRegisterService {

    constructor(private http: Http) { }
    save(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + "/api/user/register", JSON.stringify(data), options).map(resp => resp.json());
    }
}
