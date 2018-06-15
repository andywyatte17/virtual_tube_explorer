import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class PlacesSvgService {

  constructor() { }

  public readonly placesVisitedDidChange = new EventEmitter<Array<string>>();

}
