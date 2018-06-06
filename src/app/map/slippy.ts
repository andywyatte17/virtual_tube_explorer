//
// slippy.ts
//

declare var google;

//let map : google.maps.Map = null;
let map : any /*google.maps.Map*/ = null;

export function initialize(someDivId:string) {
  // See http://harrywood.co.uk/maps/examples/google-maps/add-osm-credits.view.html
  
  google.maps.visualRefresh = true;
  var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
    (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
  if (isMobile) {
    var viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
  }
  var mapDiv = document.getElementById(someDivId);

  map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(51.8368, -0.5389),
    zoom: 14,
    mapTypeId: 'OSM',
    mapTypeControl: false,
    streetViewControl: false
  });

  map.mapTypes.set("OSM", new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      // "Wrap" x (logitude) at 180th meridian properly
      var tilesPerGlobe = 1 << zoom;
      var x = coord.x % tilesPerGlobe;
      if (x < 0) x = tilesPerGlobe+x;
      let rand_thing = "abc".charAt(Math.floor(Math.random() * 2.999));
      return `http://${rand_thing}.tile.openstreetmap.org/` + zoom + "/" + x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "OpenStreetMap",
    maxZoom: 18
  }));

  google.maps.event.addDomListener(window, 'load', initialize);
}

export function setLatLonZoom(lat: number, lon: number, zoom?: number) {
  map.setCenter(new google.maps.LatLng(lat, lon));
  if(zoom)
    map.setZoom(zoom);
}
