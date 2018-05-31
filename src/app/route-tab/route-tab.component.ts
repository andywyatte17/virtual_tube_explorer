import { Component, OnInit } from "@angular/core";
import { Naptan, MakeTubeNaptans } from "../naptans/naptans";
import { StationModel } from "./station-model";
import { HttpClient } from "@angular/common/http";
import {
  DaySet,
  TimetableService,
  FromLineToTimes,
  Times,
  PaddedTime
} from "../timetable.service";

class TableEntry {
  constructor(
    public index: number,
    public readonly fromStationId: string,
    public readonly fromTime: string,
    public readonly toStationId: string,
    public readonly toTime: string,
    public readonly lineId: string
  ) { }
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

class DayOfWeek {
  constructor(public readonly name: string, public readonly id: DaySet) { }
}

class Train {
  constructor(
    public readonly fromId: string,
    public readonly toId: string,
    public readonly startTimeHhMm: string,
    public readonly endTimeHhMm: string,
    public readonly isNonTrain: boolean
  ) { }

  private static stations = MakeTubeNaptans();

  private static Lookup(naptanId: string): string {
    let found = Train.stations.find((x: Naptan) => x.id == naptanId);
    if (found) return found.name;
    return null;
  }

  get text() {
    if (this.isNonTrain) {
      const diff = () => {
        let hh = [parseInt(this.startTimeHhMm.split(":")[0]), parseInt(this.endTimeHhMm.split(":")[0])];
        let mm = [parseInt(this.startTimeHhMm.split(":")[1]), parseInt(this.endTimeHhMm.split(":")[1])];
        let mmDiff = hh[1] * 60 - hh[0] * 60 + mm[1] - mm[0];
        return mmDiff < 10 ? ("0" + mmDiff.toString()) : mmDiff.toString();
      };
      return `${this.startTimeHhMm} + 00:${diff()} : ` +
        `${Train.Lookup(this.fromId)} => ${Train.Lookup(this.toId)}`;
    }
    return `${this.startTimeHhMm} - ${this.endTimeHhMm} : ` +
      `${Train.Lookup(this.fromId)} => ${Train.Lookup(this.toId)}`;
  }
}

@Component({
  selector: "app-route-tab",
  templateUrl: "./route-tab.component.html",
  styleUrls: ["./route-tab.component.css"]
})
export class RouteTabComponent implements OnInit {
  public time = "05:00";
  public tableEntries = new Array<TableEntry>();

  public readonly daysOfWeek = (() => {
    let result = Array<DayOfWeek>();
    result.push(new DayOfWeek("Monday", DaySet.mon));
    result.push(new DayOfWeek("Tuesday", DaySet.tue));
    result.push(new DayOfWeek("Wednesday", DaySet.wed));
    result.push(new DayOfWeek("Thursday", DaySet.thu));
    result.push(new DayOfWeek("Friday", DaySet.fri));
    result.push(new DayOfWeek("Saturday", DaySet.sat));
    result.push(new DayOfWeek("Sunday", DaySet.sun));
    return result;
  })();

  private _trains = new Array<Train>();

  public selectedDayOfWeek : string = "Monday";

  public bumpTrains() {
    this._trains = new Array<Train>();
    if (this.tableEntries.length == 0) {
      // Set trains up with stations for
      const fromId = this.stationModel.selectedStationId;
      //this.timetable.LookupTimetable(fromId,
    } else {
      const line = this.stationModel.selectedLine;
      const isNonTrain = line == "walk" || line == "bus";
      const t = this.tableEntries[this.tableEntries.length - 1].toTime;
      const toId = this.stationModel.selectedStationId;
      const fromId = this.tableEntries[this.tableEntries.length - 1]
        .toStationId;
      this.timetable
        .LookupTimetable(
          line,
          fromId,
          toId,
          this.dayOfWeek.id,
          parseInt(t.split(":")[0]),
          parseInt(t.split(":")[1]),
          null,
          null
        )
        .then((v: FromLineToTimes) => {
          //console.log(v.times);
          this._trains = v.times.map((x: Times) => {
            let t1 = PaddedTime(x.startHh, x.startMm);
            let t2 = PaddedTime(x.endHh, x.endMm);
            // console.log(t1, t2);
            return new Train(fromId, toId, t1, t2, isNonTrain);
          });
          //console.log(this._trains);
        });
    }
  }

  get fromStation(): string {
    return this.tableEntries.length == 0 ? "" : this.tableEntries[this.tableEntries.length - 1].toStationName;
  }

  get trains() {
    return this._trains;
  }

  train: string = null;

  trainDidChange(v:any) {
    console.log(this.train);
  }

  addTrain() {
    const found = this.trains.find((train: Train) => train.text === this.train);
    if (found) {
      const n = this.tableEntries.length - 1;
      this.tableEntries.push(
        new TableEntry(
          n + 2,
          found.fromId,
          found.startTimeHhMm,
          found.toId,
          found.endTimeHhMm,
          this.stationModel.selectedLine)
      );
    }
  }

  refresh() {
    this.bumpTrains();
    this.train = this.trains.length==0 ? "" : this.trains[0].text;
  }

  public dayOfWeek = new DayOfWeek("Monday", DaySet.mon);

  constructor(private http: HttpClient, private timetable: TimetableService) { }

  stationModel = new StationModel(this.http);

  ngOnInit() { }

  dayOfWeekChanged() {
    console.log(this.dayOfWeek);
  }

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
    const pad = (n: number) => {
      return n < 10 ? "0" + n.toString() : n.toString();
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

  walk(value: number) {
    const minutes = this.walkOptions[value];
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

  walkOptions = [1, 2, 5, 10, 15];

  private _walkValue = "1";

  get walkValue() { return this._walkValue; }

  set walkValue(x: string) {
    this._walkValue = x;
    this.bumpWalkOptions();
  }

  clickWalkRadio() { this.bumpWalkOptions(); }

  bumpWalkOptions() {
    switch (parseInt(this.walkValue)) {
      case 1: this.walkOptions = [1, 2, 5, 10, 15]; return;
      case 2: this.walkOptions = [2, 3, 5, 8, 13]; return;
      case 3: this.walkOptions = [2, 5, 10, 15, 20]; return;
    }
  }

  popLast() {
    this.tableEntries.pop();
  }
}
