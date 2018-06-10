import { ExtendNaptansVisitedFromTFL } from "./tfl_api/adjacent-stations";

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
  lastStopId: string;
  timeToArrival: number;
  naptansSoFar: Array<string>;
};

export type IntervalId = { intervalId: string };

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
  route: Route,
  line: string
) {
  let m = new Map<IntervalId, JourneyInfo>();
  // ...
  let si = route.stationIntervals;
  si.forEach((stationInterval: StationInterval, index: number) => {
    const id: string = stationInterval.id;
    const intervals = stationInterval.intervals;
    let r = new Array<JourneyInfo>();
    let naptansSoFar = [fromNaptanId];
    let ji: JourneyInfo = null;
    intervals.forEach((interval: Interval) => {
      naptansSoFar.push(interval.stopId);
      let naptansSoFar2 = ExtendNaptansVisitedFromTFL(naptansSoFar, line);
      let v = <JourneyInfo>{
        stopId: interval.stopId,
        timeToArrival: interval.timeToArrival,
        naptansSoFar: JSON.parse(JSON.stringify(naptansSoFar2)),
        lastStopId: intervals[intervals.length - 1].stopId
      };
      //console.log({id:id, sim:StationIntervalMapper([v])[0]});
      if (v.stopId == toNaptanId)
        ji = v;
    });
    if (ji) m.set({intervalId:id}, ji);
  });
  return m;
}
