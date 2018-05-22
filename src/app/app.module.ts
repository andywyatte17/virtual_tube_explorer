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
import { PlacesComponent } from './places/places.component';
import { PlacesService } from './places.service';
import { NotifierService } from './notifier.service';
import { MaterialModule } from './material.module';
import { PredictionSummaryComponent } from './prediction-summary/prediction-summary.component';
import { RouteTabComponent } from './route-tab/route-tab.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [AppComponent, StartupComponent, ArrivalInfoComponent,
    NaptansComponent, PlacesComponent, PredictionSummaryComponent, RouteTabComponent, MapComponent],
  imports: [
    BrowserModule, FormsModule, NgbModule.forRoot(), HttpClientModule,
    HttpModule, MaterialModule
  ],
  providers: [Passenger, PlacesService, NotifierService],
  entryComponents: [StartupComponent, ArrivalInfoComponent, PlacesComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
