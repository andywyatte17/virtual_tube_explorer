import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export enum DaySet {
  _monThu_ = "Monday - Thursday",
  _monFri_ = "Monday - Friday",
  mon = "Mondays",
  tue = "Tuesdays",
  wed = "Wednesdays",
  thu = "Thursdays",
  fri = "Fridays",
  sat = "Saturdays and Public Holidays",
  sun = "Sunday"
}

function AreEquivalentImpl(daySet1: DaySet, daySet2: DaySet) {
  if (daySet1 == daySet2) return true;
  // ...
  if (daySet1 == DaySet.mon && daySet2 == DaySet._monThu_) return true;
  if (daySet1 == DaySet.tue && daySet2 == DaySet._monThu_) return true;
  if (daySet1 == DaySet.wed && daySet2 == DaySet._monThu_) return true;
  if (daySet1 == DaySet.thu && daySet2 == DaySet._monThu_) return true;
  // ...
  if (daySet1 == DaySet.mon && daySet2 == DaySet._monFri_) return true;
  if (daySet1 == DaySet.tue && daySet2 == DaySet._monFri_) return true;
  if (daySet1 == DaySet.wed && daySet2 == DaySet._monFri_) return true;
  if (daySet1 == DaySet.thu && daySet2 == DaySet._monFri_) return true;
  if (daySet1 == DaySet.fri && daySet2 == DaySet._monFri_) return true;
  // ...
  return false;
}

export function AreEquivalent(daySet1: DaySet, daySet2: DaySet) {
  return AreEquivalentImpl(daySet1, daySet2) || AreEquivalentImpl(daySet2, daySet1);
}

enum Direction {
  inbound = "inbound",
  outbound = "outbound"
}

export class Times {
  constructor(
    public readonly startHh: number,
    public readonly startMm: number,
    public readonly endHh: number,
    public readonly endMm: number
  ) {}
}

export function PaddedTime(hh: number, mm: number) {
  let b1 = (hh < 10) ? ("0" + hh.toString()) : hh.toString();
  let b2 = (mm < 10) ? ("0" + mm.toString()) : mm.toString();
  return `${b1}:${b2}`;
}

export class FromLineToTimes {
  constructor(
    public readonly fromNaptanId: string,
    public readonly line: string,
    public readonly toNaptanId: string,
    public readonly times: Array<Times>
  ) {}
}

@Injectable()
export class TimetableService {
  constructor(public readonly http: HttpClient) {}

  public LookupTimetable(
    line: string,
    fromNaptanId: string,
    toNaptanId: string,
    day: DaySet,
    ApplicationID: string = null,
    ApplicationKey: string = null
  ) {
    let makePromise = (direction: Direction) => {
      let url = `https://api.tfl.gov.uk/Line/${line}/Timetable/${fromNaptanId}?direction=${direction}`;

      if (ApplicationID && ApplicationKey)
        url += `&app_id=${ApplicationID}&app_key=${ApplicationKey}`;

      return new Promise((resolve, reject) => {
        this.http.get<any>(url).subscribe(
          (value: any) => {
            resolve(value);
          },
          (error: any) => {
            console.log("Error in http.get -", url, error);
            resolve(null);
          }
        );
      });
    };

    const times = new Array<Times>();
    const tr = new FromLineToTimes(fromNaptanId, line, toNaptanId, times);

    let processResult = (result: any) => {
      /*
      https://api.tfl.gov.uk/Line/Bakerloo/Timetable/940GZZLUCHX?direction=inbound
      
      timetable.routes.#.
        .stationIntervals
          .#
            .id = "0", "1"...
            .intervals.#
              .stopId: "NAPTAN"
              .timeToArrival: #
        .schedules.#
          .name = "Monday - Friday" / "Saturdays and Public Holidays" / "Sunday"
          .knownJourneys.#
             .hour:"#"
             .minute:"#"
             .intervalId:#
      */
      (<Array<any>>result.timetable.routes).forEach((route: any) => {
        type T = { stopId: string; timeToArrival: number };
        let m = new Map<string, Array<T>>();
        // ...
        let si = <Array<any>>route.stationIntervals;
        si.forEach((stationInterval: any, index: number) => {
          let id: string = stationInterval.id;
          let intervals: Array<any> = stationInterval.intervals;
          let r = new Array<T>();
          intervals.forEach((interval: any) => {
            r.push({
              stopId: interval.stopId,
              timeToArrival: interval.timeToArrival
            });
          });
          r = r.filter((v: T) => {
            return v.stopId == toNaptanId;
          });
          m.set(id, r);
        });
        m.forEach((value: any, key: string) => {
          //console.log(key, value);
        });
        // ...
        let schedules = <Array<any>>route.schedules;
        schedules.forEach((schedule: any, index: number) => {
          if ( !AreEquivalent(schedule.name, day) ) return;
          let kjs: Array<any> = schedule.knownJourneys;
          kjs.forEach(
            (kj: { hour: string; minute: string; intervalId: number }) => {
              let iid = kj.intervalId.toString();
              if (m.has(iid)) {
                let interval = m
                  .get(iid)
                  .filter((t: T) => t.stopId == toNaptanId);
                if (interval && interval.length > 0) {
                  let hh = parseInt(kj.hour);
                  let mm = parseInt(kj.minute) + interval[0].timeToArrival;
                  while (mm > 59) {
                    hh += 1;
                    mm -= 60;
                  }
                  times.push(
                    new Times(parseInt(kj.hour), parseInt(kj.minute), hh, mm)
                  );
                  //console.log(result);
                }
              }
            }
          );
        });
        // ...
      });
    };

    return new Promise<FromLineToTimes>((resolve, reject) => {
      makePromise(Direction.inbound)
        .then((result: any) => {
          if (result) processResult(result);
          return makePromise(Direction.outbound);
        })
        .then((result: any) => {
          if (result) processResult(result);
        })
        .then(() => {
          resolve(tr);
        })
        .catch(err => reject(err));
    });
  }
}
