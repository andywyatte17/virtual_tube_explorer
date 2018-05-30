import { Component, OnInit } from "@angular/core";
import { Naptan, MakeTubeNaptans } from "../naptans/naptans";
import { StationModel } from "./station-model";
import { HttpClient } from "@angular/common/http";

class TableEntry {
  constructor(
    public index: number,
    public readonly fromStationId: string,
    public readonly fromTime: string,
    public readonly toStationId: string,
    public readonly toTime: string,
    public readonly lineId: string
  ) {}
  get fromStationName() {
    const found = TableEntry.stations.find(
      (n: Naptan) => n.id == this.fromStationId
    );
    return found ? found.name : "???";
  }
  get toStationName() {
    const found = TableEntry.stations.find(
      (n: Naptan) => n.id == this.toStationId
    );
    return found ? found.name : "???";
  }
  private static stations = MakeTubeNaptans();
}

@Component({
  selector: "app-route-tab",
  templateUrl: "./route-tab.component.html",
  styleUrls: ["./route-tab.component.css"]
})
export class RouteTabComponent implements OnInit {
  public time = "05:00";
  public tableEntries = new Array<TableEntry>();

  constructor(private http: HttpClient) {}

  stationModel = new StationModel(this.http);

  ngOnInit() {}

  timeDidChange(time: string) {
    this.time = time;
  }

  add() {
    let fromStationId = "";
    let fromTime = "";
    const n = this.tableEntries.length - 1;
    if (n >= 0) {
      fromStationId = this.tableEntries[n].toStationId;
      fromTime = this.tableEntries[n].toTime;
    }

    this.tableEntries.push(
      new TableEntry(
        n + 2,
        fromStationId,
        fromTime,
        this.stationModel.selectedStationId,
        this.time,
        this.stationModel.selectedLine
      )
    );
  }

  private MakeTime(oldTime: string, minutes: number): string {
    const pad = (n:number) => {
      return n<10 ? '0' + n.toString() : n.toString();
    };
    let bits = oldTime.split(":");
    let hh = parseInt(bits[0]);
    let mm = parseInt(bits[1]);
    mm += minutes;
    while (mm > 59) {
      mm -= 60;
      hh += 1;
    }
    return `${pad(hh)}:${pad(mm)}`;
  }

  walk(minutes: number) {
    if (this.tableEntries.length > 0) {
      const n = this.tableEntries.length - 1;
      this.tableEntries.push(
        new TableEntry(
          n + 2,
          this.tableEntries[n].toStationId,
          this.tableEntries[n].toTime,
          this.tableEntries[n].toStationId,
          this.MakeTime(this.tableEntries[n].toTime, minutes),
          "walk"
        )
      );
    }
  }

  popLast() {
    this.tableEntries.pop();
  }
}
