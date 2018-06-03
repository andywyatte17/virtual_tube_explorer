import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-places-svg",
  templateUrl: "./places-svg.component.html",
  styleUrls: ["./places-svg.component.css"]
})
export class PlacesSvgComponent implements OnInit {
  sx = 0.25;
  sy = 0.25;
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
    let s = 20 / this.sx;
    return this.domSantizier.bypassSecurityTrustStyle(`font-size:${s}px;`);
  }

  textStyle(station: string) {
    return this.domSantizier.bypassSecurityTrustStyle('fill:red');
  }

  opacity(station: string) {
    return "1.0";
  }

  get transform() {
    return `matrix(${this.sx}, 0, 0, ${this.sy}, ${this.dx}, ${this.dy})`;
  }
}
