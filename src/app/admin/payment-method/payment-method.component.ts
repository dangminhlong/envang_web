import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { PaymentMethodService } from './payment-method.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-paymentmethod',
  templateUrl: './payment-method.component.html'
})
export class paymentmethodComponent implements OnInit {
  saveType: any = 0;
  saveStatus: any = -1;
  saveStatusMessage: any = "";
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";
  loaderType: any = 0;
  editMode :any = false;

  item: any = { Id: 0, Name: "", Description: "", AllowResponseFromCustomer: false };

  dsItem: any[] = [];

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(public auth: AuthService,
    private service: PaymentMethodService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getDanhSach();
  }

  getDanhSach() {
    this.service.getList().subscribe(resp => {
      this.dsItem = resp;
    });
  }

  showAddNewForm() {
    this.item = { Id: 0, Name: "", Description: "", AllowResponseFromCustomer: false };
    this.editMode = true;
  }
  close() {
    this.modalRef.close();
  }

  showEditForm(item) {
    this.item = item;
    this.editMode = true;
  }

  get isSaveInvalid() {
    return !this.item.Name.length || !this.item.Description.length;
  }

  showDeleteForm(content, item) {
    this.item = item;
    this.confirmType = 1;
    this.confirmMessage = "Bạn có muốn xóa dữ liệu này không ?"
    this.modalRef = this.dialog.open(content);
  }

  save() {
    let data = this.item;
    this.loaderType = 0;
    this.loaderMessage = "Đang xử lý...";
    this.modalRef = this.dialog.open(this.loaderTemplate);
    this.service.save(data).subscribe(resp => {
      if (resp.success) {
        this.loaderType = 1;
        this.loaderMessage = "Lưu thành công";
        this.getDanhSach();
      }
      else {
        this.loaderType = 2;
        this.loaderMessage = "Lưu thất bại";
      }
    });
  }

  remove() {
    let data = {
      Id: this.item.Id
    };
    this.modalRef.close();
    this.loaderType = 0;
    this.loaderMessage = "Đang xử lý...";
    this.modalRef = this.dialog.open(this.loaderTemplate);
    this.service.remove(data).subscribe(resp => {
      if (resp.success) {
        this.modalRef.close();
        this.getDanhSach();
      }
      else {
        this.loaderType = 1;
        this.loaderMessage = resp.message;
      }
    });
  }
}
