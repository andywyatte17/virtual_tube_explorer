//
// timetable.service.ts
//

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NumberSymbol } from "@angular/common";
import {
  ExtractStationIntervals,
  Route,
  IntervalId,
  TflRouteAPI,
  JourneyInfo,
  Schedule,
  StationIntervalMapper,
  KnownJourney
} from "./timetable-logic";
import { HhMm } from "./time";

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
  return (
    AreEquivalentImpl(daySet1, daySet2) || AreEquivalentImpl(daySet2, daySet1)
  );
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
    public readonly endMm: number,
    public readonly stopNaptans: Array<string>
  ) { }
}

export function PaddedTime(hh: number, mm: number) {
  let b1 = hh < 10 ? "0" + hh.toString() : hh.toString();
  let b2 = mm < 10 ? "0" + mm.toString() : mm.toString();
  return `${b1}:${b2}`;
}

export class FromLineToTimes {
  constructor(
    public readonly fromNaptanId: string,
    public readonly line: string,
    public readonly toNaptanId: string,
    public readonly times: Array<Times>
  ) { }
}

@Injectable()
export class TimetableService {
  constructor(public readonly http: HttpClient) { }

  private MakeWalkTimetablePromise(
    line: string,
    fromNaptanId: string,
    toNaptanId: string,
    day: DaySet,
    startHh: number,
    startMm: number
  ) {
    return new Promise<FromLineToTimes>((resolve, reject) => {
      let times = new Array<Times>();
      let result = new FromLineToTimes(fromNaptanId, line, toNaptanId, times);
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30].forEach(
        (minutes: number) => {
          let mm = startMm + minutes;
          let hh = startHh;
          while (mm > 59) {
            hh += 1;
            mm -= 60;
          }
          times.push(
            new Times(startHh, startMm, hh, mm, [fromNaptanId, toNaptanId])
          );
        }
      );
      resolve(result);
    });
  }

  public LookupTimetable(
    line: string,
    fromNaptanId: string,
    toNaptanId: string,
    day: DaySet,
    startHh: number,
    startMm: number,
    ApplicationID: string = null,
    ApplicationKey: string = null
  ) {
    if (line == "walk" || line == "bus")
      return this.MakeWalkTimetablePromise(
        line,
        fromNaptanId,
        toNaptanId,
        day,
        startHh,
        startMm
      );

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

    let processResult = (api: TflRouteAPI) => {
      api.timetable.routes.forEach((route: Route) => {
        const m = ExtractStationIntervals(fromNaptanId, toNaptanId, route);

        // ...
        route.schedules.forEach((schedule: Schedule, index: number) => {
          if (!AreEquivalent(<DaySet>schedule.name, day)) return;
          const kjs = schedule.knownJourneys;
          kjs.forEach(
            (kj: KnownJourney) => {
              let iid = kj.intervalId.toString();
              let stationIntervalId = { intervalId: iid };

              const get = (sii: IntervalId) => {
                let rv: JourneyInfo = null;
                m.forEach((value: JourneyInfo, key: IntervalId) => {
                  if (sii.intervalId == key.intervalId)
                    rv = value;
                });
                return rv;
              };

              const interval = get(stationIntervalId);
              if (interval) {
                //console.log("intervals.length", intervals.length);
                let hh = parseInt(kj.hour);
                let mm = parseInt(kj.minute) + interval.timeToArrival;
                while (mm > 59) {
                  hh += 1;
                  mm -= 60;
                }
                times.push(
                  new Times(
                    parseInt(kj.hour),
                    parseInt(kj.minute),
                    hh,
                    mm,
                    interval.naptansSoFar
                  )
                );
                //console.log(result);
              }
            }
          );
        });
        // ...
      });
    };

    return new Promise<FromLineToTimes>((resolve, reject) => {
      makePromise(Direction.outbound)
        .then((result: TflRouteAPI) => {
          if (result) processResult(result);
          return makePromise(Direction.inbound);
          //return new Promise( (resolve,reject) => resolve(<TflRouteAPI>null) );
        })
        .then((result: TflRouteAPI) => {
          if (result) processResult(result);
          return true;
        })
        .then((b: boolean) => {
          let timesSorted = tr.times.sort((a: Times, b: Times) => {
            const a1 = (a.startHh * 60 + a.startMm);
            const b1 = (b.startHh * 60 + b.startMm);
            return a1 < b1 ? -1 : b1 < a1 ? 1 : 0;
          });
          resolve(new FromLineToTimes(tr.fromNaptanId, tr.line, tr.toNaptanId, timesSorted));
        })
        .catch(err => reject(err));
    });
  }
}
