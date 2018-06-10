//
// adjacent-stations.ts
//

import { MakeTubeNaptans, Naptan } from "../naptans/naptans";

export type LineStations = { line: string, stations: string };

/*
line: 'old_circle', {
stations: `Aldgate
Tower Hill
Monument
Cannon Street
Mansion House
Blackfriars
Temple
Embankment
Westminster
St. James's Park
Victoria
Sloane Square
South Kensington
Gloucester Road
High Street Kensington
Notting Hill Gate
Bayswater
Paddington
Edgware Road
Baker Street
Great Portland Street
Euston Square
King's Cross St. Pancras
Farringdon
Barbican
Moorgate
Liverpool Street` } */

export const adjacentStations: Array<string> = [
  `Barking
East Ham
Upton Park
West Ham
Bromley-by-Bow
Bow Road
Mile End
Stepney Green
Whitechapel
Aldgate East
Liverpool Street
Moorgate
Barbican
Farringdon
King's Cross St. Pancras
Euston Square
Great Portland Street
Baker Street
Edgware Road
Paddington
Royal Oak
Westbourne Park
Ladbroke Grove
Latimer Road
Wood Lane
Shepherd's Bush Market
Goldhawk Road
Hammersmith`,
  `Aldgate
Liverpool Street
Moorgate
Barbican
Farringdon
King's Cross St. Pancras
Euston Square
Great Portland Street
Baker Street
Finchley Road
Wembley Park
Preston Road
Northwick Park
Harrow-on-the-Hill
North Harrow
Pinner
Northwood Hills
Northwood
Moor Park
Croxley
Watford`,
  `Aldgate
Liverpool Street
Moorgate
Barbican
Farringdon
King's Cross St. Pancras
Euston Square
Great Portland Street
Baker Street
Finchley Road
Wembley Park
Preston Road
Northwick Park
Harrow-on-the-Hill
North Harrow
Pinner
Northwood Hills
Northwood
Moor Park
Rickmansworth
Chorleywood
Chalfont & Latimer
Amersham`,
  `Chalfont & Latimer
Chesham`,
  `Aldgate
Liverpool Street
Moorgate
Barbican
Farringdon
King's Cross St. Pancras
Euston Square
Great Portland Street
Baker Street
Finchley Road
Wembley Park
Preston Road
Northwick Park
Harrow-on-the-Hill
West Harrow
Rayners Lane
Eastcote
Ruislip Manor
Ruislip
Ickenham
Hillingdon
Uxbridge`,
  `Morden
South Wimbledon
Colliers Wood
Tooting Broadway
Tooting Bec
Balham
Clapham South
Clapham Common
Clapham North
Stockwell
Oval
Kennington
Waterloo
Embankment
Charing Cross
Leicester Square
Tottenham Court Road
Goodge Street
Warren Street
Euston
Mornington Crescent
Camden Town
Chalk Farm
Belsize Park
Hampstead
Golders Green
Brent Cross
Hendon Central
Colindale
Burnt Oak
Edgware`,
  `Morden
South Wimbledon
Colliers Wood
Tooting Broadway
Tooting Bec
Balham
Clapham South
Clapham Common
Clapham North
Stockwell
Oval
Kennington
Elephant & Castle
Borough
London Bridge
Bank
Moorgate
Old Street
Angel
King's Cross St. Pancras
Euston
Camden Town
Kentish Town
Tufnell Park
Archway
Highgate
East Finchley
Finchley Central
West Finchley
Woodside Park
Totteridge & Whetstone
High Barnet`,
  `Finchley Central
Mill Hill East`
];

export function Check() {
  const naptans = MakeTubeNaptans();

  adjacentStations.forEach(
    (s: string) => {
      s.split("\n").forEach((name: string) => {
        const found = naptans.find((value: Naptan) => value.name == name);
        if (!found)
          console.log(name);
      });
    });
}