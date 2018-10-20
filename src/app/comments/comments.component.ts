import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Comment } from '../shared/model';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment[];
  @Input() requestId: string;
  @Input() roles: string[];
  @Output() commentsChanged = new EventEmitter<any>();
  commentForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.minLength(1))
    });
  }

  saveComment() {
    this.commentsChanged.emit({ comment: this.commentForm.value });
  }
}
