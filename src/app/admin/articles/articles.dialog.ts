import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { CategoriesService } from '../categories/categories.service';
import { ArticlesService } from './articles.service'
import { MdDialog, MdDialogRef } from '@angular/material';
import { Config } from '../../shared/config';

@Component({
  selector: 'app-article-dialog',
  templateUrl: './articles.dialog.html'
})
export class ArticlesDialog implements OnInit {
  selectedItem;
  dsItem: any[] = [];

  loai: any = 0;
  dsLoai: any[] = [];

  page = 1;
  pageSize = 10;
  totalItems = 10;

  constructor(
    public dialogRef: MdDialogRef<ArticlesDialog>,
    public auth: AuthService,
    private service: ArticlesService,
    private categoryService: CategoriesService) { }

  ngOnInit() {
    this.getDsLoai();
    this.getDanhSach();
  }

  selectArticle(){
    this.dialogRef.close(this.selectedItem);
  }

  closeDialog(){
    this.dialogRef.close(null);
  }

  getDsLoai(){
    this.categoryService.getList().subscribe(resp=>{
      this.dsLoai = resp;
    });
  }

  getDanhSach() {
    var data = {
      ArticleTypeId: this.loai,
      Page: this.page,
      pageSize: this.pageSize
    };
    this.service.getList(data).subscribe(resp => {
      this.dsItem = resp.Data;
      this.totalItems = resp.Tong;
    });
  }

  loadPage($event){
    this.page = $event;
    this.getDanhSach();
  }
}
