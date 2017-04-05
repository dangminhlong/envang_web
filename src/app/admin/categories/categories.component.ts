import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { CategoriesService } from './categories.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-articletype',
  templateUrl: './categories.component.html'
})
export class CategoryComponent implements OnInit {
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";

  item: any = { Id: 0, Name: ""};

  dsItem: any[] = [];

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(private auth: AuthService,
    private service: CategoriesService,
    public dialog: MdDialog,
    public snackbar: MdSnackBar) { }

  ngOnInit() {
    this.getDanhSach();
  }

  getDanhSach() {
    this.service.getList().subscribe(resp => {
      this.dsItem = resp;
    });
  }

  showAddNewForm(content) {
    this.modalRef = this.dialog.open(content);
  }
  close() {
    this.modalRef.close();
  }

  showEditForm(content, item) {
    this.item = item;
    this.modalRef = this.dialog.open(content);
  }

  get isSaveInvalid() {
    return !this.item.Name.length;
  }

  showDeleteForm(content, item) {
    this.item = item;
    this.confirmType = 1;
    this.confirmMessage = "Bạn có muốn xóa vùng này không ?"
    this.modalRef = this.dialog.open(content);
  }

  save() {
    this.snackbar.open("Đang lưu...");
    this.loaderMessage = "Đang lưu, xin vui lòng chờ...";
    this.modalRef = this.dialog.open(this.loaderTemplate);
    let data = this.item;
    this.service.save(data).subscribe(resp => {
      if (resp.success) {
        this.modalRef.close();
        this.snackbar.open("Lưu thành công", "", {duration:1000});
        this.getDanhSach();
      }
      else {
        this.snackbar.open("Lưu thất bại. Xin vui lòng thực hiện lại","", {duration: 1000});
      }
    });
  }

  remove() {
    let data = {
      Id: this.item.Id
    };
    this.modalRef.close();
    this.snackbar.open("Đang lưu...");
    this.loaderMessage = "Đang xóa, xin vui lòng chờ...";
    this.modalRef = this.dialog.open(this.loaderTemplate);
    this.service.remove(data).subscribe(resp => {
      if (resp.success) {
        this.modalRef.close();
        this.snackbar.open("Xóa thành công", "", {duration:1000});
        this.getDanhSach();
      }
      else {
        this.snackbar.open("Xóa thất bại. Xin vui lòng thực hiện lại","", {duration: 1000});
      }
    });
  }
}
