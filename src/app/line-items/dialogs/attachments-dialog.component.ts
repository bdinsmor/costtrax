import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RequestsService } from 'src/app/requests/requests.service';
import { Attachment, Item } from 'src/app/shared/model';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-attachments-dialog-component',
  templateUrl: './attachments-dialog.component.html',
  styleUrls: ['./attachments-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentsDialogComponent implements OnInit, OnDestroy {
  selectedItem: Item;
  uploading = false;
  uploaded: [] = [];
  fileList: UploadFile[] = [];
  addedFiles: Attachment[] = [];
  canDelete = false;
  canAdd = false;
  requestId: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private msg: NzMessageService,
    private requestsService: RequestsService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.selectedItem = this.data.selectedItem;
    this.canDelete = this.data.canDelete;
    this.canAdd = this.data.canAdd;
    this.requestId = this.data.requestId;
    this.selectedItem.attachments.forEach((p: any) => {
      p.url =
        environment.serverUrl +
        '/request/' +
        this.requestId +
        '/attachment/' +
        p.id;

      if (p.fileName && p.fileName !== '') {
        p.name = p.fileName;
      }
      if (!p.message) {
        p.message = 'Click to view file';
      }
      if (!p.status) {
        p.status = 'complete';
      }

      p.uid = p.id;
      this.addedFiles.push({
        type: p.type,
        size: p.size,
        url: p.url,
        id: p.id,
        name: p.name,
        uid: p.uid,
        tempId: p.id,
        message: p.message,
        status: p.status
      });
    });
  }

  ngOnDestroy() {}

  done() {
    this.dialogRef.close({ fileList: this.addedFiles });
  }

  openAttachment(file: UploadFile) {
    this.requestsService.openAttachment(file).subscribe((res: any) => {});
  }

  handleChange({ file, fileList }) {
    const status = file.status;
    if (status === 'done') {
      fileList.forEach((p: any) => {
        if (!p.url || p.url === '') {
          const puid = p.uid;
          for (let i = 0; i < this.addedFiles.length; i++) {
            if (this.addedFiles[i].uid === puid) {
              p.url =
                environment.serverUrl +
                '/request/' +
                this.requestId +
                '/attachment/' +
                this.addedFiles[i].url;
              if (!p.size || p.size === 0) {
                p.size = this.addedFiles[i].size;
              }
              if (!p.id || p.id === '') {
                p.id = this.addedFiles[i].tempId;
                p.uid = p.id;
              }
              if (!p.name || p.name === '') {
                p.name = this.addedFiles[i].name;
              }
              this.addedFiles[i].url = p.url;
            }
          }
        }
      });
      this.cdr.detectChanges();
    }
  }

  deleteFile(index: number, file: Attachment) {
    return this.requestsService
      .deleteAttachment(this.requestId, file.id)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.addedFiles.splice(index, 1);
        this.cdr.detectChanges();
      });
  }

  deleteAttachment = (file: UploadFile) => {
    return this.requestsService
      .deleteAttachment(this.requestId, file.uid)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.cdr.detectChanges();
      });
  };

  showUpload() {
    return { showPreviewIcon: false, showRemoveIcon: this.canDelete };
  }

  customReq = (item: UploadXHRArgs) => {
    return this.http
      .post(
        environment.serverUrl +
          '/request/' +
          this.selectedItem.requestId +
          '/attachment',
        { fileName: item.file.name, fileType: item.file.type }
      )
      .subscribe(
        (res: any) => {
          this.addedFiles.push({
            type: item.file.type,
            size: item.file.size,
            url: res.id,
            id: res.id,
            name: item.file.name,
            uid: item.file.uid,
            tempId: res.id,
            message: '',
            status: 'uploading'
          });
          const headerSettings: { [name: string]: string | string[] } = {};

          headerSettings['Content-Type'] = item.file.type;
          headerSettings['Content-Disposition'] =
            'attachment; filename=' + item.file.name;
          const newHeader = new HttpHeaders(headerSettings);

          const req = new HttpRequest('PUT', res.url, item.file as any, {
            headers: newHeader,
            reportProgress: true
          });

          return this.http.request(req).subscribe(
            (event2: HttpEvent<{}>) => {
              if (event2.type === HttpEventType.UploadProgress) {
                if (event2.total > 0) {
                  (event2 as any).percent =
                    (event2.loaded / event2.total) * 100;
                }

                item.onProgress(event2, item.file);
              } else if (event2 instanceof HttpResponse) {
                item.onSuccess(event2.body, item.file, event2);
                this.addedFiles.forEach((a: Attachment) => {
                  if (a.uid === item.file.uid) {
                    a.status = 'complete';
                    a.message = 'Click to download file';
                  }
                });

                this.cdr.detectChanges();
              }
            },
            err => {
              console.log('got error');
              item.onError(err, item.file);
              this.addedFiles.forEach((a: Attachment) => {
                if (a.uid === item.file.uid) {
                  a.status = 'error';
                  a.message = 'File failed to upload';
                }
              });
            }
          );
        },
        err => {
          console.log('got error2');
          item.onError(err, item.file);
        }
      );
  };
}
