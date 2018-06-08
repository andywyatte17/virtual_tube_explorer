import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NaptansComponent } from './naptans/naptans.component';
import { ArrivalInfoComponent } from './arrival-info/arrival-info.component';
import { Passenger } from './passenger/passenger';
import { PlacesComponent } from './places/places.component';
import { PlacesService } from './places.service';
import { NotifierService } from './notifier.service';
import { MaterialModule } from './material.module';
import { PredictionSummaryComponent } from './prediction-summary/prediction-summary.component';
import { RouteTabComponent } from './route-tab/route-tab.component';
import { MapComponent } from './map/map.component';
import { MapSvgComponent } from './map-svg/map-svg.component';
import { TimetableService } from './timetable.service';
import { PlacesSvgComponent } from './places-svg/places-svg.component';

@NgModule({
  declarations: [AppComponent, ArrivalInfoComponent,
    NaptansComponent, PlacesComponent, PredictionSummaryComponent, RouteTabComponent, MapComponent, MapSvgComponent, PlacesSvgComponent],
  imports: [
    BrowserModule, FormsModule, NgbModule.forRoot(), HttpClientModule,
    HttpModule, MaterialModule
  ],
  providers: [Passenger, PlacesService, NotifierService, TimetableService],
  entryComponents: [ArrivalInfoComponent, PlacesComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
