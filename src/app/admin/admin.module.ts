import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { CoreModule } from '../core.module';
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
import { GeneralComponent } from './general/general.component';
import { GeneralService } from './general/general.service';
import { paymentmethodComponent } from './payment-method/payment-method.component';
import { PaymentMethodService } from './payment-method/payment-method.service';
import { QlDonHangComponent } from './ql-don-hang/ql-don-hang.component';
import { QlDonHangService } from './ql-don-hang/ql-don-hang.service';

import { EvGuard } from '../shared/ev.guard';

const routes: Routes = [
    { path: 'users', component: UsersComponent, canActivate:[EvGuard]},
    { path: 'role', component: RoleComponent, canActivate:[EvGuard] },
    { path: 'region', component: RegionComponent, canActivate:[EvGuard] },
    { path: 'location', component: LocationComponent, canActivate:[EvGuard] },
    { path: 'flightroute', component: FlightRouteComponent, canActivate:[EvGuard] },
    { path: 'articletype', component: CategoryComponent, canActivate:[EvGuard] },
    { path: 'article', component: ArticlesComponent, canActivate:[EvGuard] },
    { path: 'filemanager', component: FileManagerComponent, canActivate:[EvGuard] },
    { path: 'feature-article-config-group', component: FeatureArticleConfigGroupComponent, canActivate:[EvGuard] },
    { path: 'feature-article-config', component: FeatureArticleConfigComponent, canActivate:[EvGuard] },
    { path: 'article-dialog', component: ArticlesDialog, canActivate:[EvGuard] },
    { path: 'web-config', component: WebConfigComponent, canActivate:[EvGuard] },
    { path: 'airline', component: AirlineComponent, canActivate:[EvGuard] },
    { path: 'luggage', component: LuggagePriceComponent, canActivate:[EvGuard] },
    { path: 'province', component: ProvinceComponent, canActivate:[EvGuard] },
    { path: 'general', component: GeneralComponent, canActivate:[EvGuard] },
    { path: 'payment-method', component: paymentmethodComponent, canActivate:[EvGuard] },
    { path: 'ql-don-hang', component: QlDonHangComponent, canActivate:[EvGuard] },
];

@NgModule({
    imports: [
        CoreModule, 
        RouterModule.forChild(routes)
    ],
    declarations: [UsersComponent, RoleComponent, RegionComponent, LocationComponent, 
        FlightRouteComponent, CategoryComponent, ArticlesComponent, FileManagerComponent,
        FeatureArticleConfigGroupComponent, FeatureArticleConfigComponent,
        ArticlesDialog, AirlineComponent, LuggagePriceComponent, ProvinceComponent,
        WebConfigComponent, paymentmethodComponent,
        GeneralComponent, QlDonHangComponent],
    providers: [EvGuard, RolesService, UsersService, RegionService, LocationService, FlightRouteService, CategoriesService,
        ArticlesService, FileManagerService, ProvinceService,
        FeatureArticleConfigGroupService, FeatureArticleConfigService,
        WebConfigService, LuggagePriceService, PaymentMethodService,
        AirlineService, GeneralService, QlDonHangService]
})
export class AdminModule { }
