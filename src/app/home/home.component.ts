import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { MetadataService } from 'ng2-metadata';
import { AuthService } from '../shared/auth-service';

import { FlightRouteService } from '../admin/flightroute/flightroute.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [
    trigger('takeOffPlace', [
      state('inactive', style({
        display: 'none'
      })),
      state('active', style({
        display: 'block'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger('landPlace', [
      state('inactive', style({
        display: 'none'
      })),
      state('active', style({
        display: 'block'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  showTakeOff = 'inactive';
  showLand = 'inactive';
  dsVung: any[] = [];
  dsVung1: any[] = [];
  dsVung2: any[] = [];
  dsVung3: any[] = [];

  dsVungDest: any[] = [];
  dsVungDest1: any[] = [];
  dsVungDest2: any[] = [];
  dsVungDest3: any[] = [];

  isRoundTrip = false;

  diemDi: any = {};
  diemDen: any = {};

  ngayDi: any = new Date();
  ngayVe: any = new Date();

  adult = 1;
  child = 0;
  infant = 0;

  currentDate = new Date();

  constructor(private metaService: MetadataService,
    private auth: AuthService,
    private router: Router,
    private flightRouteService: FlightRouteService) { }

  ngOnInit() {
    this.getDiemDi();
  }

  get tenDiemDi() {
    if (this.diemDi.Name)
      return this.diemDi.Name + ' (' + this.diemDi.Code + ')';
    else
      return '';
  }

  get tenDiemDen() {
    if (this.diemDen.Name)
      return this.diemDen.Name + ' (' + this.diemDen.Code + ')';
    else
      return '';
  }

  showTakeOffPlace() {
    this.showTakeOff = 'active';
    this.showLand = 'inactive';
  }

  hideTakeOffPlace() {
    setTimeout(_ => {
      this.showTakeOff = 'inactive';
    }, 1000);
  }

  showLandPlace() {
    this.showLand = 'active';
    this.showTakeOff = 'inactive';
  }

  hideLandPlace() {
    setTimeout(_ => {
      this.showLand = 'inactive';
    }, 1000);
  }

  getDiemDi() {
    this.flightRouteService.getListAndGroup().subscribe(resp => {
      this.dsVung = resp;
      this.dsVung1 = this.dsVung.filter(v => v.RegionColumn == 1);
      this.dsVung2 = this.dsVung.filter(v => v.RegionColumn == 2);
      this.dsVung3 = this.dsVung.filter(v => v.RegionColumn == 3);

    });
  }

  chonDiemDi(item) {
    this.diemDi = item;
    this.diemDen = {};
    this.showTakeOff = 'inactive';
    let data = {
      Id: item.Id
    };
    this.flightRouteService.getListDestLocationRoutedAndGroup(data).subscribe(
      resp => {
        this.dsVungDest = resp;
        this.dsVungDest1 = this.dsVungDest.filter(v => v.RegionColumn == 1);
        this.dsVungDest2 = this.dsVungDest.filter(v => v.RegionColumn == 2);
        this.dsVungDest3 = this.dsVungDest.filter(v => v.RegionColumn == 3);
      }
    )
    this.showLandPlace();
  }

  chonDiemDen(diem) {
    this.diemDen = diem;
    this.showLand = 'inactive';
  }
  chonNgayDi() {
    if (this.ngayDi > this.ngayVe)
      this.ngayVe = this.ngayDi;
  }

  timChuyenBay() {
    if (!this.diemDi.Name) {
      this.showTakeOffPlace();
    }
    else if (!this.diemDen.Name) {
      this.showLandPlace();
    }
    else {
      let data = {
        roundTrip: this.isRoundTrip,
        fromPlace: this.diemDi.Code,
        toPlace: this.diemDen.Code,
        idDiemDi: this.diemDi.ApiPlaceId,
        idDiemDen: this.diemDen.ApiPlaceId,
        departDate: this.ngayDi,
        returnDate: this.ngayVe,
        adult: this.adult,
        child: this.child,
        infant: this.infant
      };
      this.auth.FlightSearch = data;
      this.router.navigate(['./tim-chuyen-bay']);
    }
  }
}
