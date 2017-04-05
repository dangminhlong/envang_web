import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import {Ng2PaginationModule} from 'ng2-pagination';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TinyMceDirective2 } from '../directives/tinymce.directive';

import { DatepickerModule } from '../angular2-material-datepicker/datepicker.module';

//components
import { UsersComponent } from './users/users.component';
import { RoleComponent } from './roles/role.component';
import { RegionComponent } from './region/region.component';
import { LocationComponent } from './location/location.component';
import { FlightRouteComponent } from './flightroute/flightroute.component';
import { CategoryComponent } from './categories/categories.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticlesDialog } from './articles/articles.dialog';
import { FileManagerComponent} from './filemanager/filemanager.component';
import { FeatureArticleConfigGroupComponent} from './feature-article-config-group/feature-article-config-group.component';
import { FeatureArticleConfigComponent } from './feature-article-config/feature-article-config.component';
import { WebConfigComponent } from './webconfig/web-config.component';
import { AirlineComponent } from './airline/airline.component';
import { LuggagePriceComponent } from './luggage-price/luggage-price.component';
import { ProvinceComponent } from './province/province.component';

//services
import { RolesService } from './roles/role.service';
import { UsersService } from './users/users.service';
import { RegionService } from './region/region.service';
import { LocationService } from './location/location.service';
import { FlightRouteService } from './flightroute/flightroute.service';
import { CategoriesService } from './categories/categories.service';
import { ArticlesService } from './articles/articles.service';
import { FileManagerService } from './filemanager/filemanager.service';
import { FeatureArticleConfigGroupService} from './feature-article-config-group/feature-article-config-group.service';
import { FeatureArticleConfigService } from './feature-article-config/feature-article-config.service';
import { WebConfigService} from './webconfig/web-config.service';
import { AirlineService } from './airline/airline.service';
import { LuggagePriceService } from './luggage-price/luggage-price.service';
import { ProvinceService } from './province/province.service';

const routes: Routes = [
    { path: 'users', component: UsersComponent},
    { path: 'role', component: RoleComponent },
    { path: 'region', component: RegionComponent },
    { path: 'location', component: LocationComponent },
    { path: 'flightroute', component: FlightRouteComponent },
    { path: 'articletype', component: CategoryComponent },
    { path: 'article', component: ArticlesComponent },
    { path: 'filemanager', component: FileManagerComponent },
    { path: 'feature-article-config-group', component: FeatureArticleConfigGroupComponent },
    { path: 'feature-article-config', component: FeatureArticleConfigComponent },
    { path: 'article-dialog', component: ArticlesDialog },
    { path: 'web-config', component: WebConfigComponent },
    { path: 'airline', component: AirlineComponent },
    { path: 'luggage', component: LuggagePriceComponent },
    { path: 'province', component: ProvinceComponent }
];

@NgModule({
    imports: [
        CommonModule, FormsModule, HttpModule, MaterialModule, FlexLayoutModule, Ng2PaginationModule, DatepickerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [TinyMceDirective2, UsersComponent, RoleComponent, RegionComponent, LocationComponent, 
        FlightRouteComponent, CategoryComponent, ArticlesComponent, FileManagerComponent,
        FeatureArticleConfigGroupComponent, FeatureArticleConfigComponent,
        ArticlesDialog, AirlineComponent, LuggagePriceComponent, ProvinceComponent,
        WebConfigComponent],
    providers: [RolesService, UsersService, RegionService, LocationService, FlightRouteService, CategoriesService,
        ArticlesService, FileManagerService, ProvinceService,
        FeatureArticleConfigGroupService, FeatureArticleConfigService,
        WebConfigService, LuggagePriceService,
        AirlineService]
})
export class AdminModule { }
