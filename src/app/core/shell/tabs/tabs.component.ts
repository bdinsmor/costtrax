import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { appAnimations } from '@app/core/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  tabLinks: Array<any> = [];
  activeLinkIndex = 0;

  constructor(private router: Router) {
    this.tabLinks = [
      { label: 'Home', link: '/home', index: 0 },
      { label: 'Requests', link: '/requests', index: 1 },
      { label: 'Projects', link: '/projects', index: 2 },
      { label: 'Messages', link: '/messages', index: 3 },
      { label: 'Contractors', link: '/companies', index: 4 }
    ];
  }

  ngOnInit() {
    this.router.events.subscribe(res => {
      this.activeLinkIndex = this.tabLinks.indexOf(this.tabLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }
}
