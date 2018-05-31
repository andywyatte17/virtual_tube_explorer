import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  context: CanvasRenderingContext2D;
  afterImgReady = [];
  private img: HTMLImageElement = null;
  private imgIsReady = false;
  private ox = 0;
  private oy = 0;

  constructor() {}

  ngOnInit() {
  }
}
