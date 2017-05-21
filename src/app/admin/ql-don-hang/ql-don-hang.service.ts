import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../shared/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class QlDonHangService {
    constructor(private http: Http) { }
    getDsDonHang(data){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/QlDonHang/LayDsDonHang', JSON.stringify(data), options).map(resp => resp.json());
    }

    getDonHangDetail(data){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/QlDonHang/LayThongTinChiTiet', JSON.stringify(data), options).map(resp => resp.json());
    }

    nhanXuLy(data){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/QlDonHang/NhanXuLy', JSON.stringify(data), options).map(resp => resp.json());
    }

    huyDonHang(data){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/QlDonHang/HuyDonHang', JSON.stringify(data), options).map(resp => resp.json());
    }

    capNhatVe(data){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.apiUrl + '/api/QlDonHang/CapNhatVe', JSON.stringify(data), options).map(resp => resp.json());
    }
}