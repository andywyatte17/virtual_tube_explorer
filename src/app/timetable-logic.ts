//
// timetable-logic.ts
//
// Code for working with the TFL API response.
//

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

export type Interval = {
  /** NaptanID */
  stopId: string;
  /** Time in minutes */
  timeToArrival: number;
};

export type StationInterval = {
  id: "0" | "1" | "2" | "3" | string;
  intervals: Array<Interval>;
};

export type KnownJourney = {
  hour: string;
  minute: string;
  intervalId: string;
};

export type Schedule = {
  name: "Monday - Friday" | "Saturdays and Public Holidays" | "Monday" | string;
  knownJourneys: Array<KnownJourney>;
};

export type Route = {
  stationIntervals: Array<StationInterval>;
  schedules: Array<Schedule>;
};

export type TflRouteAPI = {
  timetable: {
    routes: Array<Route>;
  };
};

export type JourneyInfo = {
  stopId: string;
  timeToArrival: number;
  naptansSoFar: Array<string>;
};

export class StationIntervalV {
  constructor(public readonly intervalId: string) {}
}

export function StationIntervalMapper(r: JourneyInfo[]) {
  return r.map(x => {
    return {
      sid: x.stopId,
      tta: x.timeToArrival,
      nc: x.naptansSoFar.length,
      naps: JSON.stringify(x.naptansSoFar, null, 0)
    };
  });
}

/**
 *
 * @param route The route value from TFL API > timetable.routes.#
 */
export function ExtractStationIntervals(
  fromNaptanId: string,
  toNaptanId: string,
  route: Route
) {
  let m = new Map<StationIntervalV, JourneyInfo>();
  // ...
  let si = route.stationIntervals;
  si.forEach((stationInterval: any, index: number) => {
    let id: string = stationInterval.id;
    // console.log("intervalId", id);
    let intervals: Array<any> = stationInterval.intervals;
    let r = new Array<JourneyInfo>();
    let naptansSoFar = [fromNaptanId];
    intervals.forEach((interval: any) => {
      naptansSoFar.push(interval.stopId);
      let v = <JourneyInfo>{
        stopId: interval.stopId,
        timeToArrival: interval.timeToArrival,
        naptansSoFar: JSON.parse(JSON.stringify(naptansSoFar))
      };
      //console.log(v);
      r.push(v);
    });
    let ji = r.find((v: JourneyInfo) => {
      return v.stopId == toNaptanId;
    });
    /*
    console.log(
      "m.set(...)",
      id,
      JSON.stringify(
        StationIntervalMapper(r),
        null,
        0
      )
    );
    */
    if (ji) m.set(new StationIntervalV(id), ji);
  });
  return m;
}
