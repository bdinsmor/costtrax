import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

import { appAnimations } from '../core/animations';
import { ProjectsService } from '../projects/projects.service';
import { RequestsService } from '../requests/requests.service';
import { AuthenticationService } from './../core/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: appAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private config: MatSnackBarConfig;
  duration = 3000;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {}
}
