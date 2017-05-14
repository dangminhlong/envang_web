import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../shared/config';

@Injectable()
export class GeneralService {

    constructor(private http: Http) { }

    get(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.apiUrl + '/api/general', options).map(resp => resp.json());
    }

    save(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/general', JSON.stringify(data), options).map(resp => resp.json());
    }
}
