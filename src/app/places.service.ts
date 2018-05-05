import { Injectable, EventEmitter } from '@angular/core';
import { Arrival } from './tfl_api/arrivals';

@Injectable()
export class PlacesService {

  constructor() { }

  public readonly arrivalSelected = new EventEmitter<Arrival>();
}
