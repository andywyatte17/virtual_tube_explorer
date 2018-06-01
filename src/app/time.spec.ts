import { TestBed, inject } from "@angular/core/testing";
import { HhMm } from "./time";

describe("HhMm", () => {
  // ...
  it("HhMm.fromString(0145) => 01,45", () => {
    expect(HhMm.fromString('0145')).toEqual(new HhMm(1, 45));
  });
  // ...
  it("HhMm.fromString(145) => 01,45", () => {
    expect(HhMm.fromString('145')).toEqual(new HhMm(1, 45));
  });
  // ...
  it("HhMm.fromString(01:45) => 01,45", () => {
    expect(HhMm.fromString('01:45')).toEqual(new HhMm(1, 45));
  });
  // ...
  it("HhMm.fromString(1:45) => 01,45", () => {
    expect(HhMm.fromString('1:45')).toEqual(new HhMm(1, 45));
  });
  // ...
});