import urllib

def make_url(base_url , *res, **params):
    '''
Example:
  result = make_url('http://example.com', 'user', 'ivan', aloholic='true', age=18)
  "result = http://example.com/user/ivan?age=18&aloholic=true"
    '''
    url = base_url
    for r in res:
        url = '{}/{}'.format(url, r)
    if params:
        url = '{}?{}'.format(url, urllib.urlencode(params))
    return url