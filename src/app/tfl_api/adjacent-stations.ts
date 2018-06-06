import { MakeTubeNaptans, Naptan } from "../naptans/naptans";

//
// adjacent-stations.ts
//

export const adjacentStations: Array<string> = [
  `Elephant & Castle
Lambeth North
Waterloo
Embankment
Charing Cross
Piccadilly Circus
Oxford Circus
Regent's Park
Baker Street
Marylebone
Edgware Road
Paddington
Warwick Avenue
Maida Vale
Kilburn Park
Queen's Park
Kensal Green
Willesden Junction
Harlesden
Stonebridge Park
Wembley Central
North Wembley
South Kenton
Kenton
Harrow & Wealdstone`,  
  `Epping
Theydon Bois
Debden
Loughton
Buckhurst Hill
Woodford
South Woodford
Snaresbrook
Leytonstone
Leyton
Stratford
Mile End
Bethnal Green
Liverpool Street
Bank
St. Paul's
Chancery Lane
Holborn
Tottenham Court Road
Oxford Circus
Bond Street
Marble Arch
Lancaster Gate
Queensway
Notting Hill Gate
Holland Park
Shepherd's Bush
White City
East Acton
North Acton
West Acton
Ealing Broadway`,
  `Roding Valley
Chigwell
Grange Hill
Hainault
Fairlop
Barkingside
Newbury Park
Gants Hill
Redbridge
Wanstead
Leytonstone
Leyton
Stratford
Mile End
Bethnal Green
Liverpool Street
Bank
St. Paul's
Chancery Lane
Holborn
Tottenham Court Road
Oxford Circus
Bond Street
Marble Arch
Lancaster Gate
Queensway
Notting Hill Gate
Holland Park
Shepherd's Bush
White City
East Acton
North Acton
Hanger Lane
Perivale
Greenford
Northolt
South Ruislip
Ruislip Gardens
West Ruislip`,
  `Aldgate
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
Liverpool Street`,
  `Upminster
Upminster Bridge
Hornchurch
Elm Park
Dagenham East
Dagenham Heathway
Becontree
Upney
Barking
East Ham
Upton Park
Plaistow
West Ham
Bromley-by-Bow
Bow Road
Mile End
Stepney Green
Whitechapel
Aldgate East
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
Earl's Court
West Kensington
Barons Court
Hammersmith
Ravenscourt Park
Stamford Brook
Turnham Green
Gunnersbury
Kew Gardens
Richmond`,
  `Upminster
Upminster Bridge
Hornchurch
Elm Park
Dagenham East
Dagenham Heathway
Becontree
Upney
Barking
East Ham
Upton Park
Plaistow
West Ham
Bromley-by-Bow
Bow Road
Mile End
Stepney Green
Whitechapel
Aldgate East
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
Earl's Court
West Kensington
Barons Court
Hammersmith
Ravenscourt Park
Stamford Brook
Turnham Green
Chiswick Park
Acton Town
Ealing Common
Ealing Broadway`,
  `Upminster
Upminster Bridge
Hornchurch
Elm Park
Dagenham East
Dagenham Heathway
Becontree
Upney
Barking
East Ham
Upton Park
Plaistow
West Ham
Bromley-by-Bow
Bow Road
Mile End
Stepney Green
Whitechapel
Aldgate East
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
Earl's Court
West Brompton
Fulham Broadway
Parsons Green
Putney Bridge
East Putney
Southfields
Wimbledon Park
Wimbledon`,
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
  `Stanmore
Canons Park
Queensbury
Kingsbury
Wembley Park
Neasden
Dollis Hill
Willesden Green
Kilburn
West Hampstead
Finchley Road
Swiss Cottage
St. John's Wood
Baker Street
Bond Street
Green Park
Westminster
Waterloo
Southwark
London Bridge
Bermondsey
Canada Water
Canary Wharf
North Greenwich
Canning Town
West Ham
Stratford`,
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
Mill Hill East`,
  `Cockfosters
Oakwood
Southgate
Arnos Grove
Bounds Green
Wood Green
Turnpike Lane
Manor House
Finsbury Park
Arsenal
Holloway Road
Caledonian Road
King's Cross St. Pancras
Russell Square
Holborn
Covent Garden
Leicester Square
Piccadilly Circus
Green Park
Hyde Park Corner
Knightsbridge
South Kensington
Gloucester Road
Earl's Court
Barons Court
Hammersmith
Turnham Green
Acton Town
Ealing Common
North Ealing
Park Royal
Alperton
Sudbury Town
Sudbury Hill
South Harrow
Rayners Lane
Eastcote
Ruislip Manor
Ruislip
Ickenham
Hillingdon
Uxbridge`,
  `Walthamstow Central
Blackhorse Road
Tottenham Hale
Seven Sisters
Finsbury Park
Highbury & Islington
King's Cross St. Pancras
Euston
Warren Street
Oxford Circus
Green Park
Victoria
Pimlico
Vauxhall
Stockwell
Brixton`
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