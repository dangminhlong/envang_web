import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from './config';

@Injectable()
export class ViewArticleService {

    constructor(private http: Http) { }

    get(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/article/getitem', JSON.stringify(data), options).map(resp => resp.json());
    }

    getLatest(){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/article/getlatest', JSON.stringify({}), options).map(resp => resp.json());
    }

    getListView(data){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/article/getlistview', JSON.stringify(data), options).map(resp => resp.json());
    }
}
