import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from '../roles/role.service';
import { UsersService } from './users.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    usernameSearch: any = "";
    searchRoleId: any = "0";
    dsRole: any[] = [];
    user: any = { UserName: "", FullName: "" };
    selectedUser: any = {};
    dsUser: any[] = [];
    saveType: any = 0;
    saveStatus: any = -1;
    saveStatusMessage: any = "";
    confirmType: any = 0;
    confirmMessage: any = "";
    loaderMessage: any = "";
    loaderType: any = 0;

    modalRef: MdDialogRef<any>;

    @ViewChild("loaderTemplate") loaderTemplate;
    
    constructor(private roleService: RolesService,
        private userService: UsersService,
        public dialog: MdDialog) { }

    ngOnInit() {
        this.getDsRoles();
        this.getDsUser();
    }

    searchUser() {
        this.getDsUser();
    }

    getDsRoles() {
        this.roleService.getList().subscribe(resp => {
            this.dsRole = resp;
        });
    }
    getDsUser() {
        let data = {
            RoleId: this.searchRoleId,
            UserName: this.usernameSearch
        };
        this.userService.getList(data).subscribe(resp => {
            this.dsUser = resp;
        });
    }
    showAddUserForm(event, content) {
        this.modalRef =  this.dialog.open(content);
        this.saveStatus = -1;
        this.saveType = 1;
    }
    close() {
        this.modalRef.close();
    }

    showEditUserForm(event, content, item) {
        this.modalRef = this.dialog.open(content);
        this.saveStatus = -1;
        this.saveType = 2;
        this.user.UserName = item.UserName,
        this.user.Email = item.Email;
        this.user.PhoneNumber = item.PhoneNumber;
        this.user.FullName = item.FullName ? item.FullName : '';
        this.user.Address = item.Address;
        this.user.RoleName = item.RoleName;
    }

    get isSaveValid() {
        return !this.user.UserName.length
            || !this.user.FullName.length
            || !this.user.RoleName;
    }

    saveUser() {
        this.saveStatus = 0;
        let data = {
            UserName: this.user.UserName,
            FullName: this.user.FullName,
            Address: this.user.Address,
            Email : this.user.Email,
            PhoneNumber: this.user.PhoneNumber,
            RoleName: this.user.RoleName,
            SaveType: this.saveType
        };
        this.userService.saveUser(data).subscribe(resp => {
            if (resp.success) {
                this.saveStatus = 1;
                this.saveStatusMessage = resp.message;
                this.getDsUser();
            }
            else {
                this.saveStatus = 2;
                this.saveStatusMessage = resp.message;
            }
        });
    }

    showRemoveUserForm(event, content, item) {
        this.selectedUser = item;
        this.confirmType = 1;
        this.confirmMessage = "Bạn có muốn xóa người dùng này không ?"
        this.modalRef = this.dialog.open(content);
    }

    removeUser() {
        let data = {
            UserName: this.selectedUser.UserName
        };
        this.modalRef.close();
        this.loaderType = 0;
        this.loaderMessage = "Đang xử lý...";
        this.modalRef = this.dialog.open(this.loaderTemplate);
        this.userService.removeUser(data).subscribe(resp => {
            if (resp.success) {
                this.modalRef.close();
                this.getDsUser();
            }
            else {
                this.loaderType = 1;
                this.loaderMessage = resp.message;
            }
        });
    }

    showResetPasswordForm(event, content, item) {
        this.selectedUser = item;
        this.modalRef = this.dialog.open(content);
    }

    resetPassword() {
        let data = {
            UserName: this.selectedUser.UserName,
            Password: this.selectedUser.Password
        };
        this.modalRef.close();
        this.loaderType = 0;
        this.loaderMessage = "Đang xử lý...";
        this.modalRef = this.dialog.open(this.loaderTemplate);
        this.userService.resetPassword(data).subscribe(resp => {
            if (resp.success) {
                this.modalRef.close();
            }
            else {
                this.loaderType = 1;
                this.loaderMessage = resp.message;
            }
        });
    }
}
