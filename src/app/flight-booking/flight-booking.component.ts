import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Config } from '../shared/config'
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../shared/auth-service';
import { FlighBookingService } from './flight-booking.service';
import { FlightRouteService } from '../admin/flightroute/flightroute.service';
import { LuggagePriceService } from '../admin/luggage-price/luggage-price.service';
import { AirlineService } from '../admin/airline/airline.service';
import { PaymentMethodService } from '../admin/payment-method/payment-method.service';
import { MdDatepicker } from '@angular/material';

@Component({
    selector: 'ev-flight-booking',
    templateUrl: './flight-booking.component.html',
    providers: [AirlineService, PaymentMethodService]
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
    booking = false;

    searchResult: any[] = [];
    searchResultReturn: any[] = [];

    searchResultFilter: any[] = [];
    searchResultReturnFilter: any[] = [];

    orderType: any = 1;
    orderTypeReturn: any = 1;

    priceType: any = 1;
    priceTypeReturn: any = 1;

    veChon: any = {};
    airlineChon: any = {};
    chieuDi: any = {};
    chieuVe: any = {};
    flightDataChoosen: any = {};
    luggagePriceList: any[] = [];
    returnLuggagePriceList: any[] = [];

    contact: any = {};

    paymentMethodChon = { Id: 0 };
    paymentMethodList: any[] = [];

    showChieuDi = true;
    showChieuVe = true;

    genderList: any[] = [{ Value: "1", Text: "Nam" }, { Value: "2", Text: "Nữ" }];

    AirlineList: any[] = [{ Name: "VietnamAirlines", Code: "VNA", selected: true }, { Name: "VietJetAir", Code: "VIETJET", selected: true }, { Name: "JetStar", Code: "JETSTAR", selected: true }];

    orderResult: any = {};

    xuatHoaDon = false;
    thongTinXuatHoaDon = "";
    soDienThoaiNguoiGioiThieu = "";

    @ViewChild("detailTemplate") detailTemplate;
    @ViewChild("mdDatePickerNgayDi") mdDatePickerNgayDi: MdDatepicker<Date>;
    @ViewChild("mdDatePickerNgayVe") mdDatePickerNgayVe: MdDatepicker<Date>;
    @ViewChild("searchResultContainer") searchResultContainer: ElementRef;
    @ViewChild("passengerMarker") passengerMarker: ElementRef;

    constructor(private service: FlighBookingService,
        private flightRouteService: FlightRouteService,
        private luggagePriceService: LuggagePriceService,
        private airlineService: AirlineService,
        private paymentMethodService: PaymentMethodService,
        private snackBar: MdSnackBar,
        public dialog: MdDialog,
        private auth: AuthService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.currentDate = new Date();
        this.ngayDi.setDate(this.ngayDi.getDate() + 1);
        this.ngayVe.setDate(this.ngayVe.getDate() + 2);
        this.getListAirline();
        this.getListPaymentMethod();
        if (this.auth.FlightSearch) {
            this.searchData = this.auth.FlightSearch;
            this.searchFlight(this.searchData.fromPlace, this.searchData.toPlace, this.searchData.departDate, this.searchData.returnDate, this.searchData.fromPlaceId, this.searchData.toPlaceId);
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

    scrollToSearchResult() {
        if (this.searchResultContainer)
            this.searchResultContainer.nativeElement.scrollIntoView();
    }

    scrollToPassengerFill() {
        if (this.passengerMarker)
            this.passengerMarker.nativeElement.scrollIntoView();
    }

    getListAirline() {
        this.airlineService.getList().subscribe(resp => {
            this.AirlineList = resp;
            this.AirlineList.forEach(v => {
                v.selected = true;
            });
        });
    }

    getListPaymentMethod() {
        this.paymentMethodService.getList().subscribe(resp => {
            this.paymentMethodList = resp;
        });
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
        this.mdDatePickerNgayDi.open();
    }

    chonNgayDi() {
        if (this.searchData.roundTrip) {
            setTimeout(_ => {
                this.mdDatePickerNgayVe.open();
            });
        }
    }

    timChuyenBay() {
        this.searchFlight(this.diemDi.Code, this.diemDen.Code, this.ngayDi, this.ngayVe, this.diemDi.Id, this.diemDen.Id);
    }

    searchFlight(maDiemDi, maDiemDen, ngayDi, ngayVe, idDiemDi, idDiemDen) {
        this.searchData.fromPlace = maDiemDi;
        this.searchData.toPlace = maDiemDen;
        this.searchData.departDate = this.normalizeDate(this.ngayDi);
        this.searchData.returnDate = this.normalizeDate(this.ngayVe);

        this.flightDataChoosen = {
            RoundTrip: this.searchData.roundTrip,
            FromPlaceCode: this.searchData.fromPlace,
            ToPlaceCode: this.searchData.toPlace,
            FromPlaceId: idDiemDi,
            ToPlaceId: idDiemDen,
            DepartDate: this.searchData.departDate,
            ReturnDate: this.searchData.returnDate,
            Adult: [],
            Child: [],
            Infant: []
        };

        this.searching = true;
        this.scrollToSearchResult();
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

    xemChiTietVe(item) {
        this.veChon = item;
        for (let i = 0; i < this.AirlineList.length; i++) {
            if (this.AirlineList[i].Code == this.veChon.Airline) {
                this.airlineChon = this.AirlineList[i];
                break;
            }
        }
        this.dialog.open(this.detailTemplate);
    }

    tieptuc() {
        if (!this.chieuDi.Airline) {
            this.snackBar.open("Xin vui lòng chọn chiều đi", "", { duration: 1000 });
            return;
        }
        if (this.searchData.roundTrip && !this.chieuVe.Airline) {
            this.snackBar.open("Xin vui lòng chọn chiều về", "", { duration: 1000 });
            return;
        }

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

        setTimeout(_ => {
            this.scrollToPassengerFill();
        }, 1000);
    }

    chonChieuDi(item) {
        this.chieuDi = item;
        var data = {
            AirlineCode: this.chieuDi.Airline
        };
        this.luggagePriceService.getListByAirlineCode(data).subscribe(
            resp => {
                this.luggagePriceList = resp;
            }
        );
    }

    chonChieuVe(item) {
        this.chieuVe = item;
        if (this.chieuDi.Airline != this.chieuVe.Airline) {
            var data = {
                AirlineCode: this.chieuVe.Airline
            };
            this.luggagePriceService.getListByAirlineCode(data).subscribe(
                resp => {
                    this.returnLuggagePriceList = resp;
                }
            );
        }
        else {
            this.returnLuggagePriceList = this.luggagePriceList;
        }
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
            this.snackBar.open("Xin vui lòng nhập đầy đủ thông tin liên hệ", "", { duration: 2000 });
            return;
        }

        this.step = this.step + 1;
    }
    bookTicket() {
        if (!this.paymentMethodChon.Id) {
            this.snackBar.open("Xin vui lòng chọn hình thức thanh toán", "", { duration: 2000 });
            return;
        }
        this.booking = true;
        this.flightDataChoosen.Contact = this.contact;
        this.flightDataChoosen.PaymentMethod = this.paymentMethodChon;
        this.flightDataChoosen.TotalPrice = this.TongKhuHoi + this.ChiPhiHanhLy;
        this.flightDataChoosen.XuatHoaDon = this.xuatHoaDon;
        this.flightDataChoosen.ThongTinXuatHoaDon = this.thongTinXuatHoaDon;
        this.flightDataChoosen.SoDienThoaiNguoiGioiThieu = this.soDienThoaiNguoiGioiThieu;
        this.service.bookflight(this.flightDataChoosen).subscribe(
            resp => {
                if (resp.success) {
                    this.step = this.step + 1;
                    this.orderResult = resp;
                }
                else {
                    this.snackBar.open("Có lỗi xảy ra. Xin vui lòng đặt lại vé", "", { duration: 2000 });
                }
                this.booking = false;
            },
            err => {
                this.booking = false;
                this.snackBar.open("Có lỗi xảy ra. Xin vui lòng đặt lại vé", "", { duration: 2000 });
            }
        )
    }

    resetBook() {
        this.paymentMethodChon = { Id: 0 };
        this.step = 1;
        this.searchData.roundTrip = false;
        this.searchData.adult = 1;
        this.searchData.child = 0;
        this.searchData.infant = 0;
        this.searchResultFilter = [];
        this.searchResultReturnFilter = [];
        this.searchResult = [];
        this.searchResultReturn = [];
        this.chieuDi = {};
        this.chieuVe = {};
        this.xuatHoaDon = false;
        this.thongTinXuatHoaDon = "";
        this.soDienThoaiNguoiGioiThieu = "";
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
        return ('0' + ng).slice(-2) + '/' + ('0' + t).slice(-2) + '/' + n;
    }
}