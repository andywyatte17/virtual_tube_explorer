import {Component, OnInit} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { LOCATION_INITIALIZED } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  // ...

  ngOnInit()
  {
    this.updateThingEncrypted();
  }

  thingToEncrypt = '{ "TflApiKey": "...", "TflApiSecret": "..." }';
  
  thingEncrypted = '???';

  thingToEncryptDidChange(value : string) {
    this.thingToEncrypt = value;
    this.updateThingEncrypted();
  }

  private updateThingEncrypted()
  {
  this.thingEncrypted = CryptoJS.HmacSHA256(this.thingToEncrypt, "someKey").toString();
  }
}
