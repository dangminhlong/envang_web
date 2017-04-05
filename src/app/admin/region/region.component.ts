import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { RegionService } from './region.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html'
})
export class RegionComponent implements OnInit {
  saveType: any = 0;
  saveStatus: any = -1;
  saveStatusMessage: any = "";
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";
  loaderType: any = 0;

  region: any = { Id: 0, Name: "", IsDomestic: true, Column: 1, Order: 1 };

  dsVung: any[] = [];

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(private auth: AuthService,
    private service: RegionService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getDanhSach();
  }

  getDanhSach() {
    this.service.getList().subscribe(resp => {
      this.dsVung = resp;
    });
  }

  showAddNewForm(content) {
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 1;
  }
  close() {
    this.modalRef.close();
  }

  showEditForm(content, item) {
    this.region = item;
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 2;
  }

  get isSaveInvalid() {
    return !this.region.Name.length;
  }

  showDeleteForm(content, item) {
    this.region = item;
    this.confirmType = 1;
    this.confirmMessage = "Bạn có muốn xóa vùng này không ?"
    this.modalRef = this.dialog.open(content);
  }

  save() {
    let data = this.region;
    this.saveStatus = 0;
    this.saveStatusMessage = "Đang lưu...";
    this.service.save(data).subscribe(resp => {
      if (resp.success) {
        this.saveStatus = 1;
        this.saveStatusMessage = "Lưu thành công";
        this.getDanhSach();
      }
      else {
        this.saveStatus = 2;
        this.saveStatusMessage = "Lưu thất bại";
      }
    });
  }

  remove() {
    let data = {
      Id: this.region.Id
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
