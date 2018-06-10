//
// adjacent-stations.spec.ts
//

import { TestBed, inject } from "@angular/core/testing";
import { Check } from "./adjacent-stations";

describe("adjacent-stations", () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  // ...

  fit("Check() - all station names are valid", () => {
    expect(Check()).toEqual([]);
  });
});
