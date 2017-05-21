import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { FlightRouteService } from './flightroute.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-flightroute',
  templateUrl: './flightroute.component.html'
})
export class FlightRouteComponent implements OnInit {
  loaderMessage: any = "";
  loaderType: any = 0;

  dsVung: any[] = [];
  dsVungDest: any[] = [];
  dsVungDest1: any[] = [];
  dsVungDest2: any[] = [];
  dsVungDest3: any[] = [];

  diemChon: any = {};

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(public auth: AuthService,
    private service: FlightRouteService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getVung();
  }

  getVung() {
    this.service.getListAndGroup().subscribe(resp => {
      this.dsVung = resp;
    });
  }

  selectLocation(item) {
    this.diemChon = item;
    let data = {
      Id: item.Id
    };
    this.service.getListDestLocationAndGroup(data).subscribe(
      resp => {
        this.dsVungDest = resp;
        this.dsVungDest1 = this.dsVungDest.filter(v => v.RegionColumn == 1);
        this.dsVungDest2 = this.dsVungDest.filter(v => v.RegionColumn == 2);
        this.dsVungDest3 = this.dsVungDest.filter(v => v.RegionColumn == 3);
      }
    )
  }
  save() {
    this.loaderType = 0;
    this.loaderMessage = "Đang lưu";
    let dsId = [];
    this.dsVungDest.forEach(vung => {
      vung.LocationList.forEach(diem => {
        if (diem.Routed) {
          dsId.push(diem.Id);
        }
      });
    });
    let data = {
      SourceId: this.diemChon.Id,
      DestIdList: dsId
    };
    this.modalRef = this.dialog.open(this.loaderTemplate);
    this.service.save(data).subscribe(resp => {
      if (resp.success) {
        this.loaderType = 1;
        this.loaderMessage = "Lưu thành công";
      }
      else {
        this.loaderType = 2;
        this.loaderMessage = "Lưu thất bại";
      }
    });
  }

}
