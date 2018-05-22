import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-svg',
  templateUrl: './map-svg.component.html',
  styleUrls: ['./map-svg.component.css']
})
export class MapSvgComponent implements OnInit {

  @ViewChild("main_graphics") main_graphics: ElementRef;
  private g_bg_elem: SVGGraphicsElement = null;

  constructor() {
  }

  ngOnInit() {
    this.g_bg_elem = <SVGGraphicsElement>this.main_graphics.nativeElement;
  }

  get transform() { return `matrix(${this.sx},0,0,${this.sy},${this.dx},${this.dy})`; }

  get showKeyToLines() { return false; }

  get showKeyToSymbols() { return false; }

  get showZoneSwitch() { return false; }

  get showStepFreeStuff() { return false; }

  get showRouteMapTitle() { return false; }
  
  lastClientX = null;
  lastClientY = null;
  dx = 0.0;
  dy = 0.0;
  sx = 2.0;
  sy = 2.0;

  plus() { this.sx *= 1.1; this.sy *= 1.1; }

  minus() { this.sx /= 1.1; this.sy /= 1.1; }

  mousedown(ev: DragEvent) {
    ev.preventDefault();
    console.log("mousedown", ev);
    this.lastClientX = ev.clientX;
    this.lastClientY = ev.clientY;
  }

  mousemove(ev: DragEvent) {
    ev.preventDefault();
    if (!this.lastClientX)
      return;
    console.log("mousedrag", ev);
    if (this.lastClientX) {
      this.dx = this.dx + ev.clientX - this.lastClientX;
      this.dy = this.dy + ev.clientY - this.lastClientY;
      console.log(this.dx, this.dy);
    }
    this.lastClientX = ev.clientX;
    this.lastClientY = ev.clientY;
  }

  mouseup(ev: DragEvent) {
    ev.preventDefault();
    console.log("mouseup", ev);
    this.lastClientX = null;
    this.lastClientY = null;
  }
}
