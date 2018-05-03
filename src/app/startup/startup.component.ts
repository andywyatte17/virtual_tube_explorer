import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';

import {ApiKeys} from '../my_tfl_api_key';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css']
})
export class StartupComponent implements OnInit {
  @ViewChild('thingEncryptedElement')

  constructor(public readonly activeModal: NgbActiveModal) {}

  thingEncryptedElement: ElementRef;

  thingToEncrypt = JSON.stringify(
      {'Tfl': {'ApplicationID': '...', 'ApplicationKey': '...'}});

  thingEncrypted = '???';

  loginPassword = '<password>';

  isEncryptAreaHidden = true;

  showFailedToLoginMessage = false;

  showEncryptArea() {
    this.isEncryptAreaHidden = false;
  }

  thingToEncryptDidChange(value: string) {
    this.thingToEncrypt = value;
    this.updateThingEncrypted();
  }

  loginPasswordDidChange(value: string) {
    this.loginPassword = value;
    this.updateThingEncrypted();
  }

  private updateThingEncrypted() {
    this.thingEncrypted =
        CryptoJS.AES.encrypt(this.thingToEncrypt, this.loginPassword)
            .toString();
  }

  ngOnInit() {
    this.updateThingEncrypted();
  }

  copyEncryptedToClipboard() {
    let elem = <HTMLInputElement>this.thingEncryptedElement.nativeElement;
    elem.select();
    document.execCommand('Copy');
  }

  submit() {
    try {
      const decrypted =
          StartupComponent.AES_Decrypt(ApiKeys.encrypted, this.loginPassword);
      ApiKeys.decrypted = JSON.parse(decrypted);
      this.showFailedToLoginMessage = false;
      this.activeModal.close("OK");
    } catch (e) {
      this.showFailedToLoginMessage = true;
    }
  }

  static AES_Encrypt(toEncrypt: string, secretPhrase: string): string {
    return CryptoJS.AES.encrypt(toEncrypt, secretPhrase).toString();
  }

  static AES_Decrypt(toDecrypt: string, secretPhrase: string): string {
    let bytes = CryptoJS.AES.decrypt(toDecrypt, secretPhrase);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
