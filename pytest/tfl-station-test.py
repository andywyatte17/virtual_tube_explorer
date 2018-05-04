import requests
import json
from promise import Promise
from functools import reduce

arrivals_at_station_and_line_direction = 'https://api.tfl.gov.uk/Line/{tubeline}/Arrivals/{naptan}?direction={in_out_bound}'
arrivals_at_station_and_line = 'https://api.tfl.gov.uk/Line/{tubeline}/Arrivals/{naptan}'
arrivals_on_line = 'https://api.tfl.gov.uk/Line/{tubeline}/Arrivals'
bakerstreet = '940GZZLUBST'

def print_req(r):q
    print(r.status_code)
    jso = map(lambda x : [x["currentLocation"], x["vehicleId"]], r.json())
    jso = list(jso)
    print(json.dumps(jso, indent=None))

def GetStLineDir():
    return requests.get(arrivals_at_station_and_line_direction.format( \
           tubeline="bakerloo", naptan=bakerstreet, in_out_bound='outbound'))

def GetStLine():
    return requests.get(arrivals_at_station_and_line.format( \
           tubeline="bakerloo", naptan=bakerstreet))

def GetLine():
    return requests.get(arrivals_on_line.format(tubeline="bakerloo"))

def Getters():
    yield GetStLineDir()
    yield GetStLine()
    yield GetLine()

for x in Getters():
    print_req(x)
    print("\n")
