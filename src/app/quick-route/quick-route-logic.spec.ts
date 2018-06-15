//
//
//

import { QuickRouteLogic } from "./quick-route-logic";
import { NameToNaptan, StationNaptanToName } from "../naptans/naptans";

describe("QuickRouteLogic", () => {
  let originalTimeout;

  beforeEach(() => { });

  // ...

  fit("Test 1", () => {
    let qrl = new QuickRouteLogic();
    qrl.add(NameToNaptan("Amersham"));
    qrl.add(NameToNaptan("Chalfont & Latimer"), "metropolitan");
    qrl.add(NameToNaptan("Chesham"), "metropolitan");
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    expect(visited.toString()).toEqual("Amersham,Chalfont & Latimer,Chesham");
  });

  // ...

  fit("Test 2", () => {
    let qrl = new QuickRouteLogic();
    qrl.add(NameToNaptan("Amersham"));
    qrl.add(NameToNaptan("Chalfont & Latimer"), "metropolitan");
    qrl.add(NameToNaptan("Chesham"), "metropolitan");
    qrl.add(NameToNaptan("Moor Park"), "metropolitan");
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    expect(visited.toString()).toEqual("Amersham,Chalfont & Latimer,Chesham");
  });

  // ...
});