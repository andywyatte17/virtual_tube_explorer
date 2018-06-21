import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { station_to_line } from "../tfl_api/station-to-line";
import { MakeTubeNaptans, Naptan, StationNameToNaptan, StationNaptanToName, ShortNaptanToName, ShortNaptanToNaptan } from "../naptans/naptans";
import { PlacesSvgService } from "./places-svg.service";

@Component({
  selector: "app-places-svg",
  templateUrl: "./places-svg.component.html",
  styleUrls: ["./places-svg.component.css"]
})
export class PlacesSvgComponent implements OnInit {
  sx = 0.4;
  sy = 0.4;
  dx = 0.0;
  dy = 0.0;

  private _stationsVisited : Array<string> = null;

  constructor(public readonly domSantizier: DomSanitizer,
    public readonly placesSvgService: PlacesSvgService) {
    this.hookInStationsVisitedHandler();
  }

  private hookInStationsVisitedHandler() {
    this.placesSvgService.placesVisitedDidChange.subscribe(
      (stationsVisited: Array<string>) => {
        this._stationsVisited = stationsVisited.map((x) => x);
      });
  }

  ngOnInit() { }

  plus() {
    this.sx *= 1.1;
    this.sy *= 1.1;
  }

  minus() {
    this.sx /= 1.1;
    this.sy /= 1.1;
  }

  get style() {
    let s = 8 / this.sx;
    return this.domSantizier.bypassSecurityTrustStyle(`font-size:${s}px; font-family: monospace;`);
  }

  textStyle(station: string) {
    let s = 10 / this.sx;
    
    // see https://www.cssfontstack.com/lucida-console
    const fs = `font-size:${s}px; font-family: Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace; `;

    let naptan = ShortNaptanToNaptan(station);

    let opacity = `fill-opacity: 1.0 `;
    const sv = this._stationsVisited;
    if (naptan && sv && sv.indexOf(naptan) >= 0)
      opacity = `fill-opacity: 0.3 `;

    let line : string = null;
    try {
      line = station_to_line[ naptan ];
    } catch(e) {}
    if(!line)
      line = station_to_line[ station ];
    
    const lineToColor = () => {
      switch (line) {
        case "bakerloo": return "#963";
        case "central": return "#c33";
        case "jubilee": return "#889";
        case "northern": return "#000";
        case "hammersmith-city": return "#c99";
        case "district": return "#063";
        case "metropolitan": return "#a06";
        case "piccadilly": return "#048";
        case "circle": return "#fc0";
        case "victoria": return "#09c";
      }
      return null;
    };

    let color = lineToColor();
    if(color)
      return this.domSantizier.bypassSecurityTrustStyle(`fill:${color}; ${fs}; ${opacity}`);
    return this.domSantizier.bypassSecurityTrustStyle(`fill:#8f0; ${fs}; ${opacity}`);
  }

  public primeStation : string = null;

  t(shortNaptan:string)
  {
    if(this.primeStation!==shortNaptan)
      return shortNaptan;
    return ShortNaptanToName(shortNaptan);
  }

  get transform() {
    return `matrix(${this.sx}, 0, 0, ${this.sy}, ${this.dx}, ${this.dy})`;
  }

  mov(event : MouseEvent) {
    this.primeStation = (<SVGTextElement>event.target).getAttribute('sn');
  }

  mout(event : MouseEvent) {
    if(this.primeStation===(<SVGTextElement>event.target).getAttribute('sn'))
      this.primeStation = null;
  }
}
