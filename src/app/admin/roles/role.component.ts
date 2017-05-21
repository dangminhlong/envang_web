import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from './role.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AuthService } from '../../shared/auth-service';
@Component({
    selector: 'app-role',
    templateUrl: './role.component.html'
})
export class RoleComponent implements OnInit {
    loaderMessage: any = "";
    loaderType: any = 0;

    dsRole: any[] = [];
    selectedRole: any = {};

    dsRolePages: any[] = [];

    @ViewChild("loaderTemplate") loaderTemplate;
    
    constructor(public auth: AuthService,
        private roleService: RolesService,
        public dialog: MdDialog) { }

    ngOnInit() {
        this.getDsRoles();
    }
    
    getDsRoles() {
        this.roleService.getList().subscribe(resp => {
            this.dsRole = resp;
        });
    }

    getDsRolePages(role) {
        this.selectedRole = role;
        let data = {
            RoleId: role.Id
        };
        this.roleService.getListRolePages(data).subscribe(resp => {
            this.dsRolePages = resp;
        });
    }

    saveRolePages() {
        let pageList = this.dsRolePages.filter(val => val.HasRight).map(val => val.Id);
        let data = {
            RoleId: this.selectedRole.Id,
            PageIdList: pageList
        };
        this.loaderType = 0;
        this.loaderMessage = "Đang lưu...";
        let modalRef = this.dialog.open(this.loaderTemplate);
        this.roleService.savePageRoles(data).subscribe(resp => {
            if (resp.success) {
                setTimeout(_ => {
                    modalRef.close();
                }, 2000);                
            }
        });
    }
}
