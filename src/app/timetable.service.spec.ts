import { TestBed, inject } from "@angular/core/testing";

import {
  TimetableService,
  DaySet,
  FromLineToTimes,
  PaddedTime,
  Overlaps
} from "./timetable.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";

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

  it("Acton Town - Earl's Court - Piccadilly", done => {
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable("piccadilly", "940GZZLUACT", "940GZZLUECT", DaySet.mon)
        .then((value: FromLineToTimes) => {
          console.log("Here");
          expect(value.times && value.times.length).toBeTruthy();
          done();
        });
    });
  });

  // ...

  it("Bakerloo - Charing Cross -> Oxford Circus times", done => {
    // Compared results from https://tfl.gov.uk/tube/timetable/bakerloo/
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable("bakerloo", "940GZZLUCHX", "940GZZLUOXC", DaySet.sat)
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

  it("Metropolitan - Chalfont -> Amersham times", done => {
    // see https://tfl.gov.uk/tube/timetable/metropolitan?FromId=940GZZLUCAL&fromText=Chalfont&toText=Amersham&ToId=940GZZLUAMS
    inject([TimetableService], (service: TimetableService) => {
      service
        .LookupTimetable(
          "metropolitan",
          "940GZZLUCAL",
          "940GZZLUAMS",
          DaySet.mon
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

describe("Overlaps", () => {
  // ...
  it("Overlaps(mon, _monThu_) is true", () => {
    expect(Overlaps(DaySet.mon, DaySet._monThu_)).toBeTruthy();
    expect(Overlaps(DaySet._monThu_, DaySet.mon)).toBeTruthy();
  });
});
