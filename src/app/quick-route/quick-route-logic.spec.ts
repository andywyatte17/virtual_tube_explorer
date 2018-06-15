//
//
//

import { QuickRouteLogic } from "./quick-route-logic";
import { StationNaptanToName } from "../naptans/naptans";

describe("QuickRouteLogic", () => {
  let originalTimeout;

  beforeEach(() => { });

  // ...

  fit("Test 1", () => {
    let qrl = new QuickRouteLogic();
    qrl.add(StationNameToNaptan("Amersham"));
    qrl.add(StationNameToNaptan("Chalfont & Latimer"), "metropolitan");
    qrl.add(StationNameToNaptan("Chesham"), "metropolitan");
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    expect(visited.toString()).toEqual("Amersham,Chalfont & Latimer,Chesham");
  });

  // ...

  fit("Test 2", () => {
    let qrl = new QuickRouteLogic();
    qrl.add(StationNameToNaptan("Amersham"));
    qrl.add(StationNameToNaptan("Chalfont & Latimer"), "metropolitan");
    qrl.add(StationNameToNaptan("Chesham"), "metropolitan");
    qrl.add(StationNameToNaptan("Moor Park"), "metropolitan");
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    expect(visited.toString()).toEqual("Amersham,Chalfont & Latimer,Chesham");
  });

  // ...
});