import requests
import json
from promise import Promise
from functools import reduce

apikey = ''
try:
    from apikey import _
    apikey = _
except:
    pass

'''
example
https://api.tfl.gov.uk/Journey/JourneyResults/940GZZLUEGW/to/940GZZLUEUS?date=20180512&time=0700&journeyPreference=LeastInterchange&mode=tube
'''

api = 'https://api.tfl.gov.uk/Journey/JourneyResults/{from_}/to/' + \
      '{to}?date={date_yyyymmdd}&time={time}&journeyPreference=LeastInterchange&mode=tube'
#api = api + apikey
edgware = '940GZZLUEGW'
euston = '940GZZLUEUS'

def print_req(r):
    print(r.status_code)
    if r.status_code!=200:
        print(r.json())
        return
    jso = map(lambda x : [x["currentLocation"], x["vehicleId"]], r.json())
    jso = list(jso)
    print(json.dumps(jso, indent=None))

def GetStLineDir():
    url = api.format( \
           from_=edgware, to=euston, date_yyyymmdd="20180512", \
           time="0715")
    print(url)
    return requests.get(url)

def Getters():
    yield GetStLineDir()

for x in Getters():
    print_req(x)
    print("\n")
