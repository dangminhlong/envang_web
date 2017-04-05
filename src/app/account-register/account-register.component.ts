import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { AccountRegisterService } from './account-register.service';
import { slideInDownAnimation } from '../shared/animations';
import { MdSnackBar } from '@angular/material';

@Component({
    templateUrl: './account-register.component.html',
    styles: [':host { position: relative; width:100%; top: 5%; padding: 10px; }'],
    animations: [slideInDownAnimation],
    providers: [AccountRegisterService]
})
export class AccountRegisterComponent {
    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.position') position = 'absolute';
    
    constructor(private router: Router,
        private auth: AuthService,
        private accountRegisterService: AccountRegisterService,
        private snackbar: MdSnackBar) { }

    cancel() {
        this.closePopup();
    }

    closePopup() {
        this.router.navigate([{ outlets: { ev: null } }]);
    }

    save() {
        let data = this.auth.UserInfo;
        this.accountRegisterService.save(data).subscribe(resp => {  
            if (resp.success)
                this.snackbar.open("Lưu thành công", "", {duration: 1000});
            else
                this.snackbar.open("Lưu lỗi, xin vui lòng thực hiện lại sau", "", {duration: 1000});
            this.cancel();
        });
    }
}
