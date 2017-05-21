import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetadataService } from 'ng2-metadata';
import { AuthService } from './shared/auth-service';
import { FeatureArticleConfigGroupService } from './admin/feature-article-config-group/feature-article-config-group.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers:[FeatureArticleConfigGroupService]
})
export class AppComponent implements OnInit {
    dsFAC:any[] = [];
    showManageMenu = false;
    constructor(private metaService: MetadataService,
        public auth: AuthService,
        private facService: FeatureArticleConfigGroupService,
        private router: Router) { }
    ngOnInit() {
        this.getDSFAC();
    }
    getDSFAC(){
        this.facService.getList().subscribe(resp=>{
            this.dsFAC = resp;
        });
    }
    
    showLoginForm() {
        this.router.navigate([{ outlets: { ev: ['login'] } }]);
    }

    showRegisterForm(){
        this.router.navigate([{ outlets: { ev: ['register'] } }]);
    }

    accountInfo(){
        this.router.navigate([{ outlets: { ev: ['account'] } }]);
    }

    logOut() {
        this.auth.IsLoggedIn = false;
        localStorage.removeItem("evtoken");
        localStorage.removeItem("evUserInfo");
    }

    goToRoute(routerPath){
        this.router.navigate([routerPath]);
        this.showManageMenu = false;
    }
}
