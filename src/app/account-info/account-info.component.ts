import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { AccountInfoService } from './account-info.service';
import { slideInDownAnimation } from '../shared/animations';
import { MdSnackBar } from '@angular/material';

@Component({
    templateUrl: './account-info.component.html',
    styles: [':host { position: relative; width:100%; top: 5%; padding: 10px; }'],
    animations: [slideInDownAnimation],
    providers: [AccountInfoService]
})
export class AccountInfoComponent {
    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.position') position = 'absolute';
    
    constructor(private router: Router,
        public auth: AuthService,
        private accountInfoService: AccountInfoService,
        private snackbar: MdSnackBar) { }

    cancel() {
        this.closePopup();
    }

    closePopup() {
        this.router.navigate([{ outlets: { ev: null } }]);
    }

    save() {
        let data = {
            FullName: this.auth.UserInfo.FullName,
            PhoneNumber: this.auth.UserInfo.PhoneNumber,
            Email: this.auth.UserInfo.Email,
            Address:this.auth.UserInfo.Address
        };
        this.accountInfoService.save(data).subscribe(resp => {  
            if (resp.success)
                this.snackbar.open("Lưu thành công", "", {duration: 1000});
            else
                this.snackbar.open("Lỗi: " + resp.message, "", {duration: 1000});
        });
    }
}
