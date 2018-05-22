import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  context: CanvasRenderingContext2D;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  afterImgReady = [];
  private img: HTMLImageElement = null;
  private imgIsReady = false;
  private ox = 0;
  private oy = 0;

  constructor() {}

  ngOnInit() {
    this.img = <HTMLImageElement>document.createElement('img');
    this.img.onload = (ev: Event) => {
      this.imgReady();
    };
    this.img.src = 'assets/London_Underground_Overground_DLR_Crossrail_map.svg';
  }

  imgReady() {
    this.imgIsReady = true;
    this.afterImgReady.forEach((x) => x());
    this.afterImgReady = [];
  }

  ngAfterViewInit() {
    let canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');
    if (!this.imgIsReady) {
      this.afterImgReady.push(() => {
        this.draw();
      });
    } else
      this.draw();
  }

  get rows() {
    return [1, 2, 3, 4, 5];
  }

  row(n: number) {
    let a = new Array<number>();
    for (let i = n * 5 - 4; i < (n + 1) * 5 - 4; i += 1) a.push(i);
    return a;
  }

  selectBit(v: number) {
    this.ox = -(((v - 1) % 5) * 250);
    this.oy = -(Math.trunc((v - 1) / 5) * 250);
    console.log(v, this.ox, this.oy);
    this.draw();
    // let img = <HTMLImageElement>this.myImg.nativeElement;
    // img.style.transform = `matrix(1, 0, 0, 1, ${this.ox}, ${this.oy})`;
  }

  draw() {
    let canvas = <HTMLCanvasElement>this.myCanvas.nativeElement;
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.setTransform(0.25, 0, 0, 0.25, this.ox, this.oy);
    this.context.drawImage(this.img, 0, 0);
  }
}
