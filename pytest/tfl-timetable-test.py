import requests
import json
from promise import Promise
from functools import reduce
from pprint import pprint

apikey = ''
try:
    from apikey import _
    apikey = _
except:
    pass

api = 'https://api.tfl.gov.uk/Line/{line}/Timetable/{from_}/to/{to}'
api = api + "?" + apikey

def print_req(r):
    print(r.status_code)
    jso = r.json()

    if 0:
        pprint( \
            list( map( lambda x : (x["hour"], x['minute']), \
                  jso["timetable"]["routes"][0]["schedules"][0]["knownJourneys"]) ) )

    #for k in ["timetable", "routes", 0, "schedules", 0, "knownJourneys", -1]:
    for k in ["timetable", "routes", 0, "stationIntervals", 0, "intervals", 0, "timeToArrival", -1]:
        if r.status_code==200:
            #tmp = map(lambda x : x, r.json())
            #tmp = list(jso)
            #print(json.dumps(tmp, indent=2))
            try: pprint(jso.keys())
            except: pass
            try: x = jso[0].keys(); pprint(x);
            except: pass
        if k!=-1: jso = jso[k]

edgware = '940GZZLUEGW'
euston = '940GZZLUEUS'
def GetStLineDir():
    url = api.format(from_=edgware, to=euston, line='northern')
    print(url)
    return requests.get(url)

def Getters():
    yield GetStLineDir()

for x in Getters():
    print_req(x)
    print("\n")
