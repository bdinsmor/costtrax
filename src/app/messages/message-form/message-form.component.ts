import { Component, Inject, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Request, Project, Message } from '@app/shared/model';
import { ProjectsService } from '@app/projects/projects.service';
import { Observable } from 'rxjs/Observable';
import { MessagesService } from '../messages.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageFormComponent implements OnInit {
  requestForm: FormGroup;
  projectFormGroup: FormGroup;
  costFormGroup: FormGroup;
  costDetailsFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  action: string;
  @Input() message: Message;
  projects: Observable<Project[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService,
    private formBuilder: FormBuilder
  ) {
    if (!this.message) {
      this.message = new Message({});
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    console.log('id: ' + id);
  }

  createMessageFormGroup() {
    return this.formBuilder.group({});
  }
}
