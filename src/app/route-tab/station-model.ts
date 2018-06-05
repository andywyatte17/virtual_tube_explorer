import { Naptan, MakeTubeNaptans } from "../naptans/naptans";
import { HttpClient } from "@angular/common/http";

export class StationModel {
    filteredStations = new Array<Naptan>();
    selectedStationId_: string = null;
    selectedStation: Naptan = null;
    filter: string = null;
    lines: Array<string> = null;
    selectedLine: string = null;

    private stations = MakeTubeNaptans();

    constructor(private http: HttpClient) {
        this.filteredStations = this.stations.filter(() => true);
    }

    set selectedStationId(s: string) {
        this.selectedStationId_ = s;
        Naptan.TubeLinesForNaptan(s, this.http).then(
            (lines: Array<string>) => {
                lines.push("walk");
                lines.push("bus/other");
                this.lines = lines;
                this.selectedLine = this.lines[0];
            });
    }

    get selectedStationId() { return this.selectedStationId_; }

    stationDidChange() {
    }

    lineDidChange() {
    }

    filterDidChange(filterValue: string) {
        this.filter = filterValue;
        this.updateFilteredStations();
    }

    updateFilteredStations() {
        if (!this.filter || this.filter == '') {
            this.filteredStations = this.stations;
            return;
        }
        let filterLC = this.filter.toLowerCase();
        let selectedStation = this.selectedStation;
        this.filteredStations = this.stations.filter((naptan: Naptan) => {
            return naptan == selectedStation || naptan.name.toLowerCase().indexOf(filterLC) >= 0;
        });
    }

};
