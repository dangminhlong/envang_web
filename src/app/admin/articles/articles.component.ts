import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { CategoriesService } from '../categories/categories.service';
import { ArticlesService } from './articles.service'
import { MdDialog, MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { FileManagerComponent } from '../filemanager/filemanager.component';
import { Config } from '../../shared/config';

@Component({
  selector: 'app-article',
  templateUrl: './articles.component.html'
})
export class ArticlesComponent implements OnInit {
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";
  loaderType: any = 0;
  apiUrl = Config.apiUrl;

  item: any = { Id: 0, Name: "", FriendlyName:"", ImageUrl: "", ArticleTypeId: 0, Description: "", Content: "" };
  dsItem: any[] = [];

  loai: any = 0;
  dsLoai: any[] = [];

  page = 1;
  pageSize = 10;
  totalItems = 10;

  showAddEdit: boolean = false;

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(private auth: AuthService,
    private service: ArticlesService,
    private categoryService: CategoriesService,
    public dialog: MdDialog,
    public snackbar: MdSnackBar) { }

  ngOnInit() {
    this.getDsLoai();
    this.getDanhSach();
  }

  openFileManager() {
    let dialogRef = this.dialog.open(FileManagerComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result.type == 1) {
        this.item.ImageUrl = result.data.RelativePath;
      }
    });
  }

  getDsLoai() {
    this.categoryService.getList().subscribe(resp => {
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

  showAddNewForm() {
    this.showAddEdit = true;
    this.loai = 0;
    this.item = { Id: 0, Name: "", ImageUrl: "", ArticleTypeId: 0, Description: "", Content: "" };
  }

  closeEditForm() {
    this.showAddEdit = false;
  }

  showEditForm(item) {
    this.item = item;
    this.showAddEdit = true;
  }

  get isSaveInvalid() {
    return !this.item.Name.length || !this.item.ArticleTypeId;
  }

  showDeleteForm(content, item) {
    this.item = item;
    this.confirmType = 1;
    this.confirmMessage = "Bạn có muốn xóa điểm này không ?"
    this.modalRef = this.dialog.open(content);
  }

  save() {
    let data = this.item;
    this.snackbar.open("Đang lưu...");
    this.loaderMessage = "Đang lưu, xin vui lòng chờ...";
    this.modalRef = this.dialog.open(this.loaderTemplate);
    this.service.save(data).subscribe(resp => {
      this.modalRef.close();
      if (resp.success) {
        this.snackbar.open("Lưu thành công", "", {duration:1000});
        this.getDanhSach();
      }
      else {
        this.snackbar.open("Lưu thất bại. Xin vui lòng thực hiện lại","", {duration: 1000});
      }
    });
  }

  remove() {
    let data = {
      Id: this.item.Id
    };
    this.modalRef.close();
    this.snackbar.open("Đang xóa, xin vui lòng đợi...");
    this.modalRef = this.dialog.open(this.loaderTemplate);
    this.service.remove(data).subscribe(resp => {
      this.modalRef.close();
      if (resp.success) {        
        this.snackbar.open("Xóa thành công", "", {duration: 1000});
        this.getDanhSach();
      }
      else {
        this.snackbar.open("Xóa thất bại. Xui vui lòng thực hiện lại", "", {duration: 1000});
      }
    });
  }
}
