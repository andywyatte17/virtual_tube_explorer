import { Component, OnInit } from '@angular/core';
import { Naptan, MakeTubeNaptans } from '../naptans/naptans';
import { StationModel } from './station-model';
import { HttpClient } from '@angular/common/http';

class TableEntry {
  constructor(public readonly stationId: string,
    public readonly lineIdToThis: string,
    public readonly currentTime: string) {
  }
  get stationName() {
    const found = TableEntry.stations.find((n: Naptan) => n.id == this.stationId);
    return found ? found.name : "???";
  }
  private static stations = MakeTubeNaptans();
};

@Component({
  selector: 'app-route-tab',
  templateUrl: './route-tab.component.html',
  styleUrls: ['./route-tab.component.css']
})
export class RouteTabComponent implements OnInit {

  public time = "05:00";
  public tableEntries = new Array<TableEntry>();

  constructor(private http: HttpClient) {
  }

  stationModel = new StationModel(this.http);

  ngOnInit() {
  }

  timeDidChange(time: string) {
  }

  add() {
    this.tableEntries.push(
      new TableEntry(this.stationModel.selectedStationId,
        this.stationModel.selectedLine,
        this.time));
  }

  popLast() {
    this.tableEntries.pop();
  }
}
