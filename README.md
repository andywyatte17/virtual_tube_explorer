## Summary - 2026-06-06

- Angular (v1.7.4) web app for exploring the London Underground — shows routes, timetables, station arrival predictions and a quick-route finder between stations.
- Integrates with the TfL API to fetch live arrival data and timetable information.
- Includes an SVG map view, passenger/naptan data handling, and a Karma/Protractor test suite.

# VirtualTubeExplorer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Notes to self

  - Display time current in Route > station view.
  - Filter timetable to only times after current.
  - Filter route list to, say, first 3...last 3.
      - Maybe on a toggle - full list/reduced list.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
