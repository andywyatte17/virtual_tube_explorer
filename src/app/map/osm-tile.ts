//
// osm-tile.ts
//

export function long2tile_x(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }

export function lat2tile_y(lat, zoom) {
  /*
  n = 2 ^ zoom
  xtile = n * ((lon_deg + 180) / 360)
  ytile = n * (1 - (log(tan(lat_rad) + sec(lat_rad)) / π)) / 2
  */
  let n = Math.pow(2.0, zoom);
  let rad = (degs) => (degs * Math.PI) / 180.0;
  let log = (x) => Math.log(x);
  let tan = (x) => Math.tan(x);
  let sec = (x) => 1.0 / Math.cos(x);
  const lat_rad = rad(lat);
  let ytile =  n * (1 - (log(tan(lat_rad) + sec(lat_rad)) / Math.PI)) / 2;
  return Math.round(ytile);
}

export function osm_url(lon: number, lat: number, zoom: number) {
  // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
  let t = Math.floor(Math.random() * 2.99999);
  let x = long2tile_x(lon, zoom);
  let y = lat2tile_y(lat, zoom);
  const server = "abc".charAt(t);
  return `http://${server}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
  // return `http://${server}.tile2.opencyclemap.org/transport/${zoom}/${x}/${y}.png`
  // return `http://toolserver.org/~cmarqu/hill/${zoom}/${x}/${y}.png`;
}