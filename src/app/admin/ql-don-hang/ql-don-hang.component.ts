import { Component, OnInit } from '@angular/core';
import { QlDonHangService } from './ql-don-hang.service';
import { AuthService } from '../../shared/auth-service';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

@Component({
    selector: 'ql-don-hang',
    templateUrl: './ql-don-hang.component.html',
    providers: [QlDonHangService]
})

export class QlDonHangComponent implements OnInit {
    tinhtrang: any = -1;
    tungay: Date = new Date();
    denngay: Date = new Date();
    nguoiDat: any = "";
    soDtNguoiGT:any="";
    dsDonHang: any[] = [];

    constructor(public auth: AuthService,
        private service: QlDonHangService,
        public dialog: MdDialog,
        public snackBar: MdSnackBar) { }

    ngOnInit() {
        this.getDsDonHang();
    }

    getDsDonHang() {
        let data = {
            tinhtrang: this.tinhtrang,
            tungay: this.toLocalDate(this.tungay),
            denngay: this.toLocalDate(this.denngay),
            nguoidat: this.nguoiDat,
            soDtNguoiGT: this.soDtNguoiGT
        };
        this.service.getDsDonHang(data).subscribe(
            resp => {
                this.dsDonHang = resp;
            }
        )
    }
    showDetail(item) {
        item.showDetail = item.showDetail ? false : true;
        let data = {
            bookId: item.Id
        };
        this.service.getDonHangDetail(data).subscribe(
            resp => {
                item.dsVe = resp;
                item.dsVe.forEach(v=>{
                    if (v.Ticket.NgayDat){
                        var gio = new Date(v.Ticket.NgayDat).getHours();
                        var phut = new Date(v.Ticket.NgayDat).getMinutes();
                        v.Ticket.GioDat = ('0' + gio).slice(-2) + ':' + ('0' + phut).slice(-2);
                    }
                });
            }
        );
    }
    huyDonHang(item){
        if (confirm('Bạn có muốn hủy đơn hàng này không?')){
            let data = {
            bookId: item.Id
        };
        this.service.huyDonHang(data).subscribe(
            resp => {
                if (resp.success){
                    this.snackBar.open("Hủy đơn hàng thành công","", {duration:1000});
                    this.getDsDonHang();
                }
                else
                    this.snackBar.open("Hủy đơn hàng lỗi. Xin vui lòng thực hiện lại sau!","", {duration:1000});
            }
        );
        }
    }
    nhanXuLy(item) {
        let data = {
            bookId: item.Id
        };
        this.service.nhanXuLy(data).subscribe(
            resp => {
                if (resp.success) {
                    this.snackBar.open("Nhận xử lý thành công", "", { duration: 1000 });
                    item.TinhTrang = 1;
                    item.showDetail = false;
                    this.showDetail(item);
                }
                else {
                    this.snackBar.open("Lỗi nhận xử lý. Xin vui lòng thực hiện lại", "", { duration: 2000 });
                }
            }
        );
    }

    capNhatVe(ve) {
        let data = {
            ticketId: ve.Ticket.Id,
            pnrCode: ve.Ticket.PNRCode,
            tinhTrang: ve.Ticket.TinhTrang,
            ngayDat: this.toLocalDate(ve.Ticket.NgayDat),
            ngayXuat: this.toLocalDate(ve.Ticket.NgayXuat),
            ngayThanhToan: this.toLocalDate(ve.Ticket.NgayThanhToan)
        };
        var giodat = ve.Ticket.GioDat;
        if (giodat) {
            var arGioDat = giodat.split(':');
            var gio = arGioDat[0];
            var phut = "0";
            if (arGioDat.length > 1) {
                phut = arGioDat[1];
            }
            if (data.ngayDat){
                data.ngayDat.setHours(parseInt(gio) - data.ngayDat.getTimezoneOffset() / 60);
                data.ngayDat.setMinutes(parseInt(phut));
            }
        }

        this.service.capNhatVe(data).subscribe(
            resp => {
                if (resp.success) {
                    this.snackBar.open("Cập nhật vé thành công", "", { duration: 1000 });
                }
                else {
                    this.snackBar.open("Cập nhật vé thất bại. Xin vui lòng thực hiện lại sau", "", { duration: 1000 });
                }
            }
        );
    }

    normalizeDate(d: Date) {
        if (d) {
            let n = d.getFullYear();
            let t = d.getMonth() + 1;
            let ng = d.getDate();
            return ('0' + ng).slice(-2) + '/' + ('0' + t).slice(-2) + '/' + n;
        }
        else {
            return "";
        }
    }

    toLocalDate(d: Date) {
        if (d) {
            var date = new Date(d);
            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
            return date;
        }
        else {
            return null;
        }
    }
}