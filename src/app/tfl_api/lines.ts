//
// lines.ts
//

import { HttpClient } from '@angular/common/http';
import { ApiKeys } from '../my_tfl_api_key';

/**
 * Line names as defined in the Tfl API.
 * Used in apis such as: https://api.tfl.gov.uk/Line/{line}/Route
 */
export function MakeTubeLines() {
    return [
        "metropolitan",
        "district",
        "piccadilly",
        "bakerloo",
        "central",
        "northern",
        "jubilee",
        "district",
        "victoria",
        "hammersmith-city",
        "waterloo-city"
    ];
}

interface LineAPIResult {
    readonly "$type": string;
    readonly id: string;
    readonly "operationType": number;
    readonly "vehicleId": string;
    readonly "naptanId": string;
    readonly "stationName": string;
    readonly "lineId": string;
    readonly "lineName": string;
    readonly "platformName": string;
    readonly "bearing": string;
    readonly "destinationNaptanId": string;
    readonly "destinationName": string;
    readonly "timestamp": string;
    readonly "timeToStation": number;
    readonly "currentLocation": string;
    readonly "towards": string;
    readonly "expectedArrival": string;
    readonly "timeToLive": string;
    readonly "modeName": string;
    readonly "timing": object;
};

interface RouteSection {
    readonly name: string;
    readonly direction: string;
    readonly originationName: string;
    readonly destinationName: string;
    readonly originator: string;
    readonly destination: string;
    readonly serviceType: string;
    readonly validTo: string;
    readonly validFrom: string;
};

interface LineAPIResult {
    readonly "$type": string;
    readonly id: string;
    readonly name: string;
    readonly modeName: string;
    readonly disruptions: Array<any>;
    readonly created: string;
    readonly modified: string;
    readonly lineStatuses: Array<any>;
    readonly routeSections: Array<RouteSection>;
    readonly serviceTypes: Array<any>
    readonly crowding: any;
};

export function TestLinesAPI(http: HttpClient, line: string) {
    let url = `https://api.tfl.gov.uk/Line/${line}/Route`;
    url = url + ApiKeys.htmlPrefix();
    console.log(url);
    http.get(url).subscribe((lines: LineAPIResult) => {
        let result2 = lines.routeSections.map((v: RouteSection) => {
            return {
                "name": v.name,
                "destinationName": v.destinationName
            };
        });
        console.dir(result2);
    });
}
