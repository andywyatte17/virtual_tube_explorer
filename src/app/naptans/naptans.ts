//
// naptans-tube.ts
//

import { HttpClient } from '@angular/common/http';
import { MakeTubeLines } from '../tfl_api/lines';
import { unique } from '../other/algorithm';
import { ApiKeys } from '../../environments/api-key';

export class Naptan {
  constructor(public id: string, public name: string) { }

  private static _cache = new Map<string, Array<string>>();

  static TubeLinesForNaptan(naptan: string, http: HttpClient) {
    if(Naptan._cache.has(naptan))
      return new Promise((resolve, reject) => {
        resolve(Naptan._cache.get(naptan));
      });

    return new Promise((resolve, reject) => {
      let url = `https://api.tfl.gov.uk/StopPoint/${naptan}`;
      url = ApiKeys.AddKeys(url);
      http.get<any>(url).subscribe((v: any) => {
        const lines = MakeTubeLines();
        let v_lines = <Array<any>>v["lines"];
        v_lines = v_lines.map((element: any) => <string>element.id);
        v_lines = v_lines.filter((lineId: any) => {
          return !!lines.find((x) => x == lineId);
        });
        console.dir(v_lines);
        Naptan._cache.set(naptan, v_lines);
        resolve(v_lines);
      });
    });
  }
}

//
// naptans-tube.ts
//

/* Found from:

  https://data.gov.uk/dataset/naptan > Zipped CSV Format (NaPTANcsv.zip)
                                     > Stops.csv
*/

const names_naptans = [
  // data from https://codegists.com/code/tfl-api-examples/
  ['940GZZLUBST', 'Baker Street'],
  ['940GZZLUCHX', 'Charing Cross'],
  ['940GZZLUEAC', 'Elephant & Castle'],
  ['940GZZLUEMB', 'Embankment'],
  ['940GZZLUERB', 'Edgware Road (Bakerloo)'],
  ['940GZZLUHAW', 'Harrow & Wealdstone'],
  ['940GZZLUHSN', 'Harlesden'],
  ['940GZZLUKEN', 'Kenton'],
  ['940GZZLUKPK', 'Kilburn Park'],
  ['940GZZLUKSL', 'Kensal Green'],
  ['940GZZLULBN', 'Lambeth North'],
  ['940GZZLUMVL', 'Maida Vale'],
  ['940GZZLUMYB', 'Marylebone'],
  ['940GZZLUNWY', 'North Wembley'],
  ['940GZZLUOXC', 'Oxford Circus'],
  ['940GZZLUPAC', 'Paddington'],
  ['940GZZLUPCC', 'Piccadilly Circus'],
  ['940GZZLUQPS', 'Queen\'s Park'],
  ['940GZZLURGP', 'Regent\'s Park'],
  ['940GZZLUSGP', 'Stonebridge Park'],
  ['940GZZLUSKT', 'South Kenton'],
  ['940GZZLUWJN', 'Willesden Junction'],
  ['940GZZLUWKA', 'Warwick Avenue'],
  ['940GZZLUWLO', 'Waterloo'],
  ['940GZZLUWYC', 'Wembley Central'],
  ['940GZZLUADE', 'Aldgate East'],
  ['940GZZLUBBB', 'Bromley-by-Bow'],
  ['940GZZLUBBN', 'Barbican'],
  ['940GZZLUBKG', 'Barking'],
  ['940GZZLUBWR', 'Bow Road'],
  ['940GZZLUEHM', 'East Ham'],
  ['940GZZLUERC', 'Edgware Road (Circle Line)'],
  ['940GZZLUESQ', 'Euston Square'],
  ['940GZZLUFCN', 'Farringdon'],
  ['940GZZLUGHK', 'Goldhawk Road'],
  ['940GZZLUGPS', 'Great Portland Street'],
  ['940GZZLUHSC', 'Hammersmith (H&C Line)'],
  ['940GZZLUKSX', 'King\'s Cross St. Pancras'],
  ['940GZZLULAD', 'Ladbroke Grove'],
  ['940GZZLULRD', 'Latimer Road'],
  ['940GZZLULVT', 'Liverpool Street'],
  ['940GZZLUMED', 'Mile End'],
  ['940GZZLUMGT', 'Moorgate'],
  ['940GZZLUPAH', 'Paddington (H&C Line)-Underground'],
  ['940GZZLUPLW', 'Plaistow'],
  ['940GZZLURYO', 'Royal Oak'],
  ['940GZZLUSBM', 'Shepherd\'s Bush Market'],
  ['940GZZLUSGN', 'Stepney Green'],
  ['940GZZLUUPK', 'Upton Park'],
  ['940GZZLUWHM', 'West Ham'],
  ['940GZZLUWLA', 'Wood Lane'],
  ['940GZZLUWPL', 'Whitechapel'],
  ['940GZZLUWSP', 'Westbourne Park'],
  ['940GZZLUBMY', 'Bermondsey'],
  ['940GZZLUBND', 'Bond Street'],
  ['940GZZLUCGT', 'Canning Town'],
  ['940GZZLUCPK', 'Canons Park'],
  ['940GZZLUCWR', 'Canada Water'],
  ['940GZZLUCYF', 'Canary Wharf'],
  ['940GZZLUDOH', 'Dollis Hill'],
  ['940GZZLUFYR', 'Finchley Road'],
  ['940GZZLUGPK', 'Green Park'],
  ['940GZZLUKBN', 'Kilburn'],
  ['940GZZLUKBY', 'Kingsbury'],
  ['940GZZLULNB', 'London Bridge'],
  ['940GZZLUNDN', 'Neasden'],
  ['940GZZLUNGW', 'North Greenwich'],
  ['940GZZLUQBY', 'Queensbury'],
  ['940GZZLUSJW', 'St. John\'s Wood'],
  ['940GZZLUSTD', 'Stratford'],
  ['940GZZLUSTM', 'Stanmore'],
  ['940GZZLUSWC', 'Swiss Cottage'],
  ['940GZZLUSWK', 'Southwark'],
  ['940GZZLUWHP', 'West Hampstead'],
  ['940GZZLUWIG', 'Willesden Green'],
  ['940GZZLUWSM', 'Westminster'],
  ['940GZZLUWYP', 'Wembley Park'],
  ['940GZZLUBKE', 'Barkingside'],
  ['940GZZLUBKH', 'Buckhurst Hill'],
  ['940GZZLUBLG', 'Bethnal Green'],
  ['940GZZLUBNK', 'Bank'],
  ['940GZZLUCHL', 'Chancery Lane'],
  ['940GZZLUCWL', 'Chigwell'],
  ['940GZZLUDBN', 'Debden'],
  ['940GZZLUEAN', 'East Acton'],
  ['940GZZLUEBY', 'Ealing Broadway'],
  ['940GZZLUEPG', 'Epping'],
  ['940GZZLUFLP', 'Fairlop'],
  ['940GZZLUGFD', 'Greenford'],
  ['940GZZLUGGH', 'Grange Hill'],
  ['940GZZLUGTH', 'Gants Hill'],
  ['940GZZLUHBN', 'Holborn'],
  ['940GZZLUHGR', 'Hanger Lane'],
  ['940GZZLUHLT', 'Hainault'],
  ['940GZZLUHPK', 'Holland Park'],
  ['940GZZLULGN', 'Loughton'],
  ['940GZZLULGT', 'Lancaster Gate'],
  ['940GZZLULYN', 'Leyton'],
  ['940GZZLULYS', 'Leytonstone'],
  ['940GZZLUMBA', 'Marble Arch'],
  ['940GZZLUNAN', 'North Acton'],
  ['940GZZLUNBP', 'Newbury Park'],
  ['940GZZLUNHG', 'Notting Hill Gate'],
  ['940GZZLUNHT', 'Northolt'],
  ['940GZZLUPVL', 'Perivale'],
  ['940GZZLUQWY', 'Queensway'],
  ['940GZZLURBG', 'Redbridge'],
  ['940GZZLURSG', 'Ruislip Gardens'],
  ['940GZZLURVY', 'Roding Valley'],
  ['940GZZLUSBC', 'Shepherd\'s Bush (Central)'],
  ['940GZZLUSNB', 'Snaresbrook'],
  ['940GZZLUSPU', 'St. Paul\'s'],
  ['940GZZLUSRP', 'South Ruislip'],
  ['940GZZLUSWF', 'South Woodford'],
  ['940GZZLUTCR', 'Tottenham Court Road'],
  ['940GZZLUTHB', 'Theydon Bois'],
  ['940GZZLUWCY', 'White City'],
  ['940GZZLUWOF', 'Woodford'],
  ['940GZZLUWRP', 'West Ruislip'],
  ['940GZZLUWSD', 'Wanstead'],
  ['940GZZLUWTA', 'West Acton'],
  ['940GZZLUALD', 'Aldgate'],
  ['940GZZLUBKF', 'Blackfriars'],
  ['940GZZLUBWT', 'Bayswater'],
  ['940GZZLUCST', 'Cannon Street'],
  ['940GZZLUECT', 'Earl\'s Court'],
  ['940GZZLUGTR', 'Gloucester Road'],
  ['940GZZLUHSK', 'High Street Kensington'],
  ['940GZZLUMMT', 'Monument'],
  ['940GZZLUMSH', 'Mansion House'],
  ['940GZZLUSJP', 'St. James\'s Park'],
  ['940GZZLUSKS', 'South Kensington'],
  ['940GZZLUSSQ', 'Sloane Square'],
  ['940GZZLUTMP', 'Temple'],
  ['940GZZLUTWH', 'Tower Hill'],
  ['940GZZLUVIC', 'Victoria'],
  ['940GZZLUACT', 'Acton Town'],
  ['940GZZLUBEC', 'Becontree'],
  ['940GZZLUBSC', 'Barons Court'],
  ['940GZZLUCWP', 'Chiswick Park'],
  ['940GZZLUDGE', 'Dagenham East'],
  ['940GZZLUDGY', 'Dagenham Heathway'],
  ['940GZZLUECM', 'Ealing Common'],
  ['940GZZLUEPK', 'Elm Park'],
  ['940GZZLUEPY', 'East Putney'],
  ['940GZZLUFBY', 'Fulham Broadway'],
  ['940GZZLUGBY', 'Gunnersbury'],
  ['940GZZLUHCH', 'Hornchurch'],
  ['940GZZLUHSD', 'Hammersmith (Dist&Picc Line)'],
  ['940GZZLUKOY', 'Kensington (Olympia)'],
  ['940GZZLUKWG', 'Kew Gardens'],
  ['940GZZLUPSG', 'Parsons Green'],
  ['940GZZLUPYB', 'Putney Bridge'],
  ['940GZZLURMD', 'Richmond'],
  ['940GZZLURVP', 'Ravenscourt Park'],
  ['940GZZLUSFB', 'Stamford Brook'],
  ['940GZZLUSFS', 'Southfields'],
  ['940GZZLUTNG', 'Turnham Green'],
  ['940GZZLUUPB', 'Upminster Bridge'],
  ['940GZZLUUPM', 'Upminster'],
  ['940GZZLUUPY', 'Upney'],
  ['940GZZLUWBN', 'West Brompton'],
  ['940GZZLUWIM', 'Wimbledon'],
  ['940GZZLUWIP', 'Wimbledon Park'],
  ['940GZZLUWKN', 'West Kensington'],
  ['940GZZLUAMS', 'Amersham'],
  ['940GZZLUCAL', 'Chalfont & Latimer'],
  ['940GZZLUCSM', 'Chesham'],
  ['940GZZLUCXY', 'Croxley'],
  ['940GZZLUCYD', 'Chorleywood'],
  ['940GZZLUEAE', 'Eastcote'],
  ['940GZZLUHGD', 'Hillingdon'],
  ['940GZZLUHOH', 'Harrow-on-the-Hill'],
  ['940GZZLUICK', 'Ickenham'],
  ['940GZZLUMPK', 'Moor Park'],
  ['940GZZLUNHA', 'North Harrow'],
  ['940GZZLUNKP', 'Northwick Park'],
  ['940GZZLUNOW', 'Northwood'],
  ['940GZZLUNWH', 'Northwood Hills'],
  ['940GZZLUPNR', 'Pinner'],
  ['940GZZLUPRD', 'Preston Road'],
  ['940GZZLURKW', 'Rickmansworth'],
  ['940GZZLURSM', 'Ruislip Manor'],
  ['940GZZLURSP', 'Ruislip'],
  ['940GZZLURYL', 'Rayners Lane'],
  ['940GZZLUUXB', 'Uxbridge'],
  ['940GZZLUWAF', 'Watford'],
  ['940GZZLUWHW', 'West Harrow'],
  ['940GZZLUBLR', 'Blackhorse Road'],
  ['940GZZLUBXN', 'Brixton'],
  ['940GZZLUEUS', 'Euston'],
  ['940GZZLUFPK', 'Finsbury Park'],
  ['940GZZLUHAI', 'Highbury & Islington'],
  ['940GZZLUPCO', 'Pimlico'],
  ['940GZZLUSKW', 'Stockwell'],
  ['940GZZLUSVS', 'Seven Sisters'],
  ['940GZZLUTMH', 'Tottenham Hale'],
  ['940GZZLUVXL', 'Vauxhall'],
  ['940GZZLUWRR', 'Warren Street'],
  ['940GZZLUWWL', 'Walthamstow Central'],
  ['940GZZLUACY', 'Archway'],
  ['940GZZLUAGL', 'Angel'],
  ['940GZZLUBLM', 'Balham'],
  ['940GZZLUBOR', 'Borough'],
  ['940GZZLUBTK', 'Burnt Oak'],
  ['940GZZLUBTX', 'Brent Cross'],
  ['940GZZLUBZP', 'Belsize Park'],
  ['940GZZLUCFM', 'Chalk Farm'],
  ['940GZZLUCND', 'Colindale'],
  ['940GZZLUCPC', 'Clapham Common'],
  ['940GZZLUCPN', 'Clapham North'],
  ['940GZZLUCPS', 'Clapham South'],
  ['940GZZLUCSD', 'Colliers Wood'],
  ['940GZZLUCTN', 'Camden Town'],
  ['940GZZLUEFY', 'East Finchley'],
  ['940GZZLUEGW', 'Edgware'],
  ['940GZZLUFYC', 'Finchley Central'],
  ['940GZZLUGDG', 'Goodge Street'],
  ['940GZZLUGGN', 'Golders Green'],
  ['940GZZLUHBT', 'High Barnet'],
  ['940GZZLUHCL', 'Hendon Central'],
  ['940GZZLUHGT', 'Highgate'],
  ['940GZZLUHTD', 'Hampstead'],
  ['940GZZLUKNG', 'Kennington'],
  ['940GZZLUKSH', 'Kentish Town'],
  ['940GZZLULSQ', 'Leicester Square'],
  ['940GZZLUMDN', 'Morden'],
  ['940GZZLUMHL', 'Mill Hill East'],
  ['940GZZLUMTC', 'Mornington Crescent'],
  ['940GZZLUODS', 'Old Street'],
  ['940GZZLUOVL', 'Oval'],
  ['940GZZLUSWN', 'South Wimbledon'],
  ['940GZZLUTAW', 'Totteridge & Whetstone'],
  ['940GZZLUTBC', 'Tooting Bec'],
  ['940GZZLUTBY', 'Tooting Broadway'],
  ['940GZZLUTFP', 'Tufnell Park'],
  ['940GZZLUWFN', 'West Finchley'],
  ['940GZZLUWOP', 'Woodside Park'],
  //['910GENFCOAK', 'Oakwood Station'],
  ['940GZZLUALP', 'Alperton'],
  ['940GZZLUASG', 'Arnos Grove'],
  ['940GZZLUASL', 'Arsenal'],
  ['940GZZLUBDS', 'Bounds Green'],
  ['940GZZLUBOS', 'Boston Manor'],
  ['940GZZLUCAR', 'Caledonian Road'],
  ['940GZZLUCGN', 'Covent Garden'],
  ['940GZZLUCKS', 'Cockfosters'],
  ['940GZZLUHNX', 'Hatton Cross'],
  ['940GZZLUHPC', 'Hyde Park Corner'],
  ['940GZZLUHR4', 'Heathrow Terminal 4'],
  ['940GZZLUHR5', 'Heathrow Terminal 5'],
  ['940GZZLUHRC', 'Heathrow Terminals 1-2-3'],
  ['940GZZLUHWC', 'Hounslow Central'],
  ['940GZZLUHWE', 'Hounslow East'],
  ['940GZZLUHWT', 'Hounslow West'],
  ['940GZZLUHWY', 'Holloway Road'],
  ['940GZZLUKNB', 'Knightsbridge'],
  ['940GZZLUMRH', 'Manor House'],
  ['940GZZLUNEN', 'North Ealing'],
  ['940GZZLUNFD', 'Northfields'],
  ['940GZZLUOAK', 'Oakwood'],
  ['940GZZLUOSY', 'Osterley'],
  ['940GZZLUPKR', 'Park Royal'],
  ['940GZZLURSQ', 'Russell Square'],
  ['940GZZLUSEA', 'South Ealing'],
  ['940GZZLUSGT', 'Southgate'],
  ['940GZZLUSHH', 'South Harrow'],
  ['940GZZLUSUH', 'Sudbury Hill'],
  ['940GZZLUSUT', 'Sudbury Town'],
  ['940GZZLUTPN', 'Turnpike Lane'],
  ['940GZZLUWOG', 'Wood Green']
];

export function MakeTubeNaptans(sorted = true) {
  let rv = names_naptans.map((v) => {
    let [naptan, name] = v;
    return new Naptan(naptan, name);
  });
  if (sorted)
  {
    rv = rv.sort((a: Naptan, b: Naptan) => {
      return a.name < b.name ? -1 : b.name < a.name ? 1 : 0;
    });
  }
  return rv;
}

export function StationNameToNaptan(name:string) : string
{
  let found = names_naptans.find( (nap_nam) => name==nap_nam[1] );
  if(found)
    return found[0];
  return null;
}

export function StationNaptanToName(naptan:string) : string
{
  let found = names_naptans.find( (nap_nam) => naptan==nap_nam[0] );
  if(found)
    return found[1];
  return null;
}
