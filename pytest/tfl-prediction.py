import requests
import xmltodict
from pprint import pprint, pformat

lines = {
    'B': 'Bakerloo',
    'C': 'Central',
    'D': 'District',
    'H': 'Hammersmith & Circle',
    'J': 'Jubilee',
    'M': 'Metropolitan',
    'N': 'Northern',
    'P': 'Piccadilly',
    'V': 'Victoria',
    'W': 'Waterloo & City',
}

response = requests.get(
  'http://cloud.tfl.gov.uk/TrackerNet/PredictionSummary/N'
)
print(response.status_code)
#print(response.content)
print(len(response.content))
d = xmltodict.parse(response.content)
d = d["ROOT"]
print("TimeStamp: " + pformat(d["Time"]["@TimeStamp"]))
#s = list(filter(lambda x: x < 0, number_list))
ANG = list(filter(lambda x : x["@N"]=="High Barnet.", d["S"]))
#pprint(ANG)
ANG_P = [x["P"] for x in ANG]
pprint(ANG_P)

''' example:
<ROOT>
  <Time TimeStamp="2018/05/13 16:10:41"/>
  <S Code="ANG" N="Angel.">
    <P N="Southbound - Platform 1" Code="1" Next="0">
      <T S="015" T="9" D="308" C="0:30" L="Between Kings Cross and Angel" DE="Morden via Bank"/>
      <T S="126"...>
    </P>
  <S...>
  <S...>
</ROOT>

<S> is station
  <P> is platform within station
    <T> is train running towards the platform
'''