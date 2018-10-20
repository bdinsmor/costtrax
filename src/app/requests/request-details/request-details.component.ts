import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { BreadcrumbService } from '../../core/breadcrumbs/breadcrumbs.service';
import { ProjectsService } from '../../projects/projects.service';
import { Equipment, Item, ItemList, Project, Request } from '../../shared/model';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('ngIfAnimation', [
      transition('void => *', [
        query(
          '*',
          stagger('10ms', [
            animate(
              '0.25s ease-in',
              keyframes([
                style({ opacity: 0, transform: 'translateY(-5%)', offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: 'translateY(5px)',
                  offset: 0.3
                }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
              ])
            )
          ]),
          { optional: true }
        )
      ]),
      transition('* => void', [
        query('*', style({ opacity: 1, background: 'red' }), {
          optional: true
        }),
        query(
          '*',
          stagger('300ms', [
            animate(
              '0.8s ease-in',
              keyframes([
                style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: 'translateY(35px)',
                  offset: 0.3
                }),
                style({
                  opacity: 0,
                  transform: 'translateY(-75%)',
                  offset: 1.0
                })
              ])
            )
          ]),
          { optional: true }
        )
      ])
    ])
  ]
})
export class RequestDetailsComponent implements OnInit {
  private config: MatSnackBarConfig;
  duration = 3000;
  requestFormGroup: FormGroup;
  signatureFormGroup: FormGroup;
  lineItemFormGroup: FormGroup;
  notesFormGroup: FormGroup;

  project: Project;
  request: Request;
  lineItems: Map<String, Item[]>;
  selectedItems: Item[];
  selectedItemType: string;
  _confirmApproveAllModal = false;
  _confirmApproveRequest = false;
  _confirmSubmitModal = false;
  _confirmCancelModel = false;
  canManageRequest = false;
  canSubmitRequest = false;
  canManageProject = false;
  editMode = false;
  printingInvoice = false;
  projectChoices: Observable<Project[]>;
  projectChoice: string;
  itemTypes: any[];
  machineChoices: Equipment[];
  machineChoice: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private projectsService: ProjectsService,
    private breadcrumbService: BreadcrumbService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.requestFormGroup = new FormGroup({
      selectedProjectControl: new FormControl(''),
      notes: new FormControl('')
    });

    this.signatureFormGroup = new FormGroup({
      signature: new FormControl('')
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestsService.getRequest(id).subscribe(
        (r: Request) => {
          this.projectsService
            .getProject(r.projectId)
            .subscribe((p: Project) => {
              this.project = p;
              r.project = p;
              this.request = r;
              this.request.calculateTotals();
              this.editMode = false;
              this.notesFormGroup = this.formBuilder.group(
                {
                  notes: new FormControl(r.notes),
                  startDate: new FormControl(r.startDate, Validators.required),
                  endDate: new FormControl(r.endDate, Validators.required)
                },
                { validator: this.checkDates }
              );

              this.notesFormGroup.valueChanges
                .pipe(auditTime(1000))
                .subscribe((formData: any) => {
                  this.save(
                    formData.notes,
                    formData.startDate,
                    formData.endDate
                  );
                });

              this.breadcrumbService.addProject(p.id, p.name);
              this.breadcrumbService.addRequest(r.id, r.oneUp);
              this.checkPermissions();
              this.buildItemTypes();
              this.changeDetector.detectChanges();
            });
        },
        err => {}
      );
    } else {
      this.request = new Request({});
      this.breadcrumbService.addHome();
      this.request.status = 'DRAFT';
      this.notesFormGroup = new FormGroup({
        notes: new FormControl('')
      });
      this.projectChoices = this.projectsService.getProjectsForRequests();
      this.projectsService
        .getProjectsForRequests()
        .subscribe((projects: Project[]) => {
          if (
            this.route.snapshot.queryParams.projectId &&
            this.route.snapshot.queryParams.projectId !== ''
          ) {
            this.projectsService
              .getProject(this.route.snapshot.queryParams.projectId)
              .subscribe((p: Project) => {
                this.project = p;
                this.request.project = p;
                this.breadcrumbService.addProject(p.id, p.name);
                this.breadcrumbService.addNewRequest();
                this.checkPermissions();
                this.buildItemTypes();
                this.requestFormGroup = new FormGroup({
                  selectedProjectControl: new FormControl(
                    this.findSelectedProject(projects, p)
                  )
                });

                this.requestsService
                  .grabRequestId(p.id)
                  .subscribe((data: any) => {
                    this.request.id = data.id;
                  });
                this.changeDetector.detectChanges();
              });
          } else {
            this.breadcrumbService.addNewRequest();
            this.changeDetector.detectChanges();
          }
        });

      this.editMode = true;
    }
  }

  checkDates(group: FormGroup) {
    if (group.controls.endDate.value < group.controls.startDate.value) {
      return { notValid: true };
    }
    return null;
  }

  captureScreen() {
    this.printingInvoice = true;
    this.changeDetector.detectChanges();
    const data = document.getElementById('invoice-contents');
    const opts = {
      margin: 0.5,
      filename: 'myfile.pdf',
      html2canvas: {
        backgroundColor: '#000',
        scale: 2,
        dpi: 600,
        imageTimeout: 0,
        letterRendering: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    /* const worker = html2pdf()
      .from(data)
      .set(opts)
      .save();
     html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      console.log('canvas.height: ' + canvas.height);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      console.log('image height: ' + imgHeight);
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('file.pdf');
      this.printingInvoice = false;
      this.changeDetector.detectChanges();
      // pdf.save('MYPdf.pdf'); // Generated PDF
    }); */
  }

  findSelectedProject(projects: Project[], project: Project) {
    for (let i = 0; i < projects.length; i++) {
      if (project.id === projects[i].id) {
        return projects[i];
      }
    }
    return '';
  }
  checkPermissions() {
    this.canManageRequest = false;
    this.canSubmitRequest = false;
    this.canManageProject = false;
    if (!this.project) {
      return;
    }
    for (let i = 0; i < this.project.roles.length; i++) {
      const role = this.project.roles[i];
      if (role === 'RequestManage') {
        this.canManageRequest = true;
      }
      if (role === 'RequestSubmit') {
        this.canSubmitRequest = true;
      }
      if (role === 'ProjectAdmin') {
        this.canManageProject = true;
      }
    }
  }

  getRequestId() {
    this.requestsService
      .grabRequestId(this.project.id)
      .subscribe((data: any) => {
        this.request.id = data.id;
      });
  }

  notesChanged() {}

  confirmCancel() {
    this._confirmCancelModel = false;
    if (this.request.id && this.request.id !== '') {
      this.requestsService
        .deleteRequest(this.request.id)
        .subscribe((response: any) => {
          this.openSnackBar('Request Deleted!', 'OK', 'OK');
          this._location.back();
        });
    } else {
      this.router.navigate(['/home']);
    }
  }

  closeConfirmation() {
    this._confirmCancelModel = false;
  }

  cancelRequest() {
    this._confirmCancelModel = true;
  }

  deleteRequest() {
    this._confirmCancelModel = true;
  }

  submitRequest() {
    this._confirmSubmitModal = true;
  }

  save(notesValue, startDate, endDate) {
    if (
      this.request.id &&
      this.request.id !== '' &&
      (this.notesFormGroup && !this.notesFormGroup.hasError('notValid'))
    ) {
      this.request.notes = notesValue;
      this.request.startDate = new Date(startDate);
      this.request.endDate = new Date(endDate);
      this.requestsService.update(this.request).subscribe((response: any) => {
        // this.openSnackBar('Request Saved!', 'OK', 'OK');
      });
    } else {
      console.log('request not saved, error on form');
    }
  }

  saveRequest() {
    if (this.request.id && this.request.id !== '') {
      this.requestsService
        .patchLineItems(this.request.items)
        .then((response: any) => {
          this.openSnackBar('Request Saved!', 'OK', 'OK');
        });
    }
  }

  cancelSubmit() {
    this._confirmSubmitModal = false;
  }

  confirmSubmit() {
    this.requestsService
      .submitRequest(
        this.request.id,
        this.notesFormGroup.value.notes,
        this.signatureFormGroup.value.signature
      )
      .subscribe(
        (response: any) => {
          this.openSnackBar('Request Submitted', 'ok', 'OK');
          if (this.project) {
            this.router.navigate(['../projects', this.project.id]);
          } else {
            this.router.navigate(['../home']);
          }
        },
        (error: any) => {
          this.openSnackBar('Request Did Not Submit', 'error', 'OK');
        }
      );
  }

  compareByValue(c1: Project, c2: Project): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  customSearchFn(term: string, item: Equipment) {
    term = term.toLocaleLowerCase();
    return (
      item.description.toLocaleLowerCase().indexOf(term) > -1 ||
      item.vin.toLocaleLowerCase() === term ||
      item.model.toLocaleLowerCase() === term ||
      item.make.toLocaleLowerCase() === term
    );
  }
  removeLineItem() {
    this.request.calculateTotals();
  }

  onProjectChange(event: any) {
    this.project = this.requestFormGroup.get('selectedProjectControl')
      .value as Project;

    if (!this.project) {
      this.request.itemsByType = [];
      this.request.items = [];
      this.buildItemTypes();
      this.changeDetector.detectChanges();
      return;
    }
    this.checkPermissions();
    this.request = new Request({});

    this.request.status = 'DRAFT';

    this.requestsService
      .grabRequestId(this.project.id)
      .subscribe((data: any) => {
        this.request.id = data.id;
        this.request.itemsByType = [];
        this.request.items = [];
        this.buildItemTypes();
        this.changeDetector.detectChanges();
      });
  }

  buildItemTypes() {
    this.itemTypes = [];
    if (!this.project) {
      return;
    }

    if (this.project.laborCostsEnabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'labor', label: 'Labor', sortOrder: 0 }
      ];
    }
    if (this.project.equipmentCostsEnabled) {
      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipment.active',
          label: 'Equipment|Active',
          sortOrder: 1
        }
      ];

      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipment.standby',
          label: 'Equipment|Standby',
          sortOrder: 2
        }
      ];

      this.itemTypes = [
        ...this.itemTypes,
        {
          value: 'equipment.rental',
          label: 'Equipment|Rental',
          sortOrder: 3
        }
      ];
    }

    if (this.project.materialCostsEnabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'material', label: 'Material', sortOrder: 4 }
      ];
    }
    if (this.project.otherCostsEnabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'other', label: 'Other', sortOrder: 6 }
      ];
    }
    if (this.project.subcontractorCostsEnabled) {
      this.itemTypes = [
        ...this.itemTypes,
        { value: 'subcontractor', label: 'Subcontractor', sortOrder: 5 }
      ];
    }

    const itemTypeList: ItemList[] = [];
    for (let i = 0; i < this.itemTypes.length; i++) {
      const t = this.itemTypes[i];
      const items: Item[] = this.request.getItemsForType(t.value);
      if (
        this.canSubmitRequest ||
        (this.canManageRequest && items && items.length > 0)
      ) {
        const il = new ItemList(t.value, items);
        itemTypeList.push(il);
      }
    }
    this.request.itemsByType = itemTypeList;
    this.changeDetector.detectChanges();
  }

  refreshRequest() {
    this.requestsService.getRequest(this.request.id).subscribe(
      (r: Request) => {
        this.request = r;
        this.changeDetector.detectChanges();
        this.projectsService
          .getProject(this.request.projectId)
          .subscribe((p: Project) => {
            this.project = p;
            this.checkPermissions();
            this.buildItemTypes();
            this.changeDetector.detectChanges();
          });
      },
      err => {}
    );
  }

  openSnackBar(message: string, type: string, action: string) {
    this.config = { duration: this.duration };
    this.snackBar.open(message, action, this.config);
  }

  itemsChanged(event: any) {
    this.request.calculateTotals();
  }

  approveRequest() {
    this._confirmApproveRequest = true;
  }

  cancelApproveRequest() {
    this._confirmApproveRequest = false;
  }

  confirmApproveRequest() {
    this.requestsService.approve(this.request.id).subscribe(
      (response: any) => {
        this._confirmApproveRequest = false;
        this.openSnackBar(' Request Approved', 'ok', 'OK');
        this.refreshRequest();
        this._confirmApproveRequest = false;
      },
      err => {
        this.openSnackBar(
          'An error occurred trying to approve request',
          'ok',
          'OK'
        );
      }
    );
  }

  approveAll(event: any) {
    this.selectedItems = [];

    this.selectedItemType = event.itemType;
    for (let i = 0; i < this.request.itemsByType.length; i++) {
      const lit: ItemList = this.request.itemsByType[i];

      if (lit.type === event.itemType) {
        this.selectedItems = lit.items;
        break;
      }
    }
    if (this.selectedItems && this.selectedItems.length > 0) {
      this._confirmApproveAllModal = true;
    }
  }

  cancelApproveAll() {
    this._confirmApproveAllModal = false;
  }

  confirmApproveAll() {
    this.requestsService
      .approveLineItemsAsIs(this.selectedItems)
      .then((response: any) => {
        this._confirmApproveAllModal = false;
        this.openSnackBar(
          this.selectedItems.length + ' Line Items Approved',
          'ok',
          'OK'
        );
        this.refreshRequest();
      })
      .catch((error: any) => {
        this._confirmApproveAllModal = false;
        this.openSnackBar('Line Items Were NOT approved', 'error', 'OK');
      });
  }
}
