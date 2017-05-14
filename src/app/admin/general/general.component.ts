import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/auth-service';
import { CategoriesService } from '../categories/categories.service';
import { GeneralService } from './general.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { FileManagerComponent } from '../filemanager/filemanager.component';
import { Config } from '../../shared/config';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html'
})
export class GeneralComponent implements OnInit {

  constructor(private auth: AuthService,
    private service: GeneralService,
    private categoryService: CategoriesService,
    public dialog: MdDialog,
    public snackbar: MdSnackBar) { }

  ngOnInit() {
  }

}
