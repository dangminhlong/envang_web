import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { MetadataService } from 'ng2-metadata';
import { AuthService } from '../shared/auth-service';

import { FlightRouteService } from '../admin/flightroute/flightroute.service';
import { MdDatepicker } from '@angular/material';

import { ArticlesService } from '../admin/articles/articles.service';

import { Config } from '../shared/config';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ArticlesService],
  animations: [
    trigger("state", [
      state("inactive", style({
        position: "absolute",
        transform: 'translateX(100%)',
        display: "none"
      })),
      state("active", style({
        display: 'block',
        position: "absolute",
        opacity: '1',
        transform: 'translateX(0%)'
      })),
      state("ready", style({
        display: 'block',
        position: "absolute",
        opacity: '0',
        transform: 'translateX(100%)'
      })),
      transition('ready=>active', animate('900ms ease-in')),
      transition('active=>inactive', animate('900ms ease-in'))
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

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

  apiUrl = Config.apiUrl;
  dsBaiViet: any[] = [];

  articleSubscription: Subscription;
  currentArticle = 0;
  nextArticle = 0;

  @ViewChild("mdDatePickerNgayDi") mdDatePickerNgayDi: MdDatepicker<Date>;
  @ViewChild("mdDatePickerNgayVe") mdDatePickerNgayVe: MdDatepicker<Date>;

  constructor(private metaService: MetadataService,
    private auth: AuthService,
    private router: Router,
    private articleService: ArticlesService,
    private flightRouteService: FlightRouteService) { }

  ngOnInit() {
    this.getDiemDi();
    this.getArticleForHome();
    this.articleSubscription = Observable.interval(8000).subscribe(resp => {
      if (this.currentArticle < this.dsBaiViet.length)
        this.dsBaiViet[this.currentArticle].state = 'inactive';
      this.currentArticle++;
      if (this.currentArticle >= this.dsBaiViet.length)
        this.currentArticle = 0;
      this.dsBaiViet[this.currentArticle].state = 'active';
      this.nextArticle = this.currentArticle + 1;
      if (this.nextArticle >= this.dsBaiViet.length)
        this.nextArticle = 0;
      if (this.nextArticle != this.currentArticle) {
        this.dsBaiViet[this.nextArticle].state = 'ready';
      }

    });
  }

  ngOnDestroy() {
    this.articleSubscription.unsubscribe();
    this.articleSubscription.remove(this.articleSubscription);
  }

  getArticleForHome() {
    this.articleService.getHomeList().subscribe(
      resp => {
        this.dsBaiViet = resp;
        this.dsBaiViet.forEach(a => {
          a.state = 'inactive';
        });
        if (this.dsBaiViet.length > 0)
        {
          this.currentArticle = 0;
          this.dsBaiViet[this.currentArticle].state = "active";
          if (this.currentArticle + 1 < this.dsBaiViet.length)
            this.dsBaiViet[this.currentArticle + 1].state = "ready";
        }
      }
    );
  }

  get tenDiemDi() {
    if (this.diemDi.Name)
      return this.diemDi.Name + ' (' + this.diemDi.Code + ')';
    else
      return 'Chọn nơi đi';
  }

  get tenDiemDen() {
    if (this.diemDen.Name)
      return this.diemDen.Name + ' (' + this.diemDen.Code + ')';
    else
      return 'Chọn nơi đến';
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
    if (!this.diemDi.Name) {
      this.showTakeOffPlace();
    }
    else {
      this.showLand = 'active';
      this.showTakeOff = 'inactive';
    }
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

    this.mdDatePickerNgayDi.open();
  }
  chonNgayDi() {
    if (this.ngayDi > this.ngayVe)
      this.ngayVe = this.ngayDi;
    if (this.isRoundTrip) {
      this.mdDatePickerNgayVe.open();
    }
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
        fromPlaceId: this.diemDi.Id,
        toPlaceId: this.diemDen.Id,
        departDate: this.ngayDi,
        returnDate: this.ngayVe,
        adult: this.adult,
        child: this.child,
        infant: this.infant
      };
      this.auth.FlightSearch = data;
      this.router.navigate(['./dat-ve']);
    }
  }
}
