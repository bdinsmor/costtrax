import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { RequestsService } from 'src/app/requests/requests.service';
import { Item } from 'src/app/shared/model';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-attachments-dialog-component',
  templateUrl: './attachments-dialog.component.html',
  styleUrls: ['./attachments-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentsDialogComponent implements OnInit {
  selectedItem: Item;
  uploading = false;
  fileList: UploadFile[] = [];

  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
    private requestsService: RequestsService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.selectedItem = this.data.selectedItem;
    this.selectedItem.attachments.forEach((p: any) => {
      p.url = environment.serverUrl + '/attachment/' + p.id;
      p.name = p.fileName;
      p.uid = p.id;
      this.fileList.push(p as UploadFile);
    });
  }

  openAttachment(file: UploadFile) {
    this.requestsService.openAttachment(file).subscribe((res: any) => {
      console.log('response: ' + JSON.stringify(res, null, 2));
    });
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    console.log(' before file upload');
    return false;
  }

  handleUpload(event: any): void {
    console.log('handleUpload: ' + JSON.stringify(event, null, 2));
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      console.log('file: ' + JSON.stringify(file, null, 2));
      formData.append('files[]', file);
    });
    this.uploading = true;
  }
  customData = (file: UploadFile) => {
    console.log('inside customdata: ' + JSON.stringify(file, null, 2));
    return file;
  }

  customReq = (item: UploadXHRArgs) => {
    // 构建一个 FormData 对象，用于存储文件或其他参数
    console.log('file type: ' + item.file.name);
    // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
    return this.http
      .post(
        environment.serverUrl +
          '/lineitem/' +
          this.selectedItem.id +
          '/attachment',
        { fileName: item.file.name, fileType: item.file.type }
      )
      .subscribe(
        (res: any) => {
          const headerSettings: { [name: string]: string | string[] } = {};

          headerSettings['Content-Type'] = item.file.type;
          headerSettings['Content-Disposition'] =
            'attachment; filename=' + item.file.name;
          const newHeader = new HttpHeaders(headerSettings);

          const req = new HttpRequest('PUT', res.url, item.file as any, {
            headers: newHeader,
            reportProgress: true
          });

          console.log('headers: ' + JSON.stringify(headerSettings, null, 2));
          return this.http.request(req).subscribe(
            (event2: HttpEvent<{}>) => {
              if (event2.type === HttpEventType.UploadProgress) {
                console.log('progress event!');
                if (event2.total > 0) {
                  // tslint:disable-next-line:no-any
                  (event2 as any).percent =
                    (event2.loaded / event2.total) * 100;
                }
                // 处理上传进度条，必须指定 `percent` 属性来表示进度
                item.onProgress(event2, item.file);
              } else if (event2 instanceof HttpResponse) {
                console.log('finish event!');

                item.onSuccess(event2.body, item.file, event2);
              }
            },
            err => {
              console.log('ERROR event!');
              // 处理失败
              item.onError(err, item.file);
            }
          );
        },
        err => {
          // 处理失败
          item.onError(err, item.file);
        }
      );
  }

  handleChange({ file, fileList }): void {
    console.log('handleChange: ' + JSON.stringify(file, null, 2));
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }
}
