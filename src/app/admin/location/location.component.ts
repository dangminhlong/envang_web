import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { RegionService } from '../region/region.service';
import { LocationService } from './location.service'
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {
  saveType: any = 0;
  saveStatus: any = -1;
  saveStatusMessage: any = "";
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";
  loaderType: any = 0;

  item: any = {Id: 0, Name: "", RegionId: 0, Order: 1};
  dsItem: any[] = [];

  vung: any = 0;
  dsVung: any[] = [];
  

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(public auth: AuthService,
    private service: LocationService,
    private regionService: RegionService,
    public dialog: MdDialog,
    public snackbar: MdSnackBar) { }

  ngOnInit() {
    this.getVung();
    this.getDanhSach();
  }

  getVung(){
    this.regionService.getList().subscribe(resp=>{
      this.dsVung = resp;
    });
  }

  getDanhSach() {
    var data = {
      RegionId: this.vung
    };
    this.service.getList(data).subscribe(resp => {
      this.dsItem = resp;
    });
  }

  showAddNewForm(content) {
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 1;
    this.vung = 0;
    this.item = {Id: 0, Name: "", RegionId: 0};
  }
  close() {
    this.modalRef.close();
  }

  showEditForm(content, item) {
    this.item = item;
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 2;
  }

  get isSaveInvalid() {
    return !this.item.Name.length || !this.item.RegionId;
  }

  showDeleteForm(content, item) {
    this.item = item;
    this.confirmType = 1;
    this.confirmMessage = "Bạn có muốn xóa điểm này không ?"
    this.modalRef = this.dialog.open(content);
  }

  save() {
    let data = this.item;
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
