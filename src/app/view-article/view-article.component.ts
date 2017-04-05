import { Component, OnInit } from '@angular/core';
import { Config } from '../shared/config'

import { AuthService } from '../shared/auth-service';
import { ViewArticleService } from '../shared/viewarticle.service';

@Component({
    selector: 'ev-view-article',
    templateUrl: './view-article.component.html'
})
export class ViewArticleComponent implements OnInit {
    latestArticle:any = {};
    articleList:any[] = [];
    totalItems:any = 1;
    page = 1;
    pageSize = 10;

    apiUrl = Config.apiUrl;

    constructor(private service: ViewArticleService, 
        private auth: AuthService) { }

    ngOnInit() { 
        this.getLatest();
        this.getListByPage(this.page, this.pageSize);
    }

    getLatest(){
        this.service.getLatest().subscribe(resp=>{
            this.latestArticle = resp;
        });
    }

    getListByPage(page, pageSize){
        let data = {
            Page: page,
            PageSize: pageSize
        };
        this.service.getListView(data).subscribe(
            resp=>{
                this.articleList = resp.Data;
                this.totalItems = resp.TotalItems;
            });
    }

    loadPage(event){
        this.page = event;
        this.getListByPage(this.page, this.pageSize);
    }
}