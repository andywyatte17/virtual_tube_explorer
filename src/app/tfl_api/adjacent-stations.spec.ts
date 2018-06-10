//
// adjacent-stations.spec.ts
//

import { TestBed, inject } from "@angular/core/testing";
import { Check, ExtendNaptansVisitedFromTFL } from "./adjacent-stations";
import { StationNaptanToName, StationNameToNaptan } from "../naptans/naptans";

describe("adjacent-stations", () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  // ...

  it("Check() - all station names are valid", () => {
    expect(Check()).toEqual([]);
  });

  it("ExtendNaptansVisitedFromTFL() - Cockfosters => Kings Cross", done => {
   // "piccadilly", "940GZZLUCKS", "940GZZLUKSX",

    const expected = [
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
    ];

    let start = [
      "Cockfosters",
      "Oakwood",
      "Southgate",
      "Arnos Grove",
      "Bounds Green",
      "Wood Green",
      "Turnpike Lane",
      "Manor House",
      "Finsbury Park",
      "Holloway Road",
      "Caledonian Road",
      "King's Cross St. Pancras"
    ];

    // expect( StationNameToNaptan("Caledonian Road") ).toEqual("940GZZLUCAR");

    let startAsNaptans = start.map((name) => StationNameToNaptan(name));
    let result = ExtendNaptansVisitedFromTFL(startAsNaptans, "piccadilly");
    result = result.map((naptan) => StationNaptanToName(naptan));

    expect(result).toEqual(expected);
    done();
  });

  fit("ExtendNaptansVisitedFromTFL() - Kings Cross => Cockfosters", done => {
    // "piccadilly", "940GZZLUCKS", "940GZZLUKSX",
 
     const expected = [
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
     ].reverse();
 
     let start = [
       "Cockfosters",
       "Oakwood",
       "Southgate",
       "Arnos Grove",
       "Bounds Green",
       "Wood Green",
       "Turnpike Lane",
       "Manor House",
       "Finsbury Park",
       "Holloway Road",
       "Caledonian Road",
       "King's Cross St. Pancras"
     ].reverse();
 
     // expect( StationNameToNaptan("Caledonian Road") ).toEqual("940GZZLUCAR");
 
     let startAsNaptans = start.map((name) => StationNameToNaptan(name));
     let result = ExtendNaptansVisitedFromTFL(startAsNaptans, "piccadilly");
     result = result.map((naptan) => StationNaptanToName(naptan));
 
     expect(result).toEqual(expected);
     done();
   });
 });
