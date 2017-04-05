import { Component, OnInit } from '@angular/core';
import { Config } from '../shared/config'
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../shared/auth-service';
import { ViewArticleService } from '../shared/viewarticle.service';

@Component({
    selector: 'ev-view-article-details',
    templateUrl: './view-article-details.component.html'
})
export class ViewArticleDetailsComponent implements OnInit {
    item:any = {};
    apiUrl = Config.apiUrl;

    constructor(private service: ViewArticleService, 
        private auth: AuthService,
        private route: ActivatedRoute) { }

    ngOnInit() { 
        this.route.params.subscribe(params=>{
            let id = params["id"];
            let friendlyName = params["friendlyName"];
            this.service.get({Id: id}).subscribe(resp=>{
                this.item = resp;
            });
        });
    }
}