import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { EvTimeOnlyPipe, EvTimePipe } from './directives/ev-time.directive';
import { TinyMceDirective2 } from './directives/tinymce.directive';
import { EvDatePickerComponent } from './directives/ev-date-picker';
import { MyDateAdapter } from './tien-ich/my-date-adapter';
import { MaterialModule, MdNativeDateModule, DateAdapter } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Ng2PaginationModule } from 'ng2-pagination';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, MaterialModule, MdNativeDateModule, FlexLayoutModule, Ng2PaginationModule],
    exports: [CommonModule, FormsModule, HttpModule, MaterialModule, MdNativeDateModule, FlexLayoutModule, Ng2PaginationModule, EvTimeOnlyPipe, EvTimePipe, EvDatePickerComponent, TinyMceDirective2],
    declarations: [EvTimeOnlyPipe, EvTimePipe, EvDatePickerComponent, TinyMceDirective2],
    providers: [{ provide: DateAdapter, useClass: MyDateAdapter }],
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
       /* if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }*/
    }
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: []
        };
    }
}
