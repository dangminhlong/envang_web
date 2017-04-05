import { Component, OnInit } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';

import { FileManagerService } from './filemanager.service';
import { Config } from '../../shared/config';

declare var $ : any;

@Component({
    selector: 'ev-filemanager',
    templateUrl: './filemanager.component.html'
})
export class FileManagerComponent implements OnInit {
    saveType: any = 0;
    saveStatus: any = -1;
    saveStatusMessage: any = "";
    confirmType: any = 0;
    confirmMessage: any = "";
    loaderMessage: any = "";
    loaderType: any = 0;

    selectedFile: any = { RelativePath: ""};
    selectedFolder: any = { RelativePath: "", Name: "Root" };
    dsFolder: any[] = [];
    dsFile: any[] = [];

    apiUrl = Config.apiUrl;
    folderName = "";

    imgWidth: 100;
    imgHeight: 100;

    modalRef: MdDialogRef<any>;

    constructor(
        public dialogRef: MdDialogRef<FileManagerComponent>,
        private service: FileManagerService,
        public dialog: MdDialog) { }

    ngOnInit() {
        this.getListFolder();
        this.getListFile();
    }

    closeDialog(){
        this.dialogRef.close({type:0});
    }

    selectFileAndClose(item){
        this.dialogRef.close({type: 1, data: item, imgWidth: this.imgWidth, imgHeight: this.imgHeight});
    }

    choseSelectedFileAndClose(){
        if (this.selectedFile && this.selectedFile.RelativePath.length){
            this.dialogRef.close({type:1, data: this.selectedFile, imgWidth: this.imgWidth, imgHeight: this.imgHeight})
        }
    }

    goToUpperFolder(){
        this.selectedFolder = this.selectedFolder.Parent;
        this.getListFolder();
        this.getListFile();
    }

    getListFolder() {
        this.service.getListFolder(this.selectedFolder.RelativePath).subscribe(resp => {
            this.dsFolder = resp;
        });
    }

    selectFolder(item) {
        let tmp = $.extend({}, this.selectedFolder);
        this.selectedFolder = item;
        this.selectedFolder.Parent = tmp;
        this.getListFolder();
        this.getListFile();        
    }

    getListFile(){
        this.service.getListFile(this.selectedFolder.RelativePath).subscribe(resp => {
            this.dsFile = resp;
        });
    }

    close() {
        this.modalRef.close();
    }

    showUploadForm(content) {
        this.modalRef = this.dialog.open(content);
        this.saveStatus = -1;
    }

    uploadFile(){
        if (this.file){
            this.saveStatus = 0;
            this.saveStatusMessage = "Đang xử lý";
            this.service.uploadFile(this.file, this.selectedFolder.RelativePath).subscribe(
                resp=>{
                    this.saveStatus = 1;
                    this.saveStatusMessage = resp.message;
                    this.getListFile();
                }
            )
        }
    }

    file:any;
    onChangeFile(event){
        this.file = event.target.files[0];
    }

    selectFile(item){
        this.selectedFile = item;
    }

    deleteFile(){
        this.service.deleteFile(this.selectedFile.RelativePath).subscribe(resp=>{
            this.getListFile();
        });
    }

    showCreateFolderForm(content){
        this.modalRef = this.dialog.open(content);
        this.saveStatus = -1;
    }

    createFolder(){
        this.saveStatus = 0;
        this.saveStatusMessage = "Đang xử lý";
        this.service.createFolder(this.selectedFolder.RelativePath + "/" + this.folderName).subscribe(
            resp=>{
                this.saveStatus = 1;
                this.saveStatusMessage = resp.message;
                this.getListFolder();
            }
        )
    }

    deleteFolder(){
        this.service.deleteFolder(this.selectedFolder.RelativePath).subscribe(resp=>{
            this.selectedFolder = this.selectedFolder.Parent;
            this.getListFolder();
            this.getListFile();
        });
    }
}