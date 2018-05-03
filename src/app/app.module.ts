import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {StartupComponent} from './startup/startup.component';

@NgModule({
  declarations: [AppComponent, StartupComponent],
  imports: [BrowserModule, FormsModule, NgbModule.forRoot()],
  providers: [],
  entryComponents:[StartupComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
