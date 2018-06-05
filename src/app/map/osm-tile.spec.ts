//
// osm-tile-spec.ts
//

import { osm_url } from "./osm-tile";

describe("osm-tile", () => {
  it("example 1", () => {
    // lat, lon, z = (51.51202, 0.02435, 17)
    // x, y = 65544, 43582
    let url = osm_url(0.02435, 51.51202, 17);
    let url2 = url
      .replace("http://a", "http://c")
      .replace("http://b", "http://c");
    expect(url2).toEqual("http://c.tile.openstreetmap.org/17/65544/43582.png");
    // expect(url2).toEqual("http://c.tile2.opencyclemap.org/transport/17/65544/43582.png");
  });
});
