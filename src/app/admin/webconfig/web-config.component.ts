import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { WebConfigService } from './web-config.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-web-config',
  templateUrl: './web-config.component.html'
})
export class WebConfigComponent implements OnInit {
  loaderMessage: any = "";
  loaderType: any = 0;

  item: any = { HotlineTop: "", HotlineFull: "" };

  modalRef: MdDialogRef<any>;

  @ViewChild("loaderTemplate") loaderTemplate;

  constructor(public auth: AuthService,
    private service: WebConfigService,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.service.get().subscribe(resp => {
      if (resp)
        this.item = resp;
    });
  }

  save() {
    this.loaderType = 0;
    this.loaderMessage = "Đang xử lý...";
    this.modalRef = this.dialog.open(this.loaderTemplate);
    let data = this.item;
    this.service.save(data).subscribe(resp => {
      this.modalRef.close();
      this.getInfo();
    });
  }
}
