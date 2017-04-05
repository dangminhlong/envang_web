import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { LoginService } from './login.service';
import { slideInDownAnimation } from '../shared/animations';

@Component({
    templateUrl: './login.component.html',
    styles: [':host { position: relative; width:100%; top: 5%; padding: 10px; }'],
    animations: [slideInDownAnimation],
    providers: [LoginService]
})
export class LoginComponent {
    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.position') position = 'absolute';
    
    constructor(private router: Router,
        private auth: AuthService,
        private loginService: LoginService) { }

    cancel() {
        this.closePopup();
    }

    closePopup() {
        this.router.navigate([{ outlets: { ev: null } }]);
    }

    login(username, password) {
        this.loginService.login(username, password).subscribe(resp => {
            let token = resp.access_token;
            localStorage.setItem("evtoken", resp.access_token);
            this.loginService.getUserInfo().subscribe(info => {
                this.auth.IsLoggedIn = true;
                this.auth.UserInfo = info;
                localStorage.setItem("evUserInfo", JSON.stringify(info));
            });
            this.cancel();
        });
    }
}
