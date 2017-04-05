import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../shared/config';

@Injectable()
export class FileManagerService {

    constructor(private http: Http) { }

    getListFolder(folder) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.apiUrl + '/api/filemanager/getlistfolders?folder='+folder, options).map(resp => resp.json());
    }

    getListFile(folder) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.apiUrl + '/api/filemanager/getlistfiles?folder='+folder, options).map(resp => resp.json());
    }

    uploadFile(file, path) {
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        let formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("path", path);
        return this.http.post(Config.apiUrl + '/api/filemanager/uploadFile', formData, options).map(resp => resp.json());
    }

    deleteFile(filepath){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.apiUrl + '/api/filemanager/deletefile?filepath='+filepath, options).map(resp => resp.json());        
    }

    deleteFolder(folderPath){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.apiUrl + '/api/filemanager/deletefolder?folderpath='+folderPath, options).map(resp => resp.json());        
    }

    createFolder(folderPath){
        let token = localStorage.getItem("evtoken");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.apiUrl + '/api/filemanager/createFolder?folderpath='+folderPath, options).map(resp => resp.json());        
    }
}
