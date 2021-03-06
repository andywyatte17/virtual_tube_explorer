import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { station_to_line } from "../tfl_api/station-to-line";
import { MakeTubeNaptans, Naptan, StationNameToNaptan, StationNaptanToName, ShortNaptanToName, ShortNaptanToNaptan } from "../naptans/naptans";
import { PlacesSvgService } from "./places-svg.service";
import { SafeStyle } from "@angular/platform-browser/src/security/dom_sanitization_service";

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

  private colorForLine(line: string) {
    switch (line) {
      case "bakerloo": return ["#963", "#000"];
      case "central": return ["#c33", "#000"];
      case "jubilee": return ["#889", "#000"];
      case "northern": return ["#000", "#fff"];
      case "hammersmith-city": return ["#c99", "#000"];
      case "district": return ["#063", "#fff"];
      case "metropolitan": return ["#a06", "#000"];
      case "piccadilly": return ["#048", "#fff"];
      case "circle": return ["#fc0", "#000"];
      case "victoria": return ["#09c", "#000"];
    }
    return null;
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

    // ...

    let line : string = null;
    try {
      line = station_to_line[ naptan ];
    } catch(e) {}
    if(!line && station)
      line = station_to_line[ station ];

    // ...

    const cb = this.colorForLine(line);
    if(cb)
      return this.domSantizier.bypassSecurityTrustStyle(`fill:${cb[0]}; ${fs}; ${opacity}`);
    return this.domSantizier.bypassSecurityTrustStyle(`fill:#8f0; ${fs}; ${opacity}`);
  }

  public primeStation : string = null;

  t(shortNaptan:string)
  {
    //if(this.primeStation!==shortNaptan)
    return shortNaptan;
    //return ShortNaptanToName(shortNaptan);
  }

  get transform() {
    return `matrix(${this.sx}, 0, 0, ${this.sy}, ${this.dx}, ${this.dy})`;
  }

  mov(event : MouseEvent) {
    let elem = (<SVGTextElement>event.target);
    this.primeStation = elem.getAttribute('id');
    if(this.primeStation) {
      this.selX = (parseFloat(elem.getAttribute("x")) + 80).toString();
      this.selY = (parseFloat(elem.getAttribute("y")) + 12 / this.sx).toString();
      this.selText = ShortNaptanToName(this.primeStation);
      let s = 24 / this.sx;
      let w = 1;

      let style = "stroke-opacity:0.5; fill-opacity:1.0; " + 
                  "stroke-width:" + w.toString() + "px; " +
                  "font-weight:bold; font-size:" + s.toString() + "px; ";
      
      const line = station_to_line[ShortNaptanToNaptan(this.primeStation)];
      const cb = this.colorForLine(line);
      if(cb) {
        style = style + "fill:" + cb[0] + "; ";
        style = style + "stroke:" + cb[1] + "; ";
      }

      this.selStyle = this.domSantizier.bypassSecurityTrustStyle(style);
    } else {
      this.selStyle = this.domSantizier.bypassSecurityTrustStyle("fill-opacity: 0.0; ");
    }
  }

  mout(event : MouseEvent) {
    let elem = (<SVGTextElement>event.target);
    if(this.primeStation===elem.getAttribute('id'))
    {
      this.primeStation = null;
      this.selStyle = this.domSantizier.bypassSecurityTrustStyle("fill-opacity: 0.0; ");
    }
  }

  md_xy = <{x:number, y:number}>null;

  private make_md_xy(event:MouseEvent)
  {
    if(event.buttons&1)
      return { x: event.screenX, y: event.screenY };
    return null;
  }

  md(event : MouseEvent) {
    //console.log("md", event);
    this.md_xy = this.make_md_xy(event);
  }

  mm(event : MouseEvent) {
    //console.log("mm", event);
    let next = this.make_md_xy(event);
    if(next && this.md_xy) {
      this.dx += next.x - this.md_xy.x;
      this.dy += next.y - this.md_xy.y;
    }
    this.md_xy = next;
  }

  mu(event : MouseEvent) {
    //console.log("mu", event);
    this.md_xy = null;
  }

  selX = "0.0";
  selY = "0.0";
  selText = "";
  selStyle : SafeStyle = null;
}
