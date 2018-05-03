import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';

import {StartupComponent} from './startup/startup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  // ...

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    let options:
        NgbModalOptions = {backdrop: 'static', keyboard: false};
    const modalRef = this.modalService.open(StartupComponent, options);
  }
}
