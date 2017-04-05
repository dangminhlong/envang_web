import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../shared/config';

@Injectable()
export class FlightRouteService {

    constructor(private http: Http) { }

    getListAndGroup() {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/location/GetListAndGroup', JSON.stringify({}), options).map(resp => resp.json());
    }

    getListDestLocationAndGroup(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/location/GetListDestLocationAndGroup', JSON.stringify(data), options).map(resp => resp.json());
    }

    getListDestLocationRoutedAndGroup(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/location/GetListDestLocationRoutedAndGroup', JSON.stringify(data), options).map(resp => resp.json());
    }

    save(data) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/flightroute/save', JSON.stringify(data), options).map(resp => resp.json());
    }
}
