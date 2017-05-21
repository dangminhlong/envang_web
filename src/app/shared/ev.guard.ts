import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { Config } from './config';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class EvGuard implements CanActivate {
    constructor(private http:Http) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        let data = {
            RouterPath: state.url
        };
        return this.http.post(Config.apiUrl + "/api/user/CheckPageByUser", JSON.stringify(data), options).map(resp=>{
            var jsonResult = resp.json();
            return jsonResult.HasPermission;
        });
    }
}