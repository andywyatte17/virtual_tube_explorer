import { CATCH_ERROR_VAR } from "@angular/compiler/src/output/abstract_emitter";

//
// times.ts
//

export class HhMm {
  constructor(public readonly hh: number, public readonly mm: number) { }

  /** Create HhMm object from strings like "0145" or "145" or "01:45" or "1:45" - each giving the value HhMm(1,45). */
  static fromString(hhmm: string): HhMm {
    const process = (hhmm: string) => {
      try {
        let hh_mm = hhmm.split(":");
        if (hh_mm.length == 2)
          return new HhMm(parseInt(hh_mm[0]), parseInt(hh_mm[1]));
      } catch (e) { }
      return null;
    };
    let result = process(hhmm);
    if (result) return result;
    if (hhmm.length == 3)
      return process(`0${hhmm.slice(0, 1)}:${hhmm.slice(1, 3)}`);
    if (hhmm.length == 4)
      return process(`${hhmm.slice(0, 2)}:${hhmm.slice(2, 4)}`);
    return null;
  }
}
