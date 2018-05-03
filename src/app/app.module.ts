import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NaptansComponent } from './naptans/naptans.component';
import { StartupComponent } from './startup/startup.component';
import { ArrivalInfoComponent } from './arrival-info/arrival-info.component';
import { Passenger } from './passenger/passenger';

@NgModule({
  declarations: [AppComponent, StartupComponent, ArrivalInfoComponent, NaptansComponent],
  imports: [
    BrowserModule, FormsModule, NgbModule.forRoot(), HttpClientModule,
    HttpModule
  ],
  providers: [Passenger],
  entryComponents: [StartupComponent, ArrivalInfoComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
