import wget
from bs4 import BeautifulSoup
import os
from pprint import pprint

URLS = R'''
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/bakerloo-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/central-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/circle-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/district-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/hammersmith-and-city-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/jubilee-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/metropolitan-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/northern-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/piccadilly-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/victoria-line-stations-map/
https://lasttrain.co.uk/tube-train-lines/london-underground-tube-line-names/waterloo-city-line-stations-map/
'''

fo = open("lists.txt", "w")

for url in URLS.split("\n"):
  if url=='': continue
  F = url.split("/")[-2] + ".html"
  #try: os.unlink(F)
  #except: pass
  if not os.path.exists(F):
    wget.download(url, F)
  soup = BeautifulSoup(open(F, "rb").read(), 'html.parser')
  for p in soup.find_all('p'):
    text = p.text
    if "," in text or "OR" in text:
      continue
    text = text.replace('’', "'")
    if len(text.split("\n"))<8:
      continue
    fo.write("`" + text + "`,\n")
