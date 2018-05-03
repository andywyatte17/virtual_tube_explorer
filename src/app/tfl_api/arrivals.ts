//
// arrivals.ts
//

export interface Arrival {
  readonly $type: string;
  readonly id: string;
  readonly operationType: number;
  readonly naptanId: string;
  readonly stationName: string;
  readonly lineId: string;
  readonly vehicleId: string;
  readonly lineName: string;
  readonly platformName: string;
  readonly direction: string;
  readonly bearing: string;
  readonly destinationNaptanId: string;
  readonly destinationName: string;
  readonly timestamp: string;
  readonly timeToStation: number;
  readonly currentLocation: string;
  readonly towards: string;
  readonly expectedArrival: string;
  readonly timeToLive: string;
  readonly modeName: string;
  readonly timing: object;
}
