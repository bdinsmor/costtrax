import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { ProjectsService } from '../../projects/projects.service';
import { User } from '../../shared/model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('400ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  private config: MatSnackBarConfig;
  duration = 3000;

  @Input() projectId: string;
  @Input() users: User[];
  @Input() newProject: boolean;
  @Input() type: string;

  @Output() changed = new EventEmitter<any>();

  _inviteUserModal = false;
  _confirmDeleteModal = false;
  emailForm: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  projectAdmin = false;
  projectObserve = false;
  requestManage = false;
  requestSubmit = false;
  requestDisabled = false;
  projectDisabled = false;
  selectedItem: User;
  selectedIndex = -1;
  newUser: User = new User({});

  constructor(
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.buildUser();
    this.changeDetector.detectChanges();
  }

  buildUser() {
    this.newUser = new User({});
  }

  buildForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      projectAdmin: new FormControl({
        value: this.projectAdmin,
        disabled: this.projectDisabled
      }),
      projectObserve: new FormControl({
        value: this.projectAdmin,
        disabled: this.projectDisabled
      }),
      requestManage: new FormControl({
        value: this.requestManage,
        disabled: this.projectDisabled
      }),
      requestSubmit: new FormControl({
        value: this.requestSubmit,
        disabled: this.requestDisabled
      })
    });
  }

  removeUser(index: number, item: User) {
    if (this.newProject) {
      this.users.splice(index, 1);
      return;
    }
    this.selectedItem = item;
    this.selectedIndex = index;
    this._confirmDeleteModal = true;
    // call delete and splice list
  }

  cancelDelete() {
    this.selectedItem = null;
    this._confirmDeleteModal = false;
  }

  confirmDelete() {
    this._confirmDeleteModal = false;
    this.projectsService
      .deleteUser(this.projectId, this.selectedItem.id)
      .subscribe(
        (response: any) => {
          this.openSnackBar('User Removed', 'ok', 'OK');
          this.changed.emit();
          this.changeDetector.detectChanges();
          this.selectedIndex = -1;
          this.selectedItem = null;
          this.buildUser();
          this.buildForm();
        },
        (error: any) => {
          this.openSnackBar('User NOT Removed!', 'ok', 'OK');
        }
      );
    this.changeDetector.detectChanges();
  }

  editUser(user) {
    user.expanded = !user.expanded;
  }

  roleChanged(user: User, roleName: string) {
    user.toggleRole(roleName);
    this.changeDetector.detectChanges();
  }

  cancelRoleEdit(user: User) {
    user.resetRoles();
  }

  saveRoleEdit(user: User) {
    this.projectsService
      .updateUser(this.projectId, user.id, user.roles)
      .subscribe(
        (response: any) => {
          this.openSnackBar('User Updated', 'ok', 'OK');
          this.buildUser();
          this.changed.emit();
        },
        (error: any) => {
          this.openSnackBar('User was NOT updated', 'error', 'OK');
        }
      );
  }

  addRequestor() {
    this._inviteUserModal = true;
  }

  inviteUser() {
    this._inviteUserModal = true;
  }

  cancelInvite() {
    this._inviteUserModal = false;
  }

  addUser() {
    this.newUser.email = this.emailForm.value.email;
    if (this.type === 'REQUESTOR') {
      this.newUser.addRole('RequestSubmit');
    }
    this.users.push(this.newUser);
    this.changed.emit({ users: this.users });
    this.buildForm();
    this.buildUser();
    this._inviteUserModal = false;
  }

  sendInvite() {
    const invite = {
      email: this.emailForm.value.email,
      roles: this.newUser.roles
    };

    this.projectsService.inviteUser(this.projectId, invite).subscribe(
      (response: any) => {
        this._inviteUserModal = false;
        this.buildUser();
        this.buildForm();
        this.openSnackBar('User Invite Sent', 'ok', 'OK');
        this.changed.emit();
      },
      (error: any) => {
        this.openSnackBar('Invite was NOT sent', 'error', 'OK');
      }
    );
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }
}
