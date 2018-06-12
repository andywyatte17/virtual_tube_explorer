import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { station_to_line } from "../tfl_api/station-to-line";
import { MakeTubeNaptans, Naptan } from "../naptans/naptans";

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

  constructor(public readonly domSantizier: DomSanitizer) { }

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

  private nameToNaptan = ( () => {
    let m = MakeTubeNaptans();
    let rv = <any>{};
    m.forEach( (v:Naptan) => {
      rv[v.name] = v.id;
    });
    return rv;
  })();

  textStyle(station: string) {
    let s = 10 / this.sx;
    const fs = `font-size:${s}px; font-family: monospace `;
    const opacity = `fill-opacity: 1.0 `;

    let line : string = null;
    try {
      line = station_to_line[ this.nameToNaptan[ station ] ];
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

  get transform() {
    return `matrix(${this.sx}, 0, 0, ${this.sy}, ${this.dx}, ${this.dy})`;
  }
}
