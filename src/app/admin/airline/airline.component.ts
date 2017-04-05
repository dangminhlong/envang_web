import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { AirlineService } from './airline.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html'
})
export class AirlineComponent implements OnInit {
  saveType: any = 0;
  saveStatus: any = -1;
  saveStatusMessage: any = "";
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";
  loaderType: any = 0;

  airline: any = { Id: 0, Name: "", Code: "" };

  dsAirline: any[] = [];

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(private auth: AuthService,
    private service: AirlineService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getDanhSach();
  }

  getDanhSach() {
    this.service.getList().subscribe(resp => {
      this.dsAirline = resp;
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
    this.airline = item;
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 2;
  }

  get isSaveInvalid() {
    return !this.airline.Name.length || !this.airline.Code.length;
  }

  showDeleteForm(content, item) {
    this.airline = item;
    this.confirmType = 1;
    this.confirmMessage = "Bạn có muốn xóa hãng này không ?"
    this.modalRef = this.dialog.open(content);
  }

  save() {
    let data = this.airline;
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
      Id: this.airline.Id
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
