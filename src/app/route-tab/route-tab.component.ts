import { Component, OnInit } from "@angular/core";
import { Naptan, MakeTubeNaptans } from "../naptans/naptans";
import { StationModel } from "./station-model";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  DaySet,
  TimetableService,
  FromLineToTimes,
  Times,
  PaddedTime
} from "../timetable.service";
import { HhMm } from "../time";
import { MakeTableEntry, ITableEntryEx, ITableEntry, MakeTableEntryFromObject } from "./table-entry";
import { osm_url } from "../map/osm-tile";
import { CheckStations, CheckStationsR, Lookup } from "../naptans/latitude_longitude";
import { initialize, setLatLonZoom } from "../map/slippy";
import { Check } from "../tfl_api/adjacent-stations";
import { ApiKeys } from "../../environments/api-key";

declare var base64js: any;
declare var TextEncoderLite: any;
declare var TextEncoder: any;

class DayOfWeek {
  constructor(public readonly name: string, public readonly id: DaySet) { }
}

class Train {
  constructor(
    public readonly fromId: string,
    public readonly toId: string,
    public readonly startTimeHhMm: string,
    public readonly endTimeHhMm: string,
    public readonly isNonTrain: boolean,
    public readonly naptansVisited: Array<string>
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
        let hh = [
          parseInt(this.startTimeHhMm.split(":")[0]),
          parseInt(this.endTimeHhMm.split(":")[0])
        ];
        let mm = [
          parseInt(this.startTimeHhMm.split(":")[1]),
          parseInt(this.endTimeHhMm.split(":")[1])
        ];
        let mmDiff = hh[1] * 60 - hh[0] * 60 + mm[1] - mm[0];
        return mmDiff < 10 ? "0" + mmDiff.toString() : mmDiff.toString();
      };
      return (
        `${this.startTimeHhMm} + 00:${diff()} : ` +
        `${Train.Lookup(this.fromId)} => ${Train.Lookup(this.toId)}`
      );
    }
    return (
      `${this.startTimeHhMm} - ${this.endTimeHhMm} : ` +
      `${Train.Lookup(this.fromId)} => ${Train.Lookup(this.toId)}`
    );
  }
}

@Component({
  selector: "app-route-tab",
  templateUrl: "./route-tab.component.html",
  styleUrls: ["./route-tab.component.css"]
})
export class RouteTabComponent implements OnInit {
  public time = "05:00";
  public tableEntries = new Array<ITableEntryEx>();

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

  public _selectedDayOfWeek: string = "Monday";

  get selectedDayOfWeek() {
    return this._selectedDayOfWeek;
  }

  set selectedDayOfWeek(dow: string) {
    this._selectedDayOfWeek = dow;
    this.selectedDayOfWeekEx = this.daysOfWeek.find(
      (x: DayOfWeek) => x.name == dow
    );
  }

  public selectedDayOfWeekEx = new DayOfWeek("Monday", DaySet.mon);

  public bumpTrains() {
    this._trains = new Array<Train>();
    if (this.tableEntries.length == 0) {
      // Set trains up with stations for
      const fromId = this.stationModel.selectedStationId;
      //this.timetable.LookupTimetable(fromId,
    } else {
      const line = this.stationModel.selectedLine;
      const isNonTrain = line == "walk" || line == "bus/other";
      const t = this.tableEntries[this.tableEntries.length - 1].toTime;
      const toId = this.stationModel.selectedStationId;
      const fromId = this.tableEntries[this.tableEntries.length - 1]
        .toStationId;
      let ApplicationIDKey = ApiKeys.ApplicationIDKey();
      const hhmm = HhMm.fromString(t);
      if (!hhmm) return;

      this.trainIsProcessing = true;

      this.timetable
        .LookupTimetable(
          line,
          fromId,
          toId,
          this.selectedDayOfWeekEx.id,
          hhmm.hh,
          hhmm.mm,
          ApplicationIDKey ? ApplicationIDKey[0] : null,
          ApplicationIDKey ? ApplicationIDKey[1] : null
        )
        .then((v: FromLineToTimes) => {
          //console.log(v.times);
          this._trains = v.times.map((x: Times) => {
            let t1 = PaddedTime(x.startHh, x.startMm);
            let t2 = PaddedTime(x.endHh, x.endMm);
            // console.log(t1, t2);
            return new Train(fromId, toId, t1, t2, isNonTrain, x.stopNaptans);
          });
          
          this.train = this._trains.length==0 ? null : this._trains[0].text;

          //console.log(this._trains);
          this.trainIsProcessing = false;
        });
    }
  }

  get fromStation(): string {
    return this.tableEntries.length == 0
      ? ""
      : this.tableEntries[this.tableEntries.length - 1].toStationName;
  }

  bumpMap() {
    let nll = Lookup(this.fromStation);
    if (nll) setLatLonZoom(parseFloat(nll.lat), parseFloat(nll.lon));
  }

  get trains() {
    return this._trains;
  }

  train: string = null;

  route_json: SafeUrl = null;

  trainDidChange(v: any) {
    console.log(this.train);
  }

  private calculateNaptansLeft(nextNaptans: Array<string>): Array<string> {
    let naptansIds = new Set<string>();
    MakeTubeNaptans().forEach((value: Naptan) => {
      naptansIds.add(value.id);
    });
    this.tableEntries.forEach((v: ITableEntryEx) => {
      v.naptansVisited.forEach((naptanId: string) => {
        naptansIds.delete(naptanId);
      });
    });
    nextNaptans.forEach((naptanId: string) => {
      naptansIds.delete(naptanId);
    });
    let result = new Array<string>();
    naptansIds.forEach((value: string) => {
      result.push(value);
    });
    return result;
  }

  addTrain() {
    const found = this.trains.find((train: Train) => train.text === this.train);
    if (found) {
      const n = this.tableEntries.length - 1;
      this.tableEntries.push(
        MakeTableEntry(
          n + 2,
          found.fromId,
          found.startTimeHhMm,
          found.toId,
          found.endTimeHhMm,
          this.stationModel.selectedLine,
          found.naptansVisited,
          this.calculateNaptansLeft(found.naptansVisited)
        )
      );

      let result = {
        selectedDayOfWeekEx: this.selectedDayOfWeekEx,
        tableEntries: this.tableEntries.map((te: ITableEntryEx) =>
          te.serialize()
        )
      };

      const Base64Encode = (str, encoding = "utf-8") => {
        var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
        return base64js.fromByteArray(bytes);
      };

      let route_json = JSON.stringify(result);
      route_json = Base64Encode(route_json);
      route_json = "data:application/json;base64," + route_json;
      this.route_json = this.sanitizer.bypassSecurityTrustUrl(route_json);

      this.bumpMap();
    }
  }

  fileLoad(evt: any) {
    let input = <HTMLInputElement>evt.target;
    var files = input.files;
    let blob: Blob = files[0].slice();

    let reader = new FileReader();
    reader.addEventListener("loadend", () => {
      try {
        let json = JSON.parse(reader.result);
        this.selectedDayOfWeek = json.selectedDayOfWeekEx.name;
        let tis = <Array<ITableEntry>>json.tableEntries;
        this.tableEntries = this.tableEntries.filter(() => false);
        tis.forEach((ti: ITableEntry) => {
          this.tableEntries.push(MakeTableEntryFromObject(ti));
        });
      } catch (e) {}

      this.bumpMap();
    });
    reader.readAsText(blob);
  }

  refresh() {
    this.bumpTrains();
    this.train = this.trains.length == 0 ? "" : this.trains[0].text;
  }

  constructor(
    private http: HttpClient,
    private timetable: TimetableService,
    private sanitizer: DomSanitizer
  ) {
    //CheckStationsR();
  }

  stationModel = new StationModel(this.http);

  trainIsProcessing = false;

  private googleMapIsInitialized = false;

  private tryInitializeGoogleMap() {
    if (this.googleMapIsInitialized) return true;
    const gmid = "google_map";
    let gm = document.getElementById(gmid);
    if (!gm) {
      setTimeout( () => this.tryInitializeGoogleMap(), 1000 );
      return false;
    }
    if(gm.hidden)
      return;
    initialize(gmid);
    this.googleMapIsInitialized = true;
    return true;
  }

  ngOnInit() {
    this.tryInitializeGoogleMap();
  }

  dayOfWeekChanged() {
    console.log(this.selectedDayOfWeekEx);
  }

  timeDidChange(time: string) {
    this.time = time;
  }

  start() {
    const toStationId = this.stationModel.selectedStationId;
    const nextNaptanIds = [toStationId];

    this.tableEntries.push(
      MakeTableEntry(
        1,
        "" /*fromStationId*/,
        "" /*fromTime*/,
        toStationId,
        this.time,
        "" /*line*/,
        nextNaptanIds,
        this.calculateNaptansLeft(nextNaptanIds)
      )
    );

    this.bumpMap();
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
      const nextNaptanIds = [this.tableEntries[n].toStationId];
      this.tableEntries.push(
        MakeTableEntry(
          n + 2,
          this.tableEntries[n].toStationId,
          this.tableEntries[n].toTime,
          this.tableEntries[n].toStationId,
          this.MakeTime(this.tableEntries[n].toTime, minutes),
          "walk",
          nextNaptanIds,
          this.calculateNaptansLeft(nextNaptanIds)
        )
      );
      this.bumpMap();
    }
  }

  walkOptions = [1, 2, 5, 10, 15];

  private _walkValue = "1";

  get walkValue() {
    return this._walkValue;
  }

  set walkValue(x: string) {
    this._walkValue = x;
    this.bumpWalkOptions();
  }

  get fromInfo() {
    return (
      this.fromStation +
      " @ " +
      this.tableEntries[this.tableEntries.length - 1].toTime +
      ` (${this.selectedDayOfWeek})`
    );
  }

  clickWalkRadio() {
    this.bumpWalkOptions();
  }

  bumpWalkOptions() {
    switch (parseInt(this.walkValue)) {
      case 1:
        this.walkOptions = [1, 2, 5, 10, 15];
        return;
      case 2:
        this.walkOptions = [2, 3, 5, 8, 13];
        return;
      case 3:
        this.walkOptions = [2, 5, 10, 15, 20];
        return;
    }
  }

  popLast() {
    this.tableEntries.pop();
  }

  private zoom = 14;

  zoomMinus() {
    this.zoom -= 1;
    this.zoom = Math.min(17, Math.max(1, this.zoom));
  }

  zoomPlus() {
    this.zoom += 1;
    this.zoom = Math.min(17, Math.max(1, this.zoom));
  }

  slimmedTableEntries() {
    const n = this.tableEntries.length;
    return this.tableEntries.filter((x, index: number) => {
      return index < 3 || index > n - 3;
    });
  }
}
