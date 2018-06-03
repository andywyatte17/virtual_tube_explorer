from bs4 import BeautifulSoup
import re
from jinja2 import Template, escape

f = 'lu_just_stations.svg'
soup = BeautifulSoup(open(f).read(), 'html.parser')

def ParentTransformOffset(x):
  tr = []
  while True:
    x = x.parent
    if not x: break
    if x.has_attr("transform"):
      tr = [x["transform"]] + tr
      if not "translate" in tr[0]:
        raise RuntimeError("Incorrect transform (non-translate) found")
  if tr != []:
    dx, dy = (0,0)
    for x in tr:
      x2 = x.split(",")
      dx += float(x2[0].replace("translate(", ""))
      dy += float(x2[1].replace(")", ""))
    return (dx,dy)
  return (0,0)

stations = []
for tag in soup.find_all("text"):
  text = tag.text
  text = text.lstrip().rstrip()
  text = re.sub("\n", "", text)
  text = re.sub(" +", " ", text)
  dx, dy = ParentTransformOffset(tag)
  x = dx + float(tag["x"])
  y = dy + float(tag["y"])
  stations.append( {"name":escape(text), "x":x, "y":y} )
  #print("{}, {}, {}".format(text, x, y))

pre = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2500" height="1320" viewBox="-40.5 -120.5 2500 1320">
<style type="text/css">
text {font-family:Arimo,Liberation Sans,HammersmithOne,Helvetica,Arial,sans-serif}
/* #stname_Bakerloo_line { fill:brown } */
#stname_interchanges {
  fill: rebeccapurple;
}
#stname_Bakerloo_line  {
   fill: #963;
}
#stname_Central_line  {
   fill: #c33;
}
#stname_Jubilee_line  {
   fill: #889;
}
/*
#stname_Hammersmith-city_line  {
   fill: #c99;
}
*/
#stname_District_line_and_Hammersmith_And_City_line  {
   fill: #063;
}
#stname_Metropolitan_line  {
   fill: #a06;
}
#stname_Piccadilly_line  {
   fill: #048;
}
#stname_Circle_line  {
   fill: #fc0;
    color: #333;
}
#stname_Victoria_line  {
   fill: #09c;
}
</style>
<g>'''

post = "</g>"

tmpl = '''{% for station in stations %}
  <text x="{{ station.x }}" y="{{ station.y }}" name="{{ station.name }}">*</text>
{% endfor %}'''

template = Template(tmpl)
open('lu.svg', 'w').write( pre + template.render(stations=stations) + post )

# ...

tmpl2 = '''{% for station in stations %}
  <text [attr.opacity]="opacity('{{ station.name }}')" x="{{ station.x }}" y="{{ station.y }}" name="{{ station.name }}">*</text>
{% endfor %}'''

template = Template(tmpl2)
open('lu2.svg', 'w').write( pre + template.render(stations=stations) + post )
