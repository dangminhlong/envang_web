import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MetadataModule } from 'ng2-metadata';
import { EvTimePipe, EvTimeOnlyPipe } from './directives/ev-time.directive';
import { AppComponent } from './app.component';
import { routes, components } from './app.routes';
import { AuthService } from './shared/auth-service';
import { ViewArticleService } from './shared/viewarticle.service';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import {Ng2PaginationModule} from 'ng2-pagination';

import { DatepickerModule } from './angular2-material-datepicker/datepicker.module';

import { WebConfigService } from './admin/webconfig/web-config.service';
import { FlighBookingService } from './flight-booking/flight-booking.service';
import { FlightRouteService } from './admin/flightroute/flightroute.service';
import { LuggagePriceService } from './admin/luggage-price/luggage-price.service';

import 'hammerjs';

@NgModule({
    declarations: [
        AppComponent, EvTimePipe, EvTimeOnlyPipe,
        ...components
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        Ng2PaginationModule,
        DatepickerModule,
        RouterModule.forRoot(routes, { useHash: true }),
        MetadataModule.forRoot(),
        MaterialModule.forRoot(),
        FlexLayoutModule.forRoot()
    ],
    providers: [AuthService, 
        ViewArticleService, 
        WebConfigService, 
        FlightRouteService, 
        FlighBookingService,
        LuggagePriceService],
    bootstrap: [AppComponent]
})
export class AppModule { }
