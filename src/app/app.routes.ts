import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountRegisterComponent } from './account-register/account-register.component';
import { ViewFeatureArticleComponent } from './view-feature-article/view-feature-article.component';
import { ViewArticleComponent } from './view-article/view-article.component';
import { ViewArticleDetailsComponent } from './view-article-details/view-article-details.component';
import { FlightBookingComponent } from './flight-booking/flight-booking.component';
import { NotfoundComponent } from './notfound/notfound.component';
export const routes: Routes = [
    {
        path: 'login', component: LoginComponent, outlet: 'ev'
    },
    {
        path: 'account', component: AccountInfoComponent, outlet: 'ev'
    },
    {
        path: 'register', component: AccountRegisterComponent, outlet: 'ev'
    },
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {
            metadata: {
                title: 'Home Page',
                description: 'Cool home page'
            }
        }
    },
    { path: 'fa/:friendlyName/:id', component: ViewFeatureArticleComponent},
    { path: 'tin-tuc', component: ViewArticleComponent},
    { path: 'tin-tuc/:friendlyName/:id', component: ViewArticleDetailsComponent},
    { path: 'tim-chuyen-bay', component: FlightBookingComponent},
    {
        path: 'admin',
        loadChildren: "app/admin/admin.module#AdminModule"
    },
    {
        path: '**', component: NotfoundComponent, 
        data: {
            metadata: {
                title: 'Home Page',
                description: 'Cool home page'
            }
        }
    }
];

export const components = [
    LoginComponent, 
    HomeComponent, 
    NotfoundComponent,
    ViewFeatureArticleComponent,
    ViewArticleComponent,
    ViewArticleDetailsComponent,
    FlightBookingComponent,
    AccountInfoComponent,
    AccountRegisterComponent
];