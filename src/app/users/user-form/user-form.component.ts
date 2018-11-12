import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProjectsService } from 'src/app/projects/projects.service';
import { Project, User } from 'src/app/shared/model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  newProject = false;
  type = 'USER';
  emailForm: FormGroup;
  newUser: User;
  project: Project;
  projectId: string;
  projectAdmin = false;
  projectDisabled = false;
  requestManage = false;
  requestSubmit = false;
  requestDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    console.log('data: ' + JSON.stringify(this.data, null, 2));
    this.newUser = new User({});
    this.newProject = this.data.newProject;
    this.type = this.data.type;
    this.projectId = this.data.projectId;
    this.buildForm();
  }

  roleChanged(user: User, roleName: string) {
    user.toggleRole(roleName);
  }

  cancel() {
    this.dialogRef.close();
  }

  addUser() {
    this.newUser.email = this.emailForm.value.email;
    if (this.type === 'REQUESTOR') {
      this.newUser.addRole('RequestSubmit');
    }
    this.dialogRef.close({ success: true, user: this.newUser });
  }

  sendInvite() {
    this.newUser.email = this.emailForm.value.email;
    if (this.type === 'REQUESTOR') {
      this.newUser.addRole('RequestSubmit');
    }
    const invite = {
      email: this.newUser.email,
      roles: this.newUser.roles
    };

    this.projectsService.inviteUser(this.projectId, invite).subscribe(
      (response: any) => {
        this.dialogRef.close({ success: true, user: this.newUser });
      },
      (error: any) => {
        this.dialogRef.close();
      }
    );
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
}
