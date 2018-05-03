import { Component, OnInit } from '@angular/core';
import { Arrival } from '../tfl_api/arrivals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-arrival-info',
  templateUrl: './arrival-info.component.html',
  styleUrls: ['./arrival-info.component.css']
})
export class ArrivalInfoComponent implements OnInit {

  private arrival_: Arrival;

  set arrival(arrivalValue: Arrival) {
    this.arrival_ = arrivalValue;
  }

  get arrivalText() {
    return JSON.stringify(this.arrival_, null, 2);
  }

  constructor(public readonly activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
