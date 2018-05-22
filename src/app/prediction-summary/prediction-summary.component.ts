import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-prediction-summary',
  templateUrl: './prediction-summary.component.html',
  styleUrls: ['./prediction-summary.component.css']
})
export class PredictionSummaryComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onTest() {
    this.http.get("http://cloud.tfl.gov.uk/TrackerNet/PredictionSummary/N")
      .subscribe((response) => {
        console.log(response);
        xml2js.parseString(response, { explicitArray: false }, (error, result) => {
        },
          (error) => {
            console.error(error);
          }
        );
      });
  }
}
