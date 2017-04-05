import {
    Directive, Input, OnInit,
    OnDestroy,
    AfterViewInit,
    Provider,
    forwardRef,
    HostBinding
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerComponent } from '../admin/filemanager/filemanager.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Config } from '../shared/config';

declare var tinymce: any;

export const TinyMceValueAccessor: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TinyMceDirective2),
    multi: true
};

// Tinymce directive
@Directive({
    selector: '[htmlEditor]',
    providers: [TinyMceValueAccessor]
})

export class TinyMceDirective2 implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
    static nextUniqueId = 0;
    @HostBinding('attr.data-tinymce-uniqueid') uniqueId;

    onTouchedCallback: () => void = () => { };
    onChangeCallback: (_: any) => void = () => { };
    innerValue;
    init = false;
    editor;

    @Input() height;

    constructor(private sanitizer: DomSanitizer, private dialog: MdDialog) {
        this.uniqueId = `tinymce-host-${TinyMceDirective2.nextUniqueId++}`;
    }

    ngOnInit(){
        if (!this.height)
            this.height = 350;
    }

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    ngAfterViewInit(): void {
        console.log('tinymce');
        tinymce.init({
            selector: `[data-tinymce-uniqueid=${this.uniqueId}]`,
            plugins: ['link', 'paste', 'table', 'image', 'code', 'textcolor'],
            skin_url: 'assets/tinymce/skins/lightgray',
            toolbar: ['undo redo | styleselect | fontselect fontsizeselect | bold italic | link image | myimgbutton',
                    'forecolor backcolor | alignleft aligncenter alignright | code' ],
            height: this.height,
            setup: ed => {
                this.editor = ed;
                this.editor.on('init', ed2 => {
                    if (this.innerValue) ed2.target.setContent(this.innerValue);
                    this.init = true;
                });
                this.editor.on('blur', () => this.updateValue());
                this.editor.addButton('myimgbutton', {
                    text: 'Chọn ảnh',
                    icon: false,
                    onclick: ()=> { 
                        let dialogRef = this.dialog.open(FileManagerComponent);
                        dialogRef.afterClosed().subscribe(result=>{
                            if (result.type == 1){
                                let imgUrl = Config.apiUrl + result.data.RelativePath;
                                let imgWidth = result.imgWidth;
                                let imgHeight = result.imgHeight; 
                                if (!imgWidth && !imgHeight)
                                    this.editor.insertContent('<img src="' + imgUrl +'"/>');
                                else if (!imgHeight){
                                    this.editor.insertContent('<img src="' + imgUrl +'" width="' + imgWidth + '"/>');
                                }
                                else if (!imgWidth){
                                    this.editor.insertContent('<img src="' + imgUrl +'" height="' + imgHeight + '"/>');
                                }
                                else {
                                    this.editor.insertContent('<img src="' + imgUrl +'" width="' + imgWidth + '" height="' + imgHeight + '"/>');
                                }
                            }
                            
                        })
                        
                    }
                });
            }
        });
    }

    updateValue() {
        const content = this.editor.getContent();
        this.value = content; // this.sanitizer.bypassSecurityTrustHtml(content);
    }

    writeValue(value): void {
        if (value !== this.innerValue) {
            this.innerValue = value;
            if (this.init && value) this.editor.setContent(value);
        }
    }

    registerOnChange(fn): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn): void {
        this.onTouchedCallback = fn;
    }

    ngOnDestroy(): void {
        if (this.init) tinymce.remove(`[data-tinymce-uniqueid=${this.uniqueId}]`);
    }
}