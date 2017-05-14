import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../shared/config';

@Injectable()
export class FlighBookingService {

    constructor(private http: Http) { }

    bookflight(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/flightapi/bookflight', JSON.stringify(data), options).map(resp => resp.json());
    }

    findFlights(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/flightapi/FindFlights', JSON.stringify(data), options).map(resp => resp.json());
    }

    findflightVJ(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/flightapi/findflightVJ', JSON.stringify(data), options).map(resp => resp.json());
    }

    findflightVN(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/flightapi/findflightVN', JSON.stringify(data), options).map(resp => resp.json());
    }

    findflightJS(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/flightapi/findflightJS', JSON.stringify(data), options).map(resp => resp.json());
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
