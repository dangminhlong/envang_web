import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from './config';
import { WebConfigService } from '../admin/webconfig/web-config.service';

@Injectable()
export class AuthService{
    public IsLoggedIn:boolean;
    public UserInfo: any;
    public HotlineTop: any;
    public HotlineFull: any;
    public FlightSearch: any;
    constructor(private http: Http, private wcService: WebConfigService) { 
        let evtoken = localStorage.getItem("evtoken");
        if (!evtoken) {
            this.IsLoggedIn = false;
            this.UserInfo = {
                FullName: ""
            };
        }
        else {
            this.IsLoggedIn = true;
            let evUserInfo = localStorage.getItem("evUserInfo");
            this.UserInfo = JSON.parse(evUserInfo);
        }
        this.getWC();
    }   

    getWC(){
        this.wcService.get().subscribe(resp=>{
            if (resp){
                this.HotlineTop = resp.HotlineTop;
                this.HotlineFull = resp.HotlineFull;        
            }
        });
    }
}