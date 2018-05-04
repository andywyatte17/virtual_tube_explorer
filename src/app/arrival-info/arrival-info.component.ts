import { Component, OnInit } from '@angular/core';
import { Arrival } from '../tfl_api/arrivals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Naptan } from '../naptans/naptans';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-arrival-info',
  templateUrl: './arrival-info.component.html',
  styleUrls: ['./arrival-info.component.css']
})
export class ArrivalInfoComponent implements OnInit {

  constructor(public readonly activeModal: NgbActiveModal, public readonly http: HttpClient) { }

  ngOnInit() {
  }

  private arrival_: Arrival;

  set arrival(arrivalValue: Arrival) {
    this.arrival_ = arrivalValue;

    Naptan.TubeLinesForNaptan(this.arrival_.naptanId, this.http).then((v) => console.dir(v));
  }

  get arrivalText() {
    return JSON.stringify(this.arrival_, null, 2);
  }
}
