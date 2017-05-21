import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MetadataModule } from 'ng2-metadata';
import { EvTimePipe, EvTimeOnlyPipe } from './directives/ev-time.directive';
import { AppComponent } from './app.component';
import { routes, components } from './app.routes';
import { AuthService } from './shared/auth-service';
import { ViewArticleService } from './shared/viewarticle.service';


import { WebConfigService } from './admin/webconfig/web-config.service';
import { FlighBookingService } from './flight-booking/flight-booking.service';
import { FlightRouteService } from './admin/flightroute/flightroute.service';
import { LuggagePriceService } from './admin/luggage-price/luggage-price.service';

import { CoreModule } from './core.module';

import 'hammerjs';

@NgModule({
    declarations: [
        AppComponent,
        ...components
    ],
    imports: [
        CoreModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, { useHash: true }),
        MetadataModule.forRoot()
    ],
    providers: [
        AuthService, 
        ViewArticleService, 
        WebConfigService, 
        FlightRouteService, 
        FlighBookingService,
        LuggagePriceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
