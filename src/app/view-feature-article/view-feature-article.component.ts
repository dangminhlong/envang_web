import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../shared/auth-service';
import { ViewArticleService } from '../shared/viewarticle.service';
import { FeatureArticleConfigService } from '../admin/feature-article-config/feature-article-config.service';

@Component({
    selector: 'ev-view-feature-article',
    templateUrl: './view-feature-article.component.html',
    providers: [FeatureArticleConfigService]
})
export class ViewFeatureArticleComponent implements OnInit {
    item:any={};
    selectedItem;
    dsFA: any[] = [];
    constructor(
        private service: ViewArticleService, 
        private faService: FeatureArticleConfigService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() { 
        this.route.params.subscribe(params=>{
            let id = params["id"];
            let friendlyName = params["friendlyName"];
            this.faService.getList({GroupId: id}).subscribe(resp=>{
                this.dsFA = resp;
                if (this.dsFA.length){
                    this.viewArticle(this.dsFA[0]);
                }
            });
        });
    }    

    viewArticle(item){
        this.selectedItem = item;
        let data = {
            Id: item.ArticleId
        };
        this.service.get(data).subscribe(resp=>{
            this.item = resp;
        });
    }
}