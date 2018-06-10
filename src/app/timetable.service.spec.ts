import { TestBed, inject } from "@angular/core/testing";

import {
  TimetableService,
  DaySet,
  FromLineToTimes,
  PaddedTime,
  AreEquivalent,
  Times
} from "./timetable.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { MakeTubeNaptans, Naptan } from "./naptans/naptans";

describe("TimetableService", () => {
  let originalTimeout;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;

    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpModule],
      providers: [TimetableService]
    });
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  // ...

  it("West Ruislip (940GZZLUWRP) - North Acton (940GZZLUNAN) - Saturday - central", done => {
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable(
          "central",
          "940GZZLUWRP",
          "940GZZLUNAN",
          DaySet.mon,
          4,
          0
        )
        .then((value: FromLineToTimes) => {
          let m = (n: number) => {
            while (n < 0)
              n += value.times.length;
            return [
              value.times[n].startHh,
              value.times[n].startMm,
              value.times[n].endHh,
              value.times[n].endMm
            ];
          };
          let d = (n: number, e: number) => {
            if (e === null) console.log(JSON.stringify(value.times[n], null, 2));
            else console.log(JSON.stringify(value.times.slice(n, e), null, 2));
          };
          // https://api.tfl.gov.uk/Line/central/Timetable/940GZZLUWRP?direction=outbound
          // https://api.tfl.gov.uk/Line/central/Timetable/940GZZLUWRP?direction=inbound
          expect(value.times && value.times.length).toBeTruthy();
          if (!(value.times && value.times.length)) { return done(); }
          //d(0, 5);
          done();
        });
    })();
  });

  // ...

  it("Moor Park (940GZZLUMPK) - Preston Road (940GZZLUPRD) - Saturday - metro", done => {
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable(
          "metropolitan",
          "940GZZLUMPK",
          "940GZZLUPRD",
          DaySet.sat,
          4,
          0
        )
        .then((value: FromLineToTimes) => {
          let m = (n: number) => {
            while (n < 0)
              n += value.times.length;
            return [
              value.times[n].startHh,
              value.times[n].startMm,
              value.times[n].endHh,
              value.times[n].endMm
            ];
          };
          let d = (n: number, e: number) => {
            if (e === null) console.log(JSON.stringify(value.times[n], null, 2));
            else console.log(JSON.stringify(value.times.slice(n, e), null, 2));
          };
          expect(value.times && value.times.length).toBeTruthy();
          if (!(value.times && value.times.length)) { return done(); }
          expect(m(0).toString()).toEqual([5, 36, 5, 54].toString());
          expect(m(3).toString()).toEqual([5, 55, 6, 13].toString());
          expect(m(-1).toString()).toEqual([24, 47, 25, 5].toString());
          done();
        });
    })();
  });

  // ...

  it("Acton Town - Earl's Court - Piccadilly", done => {
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable("piccadilly", "940GZZLUACT", "940GZZLUECT", DaySet.mon, 4, 0)
        .then((value: FromLineToTimes) => {
          expect(value.times && value.times.length).toBeTruthy();
          done();
        });
    })();
  });

  // ...

  it("Bakerloo - Charing Cross -> Oxford Circus times", done => {
    // Compared results from https://tfl.gov.uk/tube/timetable/bakerloo/
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable("bakerloo", "940GZZLUCHX", "940GZZLUOXC", DaySet.sat, 4, 0)
        .then((value: FromLineToTimes) => {
          expect(value.times.length).toBeGreaterThan(5);
          // ...
          expect(value.times[0].startHh).toEqual(5);
          expect(value.times[0].startMm).toEqual(43);
          expect(value.times[0].endHh).toEqual(5);
          expect(value.times[0].endMm).toEqual(47);
          // ...
          const n = value.times.length - 1;
          expect(value.times[n].startHh).toEqual(24);
          expect(value.times[n].startMm).toEqual(29);
          expect(value.times[n].endHh).toEqual(24);
          expect(value.times[n].endMm).toEqual(33);
          // ...
          done();
        });
    })();
  });

  // ...

  xit("Northern - Edgware -> Camden Town", done => {
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable(
          "northern",
          "940GZZLUEGW",
          "940GZZLUMTC",
          DaySet.sat, 10, 8
        )
        .then((value: FromLineToTimes) => {
          let N = MakeTubeNaptans();
          let stations = value.times[0].stopNaptans.map((naptan: string) => {
            let found = N.find((value: Naptan) => value.id == naptan);
            return found.name;
          });
          expect(stations).toEqual([
            "Edgware",
            "Burnt Oak",
            "Colindale",
            "Hendon Central",
            "Brent Cross",
            "Golders Green",
            "Hampstead",
            "Belsize Park",
            "Chalk Farm",
            "Camden Town",
            "Mornington Crescent"
          ]);
          done();
        });
      })();
  });

  // ...

  xit("Piccadilly - Cockfosters -> Kings Cross", done => {
    // see https://tfl.gov.uk/tube/timetable/metropolitan?FromId=940GZZLUCAL&fromText=Chalfont&toText=Amersham&ToId=940GZZLUAMS
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable(
          "piccadilly",
          "940GZZLUCKS",
          "940GZZLUKSX",
          DaySet.sat, 17, 19
        )
        .then((value: FromLineToTimes) => {
          let N = MakeTubeNaptans();
          let stations = value.times[0].stopNaptans.map((naptan: string) => {
            let found = N.find((value: Naptan) => value.id == naptan);
            return found.name;
          });
          expect(stations).toEqual([
            "Cockfosters",
            "Oakwood",
            "Southgate",
            "Arnos Grove",
            "Bounds Green",
            "Wood Green",
            "Turnpike Lane",
            "Manor House",
            "Finsbury Park",
            "Arsenal",
            "Holloway Road",
            "Caledonian Road",
            "King's Cross St. Pancras"
          ]);
          done();
        });
    })();
  });

  // ...

  it("Metropolitan - Chalfont -> Amersham times", done => {
    // see https://tfl.gov.uk/tube/timetable/metropolitan?FromId=940GZZLUCAL&fromText=Chalfont&toText=Amersham&ToId=940GZZLUAMS
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable(
          "metropolitan",
          "940GZZLUCAL",
          "940GZZLUAMS",
          DaySet.mon, 4, 0
        )
        .then((value: FromLineToTimes) => {
          expect(value).toBeTruthy();
          expect(value.times).toBeTruthy();
          expect(value.times.length).toBeGreaterThan(5);
          if (
            !value.times ||
            value.times.toString() == "undefined" ||
            value.times.length <= 5
          ) {
            done();
            return;
          }
          // ...
          expect(value.times[0].startHh).toEqual(5);
          expect(value.times[0].startMm).toEqual(27);
          expect(value.times[0].endHh).toEqual(5);
          expect(value.times[0].endMm).toEqual(30);
          // ...
          const n = value.times.length - 1;
          expect(value.times[n].startHh).toEqual(25);
          expect(value.times[n].startMm).toEqual(8);
          expect(value.times[n].endHh).toEqual(25);
          expect(value.times[n].endMm).toEqual(11);
          // ...
          done();
        });
    })();
  });

  // ...
});

describe("PaddedTime", () => {
  // ...
  it("PaddedTime(4,57) should give '04:57'", () => {
    expect(PaddedTime(4, 57)).toEqual("04:57");
  });
  // ...
});

describe("AreEquivalent", () => {
  // ...
  it("AreEquivalent(mon, _monThu?_) is true", () => {
    expect(AreEquivalent(DaySet.mon, DaySet._monThu1_)).toBeTruthy();
    expect(AreEquivalent(DaySet.mon, DaySet._monThu2_)).toBeTruthy();
  });
  // ...
  it("AreEquivalent(_monThu?_, mon) is true", () => {
    expect(AreEquivalent(DaySet._monThu1_, DaySet.mon)).toBeTruthy();
    expect(AreEquivalent(DaySet._monThu2_, DaySet.mon)).toBeTruthy();
  });
  // ...
  it("AreEquivalent(_monFri_, wed) is true", () => {
    expect(AreEquivalent(DaySet._monFri_, DaySet.wed)).toBeTruthy();
    expect(AreEquivalent(DaySet._monFri_, DaySet.fri)).toBeTruthy();
  });
  // ...
  it("AreEquivalent(sat, _sat1_) is true", () => {
    expect(AreEquivalent(DaySet.sat, DaySet._sat1_)).toBeTruthy();
    expect(AreEquivalent(DaySet._sat1_, DaySet.sat)).toBeTruthy();
  });
  // ...
  it("AreEquivalent(sat, sat) is true", () => {
    expect(AreEquivalent(DaySet.sat, DaySet.sat)).toBeTruthy();
  });
  // ...
  it("AreEquivalent(sun, sun) is true", () => {
    expect(AreEquivalent(DaySet.sun, DaySet.sun)).toBeTruthy();
  });
  // ...
  it("not AreEquivalent(...)", () => {
    [ // ...
      [DaySet.mon, DaySet.fri], // ...
      [DaySet._monThu1_, DaySet.sat] // ...
    ].forEach(
      (x: any) => {
        let [a, b] = x;
        expect(AreEquivalent(a, b)).toBeFalsy();
      }
    );
  });
});
