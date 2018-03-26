import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Request, Project, Message } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-message-form-dialog',
  templateUrl: './message-form.dialog.component.html',
  styleUrls: ['./message-form.dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageFormDialogComponent {
  dialogTitle: string;
  messageFormGroup: FormGroup;

  message: Message;
  constructor(
    public dialogRef: MatDialogRef<MessageFormDialogComponent>,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.message = data.message;

    this.messageFormGroup = this.formBuilder.group({});
  }
}
