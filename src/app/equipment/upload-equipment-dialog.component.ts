import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { Papa } from 'ngx-papaparse';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RequestsService } from 'src/app/requests/requests.service';
import { Attachment, Item } from 'src/app/shared/model';

@Component({
  selector: 'app-upload-equipment-dialog-component',
  templateUrl: './upload-equipment-dialog.component.html',
  styleUrls: ['./upload-equipment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentUploadDialogComponent implements OnInit, OnDestroy {
  selectedItem: Item;
  uploading = false;
  fileList: UploadFile[] = [];
  addedFiles: Attachment[] = [];
  canDelete = false;
  canAdd = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private msg: NzMessageService,
    private requestsService: RequestsService,
    public dialogRef: MatDialogRef<any>,
    private papaParse: Papa,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  done() {
    this.dialogRef.close({ fileList: this.fileList });
  }

  openAttachment(file: UploadFile) {
    this.requestsService.openAttachment(file).subscribe((res: any) => {});
  }

  handleChange({ file, fileList }) {
    const file2: File = fileList.item(0);
    const reader: FileReader = new FileReader();
    reader.readAsText(file2);
    reader.onload = e => {
      const csv = reader.result as string;
      const parsed = this.papaParse.parse(csv, { header: false });
      console.log('data: ' + JSON.stringify(parsed, null, 2));
      // do something with parsed CSV
    };
  }

  deleteAttachment = (file: UploadFile) => {
    return this.requestsService
      .deleteAttachment(file.uid)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.cdr.detectChanges();
      });
  }

  parse(files: FileList): void {
    const file: File = files.item(0);
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      const csv = reader.result as string;
      const parsed = this.papaParse.parse(csv, { header: false });
      console.log('data: ' + JSON.stringify(parsed, null, 2));
      // do something with parsed CSV
    };
  }

  showUpload() {
    return { showPreviewIcon: false, showRemoveIcon: this.canDelete };
  }

  customData = (file: UploadFile) => {
    console.log('f: ' + JSON.stringify(file, null, 2));
  }

  customReq = (item: UploadXHRArgs) => {
    console.log('item.data: ' + JSON.stringify(item.file as any, null, 2));
  }
}
