import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { FeatureArticleConfigService } from './feature-article-config.service';
import { FeatureArticleConfigGroupService } from '../feature-article-config-group/feature-article-config-group.service';
import { ArticlesDialog } from '../articles/articles.dialog'
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-feature-article-config',
  templateUrl: './feature-article-config.component.html'
})
export class FeatureArticleConfigComponent implements OnInit {
  saveType: any = 0;
  saveStatus: any = -1;
  saveStatusMessage: any = "";
  confirmType: any = 0;
  confirmMessage: any = "";
  loaderMessage: any = "";
  loaderType: any = 0;

  articleSelected:any={Name:"", Id: 0};

  item: any = {Id: 0, Name: "", GroupId: 0, Order: 1};
  dsItem: any[] = [];

  group: any = 0;
  dsGroup: any[] = [];
  

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(public auth: AuthService,
    private service: FeatureArticleConfigService,
    private groupService: FeatureArticleConfigGroupService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getGroup();
    this.getDanhSach();
  }

  selectArticle(){
    let dialogRef = this.dialog.open(ArticlesDialog);
    dialogRef.afterClosed().subscribe(result=>{
      if (result){
        this.articleSelected = result;
        this.item.ArticleId = this.articleSelected.Id;
      }
    });
  }

  getGroup(){
    this.groupService.getList().subscribe(resp=>{
      this.dsGroup = resp;
    });
  }

  getDanhSach() {
    var data = {
      GroupId: this.group
    };
    this.service.getList(data).subscribe(resp => {
      this.dsItem = resp;
    });
  }

  showAddNewForm(content) {
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 1;
    this.group = 0;
    this.item = {Id: 0, Name: "", GroupId: 0};
    this.articleSelected={Name:"", Id: 0};
  }
  close() {
    this.modalRef.close();
  }

  showEditForm(content, item) {
    this.articleSelected = {Id: item.ArticleId, Name: item.ArticleName };
    this.item = item;
    this.modalRef = this.dialog.open(content);
    this.saveStatus = -1;
    this.saveType = 2;
  }

  get isSaveInvalid() {
    return !this.item.Name.length || !this.item.GroupId || !this.item.ArticleId;
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
