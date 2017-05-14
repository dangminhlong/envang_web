import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Config } from '../shared/config'
import { MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../shared/auth-service';
import { FlighBookingService } from './flight-booking.service';
import { FlightRouteService } from '../admin/flightroute/flightroute.service';
import { LuggagePriceService } from '../admin/luggage-price/luggage-price.service';

@Component({
    selector: 'ev-flight-booking',
    templateUrl: './flight-booking.component.html',
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
export class FlightBookingComponent implements OnInit {
    item: any = {};
    apiUrl = Config.apiUrl;
    searchData: any = { roundTrip: false, adult: 1, child: 0, infant: 0 };

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

    currentDate: any = new Date();
    showCalendar: boolean = false;
    showCalendarReturn: boolean = false;

    adult = 1;
    child = 0;
    infant = 0;

    step = 1;
    searching = false;

    searchResult: any[] = [];
    searchResultReturn: any[] = [];

    searchResultFilter: any[] = [];
    searchResultReturnFilter: any[] = [];

    orderType: any = 1;
    orderTypeReturn: any = 1;

    priceType: any = 1;
    priceTypeReturn: any = 1;

    chieuDi: any = {};
    chieuVe: any = {};
    flightDataChoosen: any = {};
    luggagePriceList: any[] = [];
    returnLuggagePriceList: any[] = [];

    contact: any = {};

    payment: any = 0;

    genderList: any[] = [{ Value: "1", Text: "Nam" }, { Value: "2", Text: "Nữ" }];

    AirlineList: any[] = [{ Airline: "VietnamAirlines", Code: "VNA", selected: true }, { Airline: "VietJetAir", Code: "VIETJET", selected: true }, { Airline: "JetStar", Code:"JETSTAR", selected: true }];

    constructor(private service: FlighBookingService,
        private flightRouteService: FlightRouteService,
        private luggagePriceService: LuggagePriceService,
        private snackBar: MdSnackBar,
        private auth: AuthService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.currentDate = new Date();
        this.ngayDi.setDate(this.ngayDi.getDate() + 1);
        this.ngayVe.setDate(this.ngayVe.getDate() + 2);
        if (this.auth.FlightSearch) {
            this.searchData = this.auth.FlightSearch;
            this.searchFlight(this.searchData.fromPlace, this.searchData.toPlace, this.searchData.departDate, this.searchData.returnDate, this.searchData.idDiemDi, this.searchData.idDiemDen);
            this.getDiemDi();
        }
        else {
            this.getDiemDi();
        }
        if (this.auth.IsLoggedIn) {
            this.contact.HoTen = this.auth.UserInfo.FullName;
            this.contact.DienThoai = this.auth.UserInfo.PhoneNumber;
            this.contact.Email = this.auth.UserInfo.Email;
            this.contact.DiaChi = this.auth.UserInfo.Address;
        }
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

            if (this.searchData.fromPlace) {
                for (let i = 0; i < this.dsVung.length; i++) {
                    let v = this.dsVung[i];
                    let found = false;
                    for (let j = 0; j < v.LocationList.length; j++) {
                        var place = v.LocationList[j];
                        if (place.Code == this.searchData.fromPlace) {
                            found = true;
                            this.diemDi = place;
                            break;
                        }
                    }
                    if (found) {
                        break;
                    }
                }

                this.loadDiemDen(this.diemDi);
            }
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

    loadDiemDen(diemDi) {
        let data = {
            Id: diemDi.Id
        };
        this.flightRouteService.getListDestLocationRoutedAndGroup(data).subscribe(
            resp => {
                this.dsVungDest = resp;
                this.dsVungDest1 = this.dsVungDest.filter(v => v.RegionColumn == 1);
                this.dsVungDest2 = this.dsVungDest.filter(v => v.RegionColumn == 2);
                this.dsVungDest3 = this.dsVungDest.filter(v => v.RegionColumn == 3);

                if (this.searchData.fromPlace) {
                    for (let i = 0; i < this.dsVungDest.length; i++) {
                        let v = this.dsVungDest[i];
                        let found = false;
                        for (let j = 0; j < v.LocationList.length; j++) {
                            var place = v.LocationList[j];
                            if (place.Code == this.searchData.toPlace) {
                                found = true;
                                this.diemDen = place;
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                }
            });
    }

    chonDiemDen(diem) {
        this.diemDen = diem;
        this.showLand = 'inactive';
        this.showCalendar = true;
    }

    chonNgayDi() {
        if (this.ngayDi > this.ngayVe)
            this.ngayVe = this.ngayDi;
        if (this.searchData.roundTrip)
            this.showCalendarReturn = true;

    }

    timChuyenBay() {
        this.searchFlight(this.diemDi.Code, this.diemDen.Code, this.ngayDi, this.ngayVe, this.diemDi.ApiPlaceId, this.diemDen.ApiPlaceId);
    }

    searchFlight(maDiemDi, maDiemDen, ngayDi, ngayVe, idDiemDi, idDiemDen) {
        this.searchData.fromPlace = maDiemDi;
        this.searchData.toPlace = maDiemDen;
        this.searchData.idDiemDi = idDiemDi;
        this.searchData.idDiemDen = idDiemDen;
        this.searchData.departDate = this.normalizeDate(this.ngayDi);
        this.searchData.returnDate = this.normalizeDate(this.ngayVe);

        this.flightDataChoosen = {
            RoundTrip: this.searchData.roundTrip,
            FromPlaceCode: this.searchData.fromPlace,
            ToPlaceCode: this.searchData.toPlace,
            DepartDate: this.searchData.departDate,
            ReturnDate: this.searchData.returnDate,
            Adult: [],
            Child: [],
            Infant: []
        };

        this.searching = true;
        this.service.findFlights(this.searchData).subscribe(resp => {
            this.searchResult = resp.DepartureList;
            this.searchResultReturn = resp.ReturnList;
            this.searchResultFilter = resp.DepartureList;
            this.searchResultReturnFilter = resp.ReturnList;
            this.searching = false;
            this.orderSearchResult();
            this.orderSearchResultReturn();
        });
    }

    orderSearchResult() {
        this.searchResultFilter = this.searchResultFilter.sort((v1, v2) => {
            if (this.orderType == 1)
                return parseInt(v1.TicketPrice) - parseInt(v2.TicketPrice);
            else if (this.orderType == 2) {
                return Number(v1.DepartureTime) - Number(v2.DepartureTime);
            }
            else {
                return Number(v1.ArrivalTime) - Number(v2.ArrivalTime);
            }
        });
    }

    orderSearchResultReturn() {
        this.searchResultReturnFilter = this.searchResultReturnFilter.sort((v1, v2) => {
            if (this.orderTypeReturn == 1)
                return parseInt(v1.TicketPrice) - parseInt(v2.TicketPrice);
            else if (this.orderTypeReturn == 2) {
                return Number(v1.DepartureTime) - Number(v2.DepartureTime);
            }
            else {
                return Number(v1.ArrivalTime) - Number(v2.ArrivalTime);
            }
        });
    }

    getLuggagePrice(brand) {
        let promise = new Promise((resolve, reject) => {
            let data = {
                AirlineCode: brand
            };
            this.luggagePriceService.getListByAirlineCode(data).subscribe(resp => {
                this.luggagePriceList = resp;
                resolve();
            });
        });
        return promise;
    }

    getReturnLuggagePrice(brand) {
        let data = {
            AirlineCode: brand
        };
        this.luggagePriceService.getListByAirlineCode(data).subscribe(resp => {
            this.returnLuggagePriceList = resp;
        });
    }

    selectDepartFlight(item) {
        this.chieuDi = item;
        this.getLuggagePrice(item.Brand);
        this.flightDataChoosen.ChieuDi = item;
        if (this.flightDataChoosen.Adult && !this.flightDataChoosen.Adult.length) {
            for (let i = 0; i < this.searchData.adult; i++) {
                this.flightDataChoosen.Adult.push({ PassengerType: 0, Title: "", Gender: "0", Baggage: 0, ReturnBaggage: 0 });
            }
        }
        if (this.flightDataChoosen.Child && !this.flightDataChoosen.Child.length) {
            for (let i = 0; i < this.searchData.child; i++) {
                this.flightDataChoosen.Child.push({ PassengerType: 1, Title: "", Gender: "0", Baggage: 0, ReturnBaggage: 0 });
            }
        }
        if (this.flightDataChoosen.Infant && !this.flightDataChoosen.Infant.length) {
            for (let i = 0; i < this.searchData.infant; i++) {
                this.flightDataChoosen.Infant.push({ PassengerType: 2, Title: "", Gender: "0", Baggage: 0, ReturnBaggage: 0 });
            }
        }

        this.step = 2;

    }

    tiepTucKhuHoi() {
        this.getLuggagePrice(this.chieuDi.Brand).then(_ => {
            if (this.searchData.roundTrip){
                if (this.chieuDi.Brand != this.chieuVe.Brand) {
                    this.getReturnLuggagePrice(this.chieuVe.Brand);
                }
                else {
                    this.returnLuggagePriceList = this.luggagePriceList;
                }
            }
        });

        this.flightDataChoosen.ChieuDi = this.chieuDi;
        if (this.searchData.roundTrip)
            this.flightDataChoosen.ChieuVe = this.chieuVe;
        else 
            this.flightDataChoosen.ChieuVe = null;
        if (this.flightDataChoosen.Adult && !this.flightDataChoosen.Adult.length) {
            for (let i = 0; i < this.searchData.adult; i++) {
                this.flightDataChoosen.Adult.push({ PassengerType: 0, Title: "", Gender: "0", Baggage: 0, ReturnBaggage: 0 });
            }
        }
        if (this.flightDataChoosen.Child && !this.flightDataChoosen.Child.length) {
            for (let i = 0; i < this.searchData.child; i++) {
                this.flightDataChoosen.Child.push({ PassengerType: 1, Title: "", Gender: "0", Baggage: 0, ReturnBaggage: 0 });
            }
        }
        if (this.flightDataChoosen.Infant && !this.flightDataChoosen.Infant.length) {
            for (let i = 0; i < this.searchData.infant; i++) {
                this.flightDataChoosen.Infant.push({ PassengerType: 2, Title: "", Gender: "0", Baggage: 0, ReturnBaggage: 0 });
            }
        }
        this.step = 2;
    }

    chonChieuDi(item) {
        this.chieuDi = item;
    }

    chonChieuVe(item) {
        this.chieuVe = item;
    }

    filterAirline() {
        let selectedAirlines = this.AirlineList.filter(v => v.selected).map(v => v.Code);
        this.searchResultFilter = this.searchResult.filter(function (v) {
            return selectedAirlines.indexOf(v.Airline) >= 0;
        });
        this.searchResultReturnFilter = this.searchResultReturn.filter(function (v) {
            return selectedAirlines.indexOf(v.Airline) >= 0;
        });
        this.orderSearchResult();
    }
    choosePaymentMethod() {
        if (this.flightDataChoosen.Adult.length == 0 && this.flightDataChoosen.Child.length == 0) {
            this.snackBar.open("Xin vui lòng chọn khách hàng", "", { duration: 1000 });
            return;
        }

        let nameCorrect = true;
        let titleCorrect = true;
        this.flightDataChoosen.Adult.forEach((v) => {
            if (!v.Title || v.Title == "") titleCorrect = false;
            if (!v.FullName || !v.FullName.length || v.FullName.split(" ").length < 2) nameCorrect = false;
        });
        this.flightDataChoosen.Child.forEach((v) => {
            if (!v.Title || v.Title == "") titleCorrect = false;
            if (!v.FullName || !v.FullName.length || v.FullName.split(" ").length < 2) nameCorrect = false;
        });
        this.flightDataChoosen.Infant.forEach((v) => {
            if (!v.Title || v.Title == "") titleCorrect = false;
            if (!v.FullName || !v.FullName.length || v.FullName.split(" ").length < 2) nameCorrect = false;
        });
        if (!nameCorrect) {
            this.snackBar.open("Xin vui lòng nhập đúng tên khách hàng", "", { duration: 1000 });
            return;
        }
        if (!titleCorrect) {
            this.snackBar.open("Xin vui lòng chọn bí danh khách hàng", "", { duration: 1000 });
            return;
        }

        if (!this.contact.HoTen || !this.contact.HoTen.length
            || !this.contact.DienThoai || !this.contact.DienThoai.length
            || !this.contact.Email || !this.contact.Email.length
            || !this.contact.DiaChi || !this.contact.DiaChi.length) {
            this.snackBar.open("Xin vui lòng nhập đầy đủ thông tin liên hệ", "", { duration: 1000 });
            return;
        }

        this.step = this.step + 1;
    }
    bookTicket() {
        this.flightDataChoosen.Contact = this.contact;
        this.flightDataChoosen.Adult.forEach((v) => {
            let arNames = v.FullName.split(" ");
            let firstName = arNames[arNames.length - 1];
            let lastName = arNames[0];
            let middleName = "";
            for (let i = 1; i < arNames.length - 1; i++)
                middleName = middleName + " " + arNames[i];
            v.FirstName = firstName.trim();
            v.LastName = lastName.trim();
            v.MiddleName = middleName.trim();
        });
        this.flightDataChoosen.Child.forEach((v) => {
            let arNames = v.FullName.split(" ");
            let firstName = arNames[arNames.length - 1];
            let lastName = arNames[0];
            let middleName = "";
            for (let i = 1; i < arNames.length - 1; i++)
                middleName = middleName + " " + arNames[i];
            v.FirstName = firstName.trim();
            v.LastName = lastName.trim();
            v.MiddleName = middleName.trim();
        });
        this.flightDataChoosen.Infant.forEach((v) => {
            let arNames = v.FullName.split(" ");
            let firstName = arNames[arNames.length - 1];
            let lastName = arNames[0];
            let middleName = "";
            for (let i = 1; i < arNames.length - 1; i++)
                middleName = middleName + " " + arNames[i];
            v.FirstName = firstName.trim();
            v.LastName = lastName.trim();
            v.MiddleName = middleName.trim();
        });
        this.service.bookflight(this.flightDataChoosen).subscribe(
            resp => {
                console.log(resp);
            },
            err => {
                console.log(err);
            }
        )
    }

    get ChiPhiHanhLy() {
        let adultBaggage = this.flightDataChoosen.Adult.filter(v => v.Baggage > 0);
        let childBaggage = this.flightDataChoosen.Child.filter(v => v.Baggage > 0);
        let adultReturnBaggage = this.flightDataChoosen.Adult.filter(v => v.ReturnBaggage > 0);
        let childReturnBaggage = this.flightDataChoosen.Child.filter(v => v.ReturnBaggage > 0);

        let chiphi = 0;
        if (adultBaggage.length) {
            adultBaggage.forEach(v => {
                this.luggagePriceList.forEach(p => {
                    if (p.Weight == v.Baggage) {
                        chiphi += p.Price;
                    }
                });
            });
        }
        if (childBaggage.length) {
            childBaggage.forEach(v => {
                this.luggagePriceList.forEach(p => {
                    if (p.Weight == v.Baggage) {
                        chiphi += p.Price;
                    }
                });
            });
        }
        if (adultReturnBaggage.length) {
            adultReturnBaggage.forEach(v => {
                this.returnLuggagePriceList.forEach(p => {
                    if (p.Weight == v.Baggage) {
                        chiphi += p.Price;
                    }
                });
            });
        }
        if (childReturnBaggage.length) {
            childReturnBaggage.forEach(v => {
                this.returnLuggagePriceList.forEach(p => {
                    if (p.Weight == v.Baggage) {
                        chiphi += p.Price;
                    }
                });
            });
        }
        return chiphi;
    }

    get TongKhuHoi() {

        if (this.chieuDi.TicketPrice && this.chieuVe.TicketPrice)
            return parseInt(this.chieuDi.TicketPrice) + parseInt(this.chieuVe.TicketPrice);
        else if (this.chieuDi.TicketPrice)
            return parseInt(this.chieuDi.TicketPrice);
        else if (this.chieuVe.TicketPrice)
            return parseInt(this.chieuVe.TicketPrice);
        else return 0;
    }

    getTimePart(jsonTime) {
        let arTime = jsonTime.split("T")[1].split(":");
        return arTime[0] + ":" + arTime[1];
    }

    normalizeDate(d: Date) {
        let n = d.getFullYear();
        let t = d.getMonth() + 1;
        let ng = d.getDate();
        return n + '-' + ('0' + t).slice(-2) + '-' + ('0' + ng).slice(-2) + 'T00:00:00.000';
    }
}