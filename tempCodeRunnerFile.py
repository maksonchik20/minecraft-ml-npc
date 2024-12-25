import requests
import json
import time
import jwt
import os

service_account_id = "aje02n3hfuofkb0ik91r"
key_id = "ajevjm9htull1llriop5"
private_key = '''PLEASE DO NOT REMOVE THIS LINE! Yandex.Cloud SA Key ID <ajevjm9htull1llriop5>
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCljql3E5gBER0
3bmgj9VXpgxI/GMMEI0j8+DAuFJeLV3DmpFZACMzQb8KliDYg32Bch5SEh43EqIB
L1ydUVTFLlTwq9z6CfJf3ErY976QgW2ACYYA8EoO9WQyI2/NFYlGmFc5h1LJFh2r
1bT3VDRWkf8Mx2emMnEJXdltADsR22pLpwEm6Y4HsrLR9xbsqo1VLC+lhgr3XXY1
dgFgSiyNNjFAfX2kQCMnvqn8mhmxciZBCjBadqo1Yv6A1rOAaJZgwSt+agpWWFuC
YsyBW+/nTszIUY4d6Y8VoUvQPTEkdz1V7HNA7tuf5BIdVUf/ixvjjaxU56PRyO3r
V295ZCkHAgMBAAECggEABEqttV6lnbEL7WJQisSiHrMUc8L7MeMwCuBQZK7/3Izk
H/sxfhoaONbI1hszImZp8BwF4VGopcEekjnhsU88mc5cZG1FlUMRbJ35xFmhiUgN
UNBPoA0++p/QmGu9PKRrdS4ejWzRoJbENm7NuFehRI25c6AbUleHXvKWT5BOtx9h
1Z7wesMziDS9VXYJrQ4Xni+YXRXM0nkBnJ5EI5c8hNfOKKaL1M9Ll04wIm2HvzTt
XEcq4oF24w+H0/fN/UlF//O/ReXD1ssVhkYEexun8LwwknISopEJuTL2PGsJKQm4
JgbaB3alp7HOWCZy1+HupMPYpohw7C0+q/xRs7WN6QKBgQDVXoZxLpcLIxoI6mwp
BRZdlDj6NxKfI+7isR3hSe4uPiqhaNJlO06a3lCf9IZyHsqP8ftqlPdAJuMCCOEb
JX/L8Vh/UpxWkGAS/jKLLShlE1IQwGy+IlVBOEN/33FNyj4yPbVN19fxSExd8HyS
FVKVp41OpAtEXE3wN0MwKSIAGQKBgQDpdwQDc0dQZEN7EPU5YuyorVVhbXGNfKve
sIdfIiEoUu0f2vNgCqQZarGE7GTBbkMTSgBAHQlVEsyB/rkNmLyH4PvN9MI1GP3u
r1t1QP+4sEgEoz73f9Sz9FyaJObzVXZV9Xs1aZO0UZt7z++HcQjv2jGUKyIFlwIl
e3LU3OQWHwKBgQCVqjI/neCRDVQrwNORimH/zgKRcKP9QOVF2dsNth/+C9k3UyGR
pKIke6CuMoVD81k+0wv53Pf55c0CFlxgAFO+KFJdLQNArRDXAbtOaKSXEZBU88TT
MZ3/m4mtXnxJhn1OHH7aVXbBZmc61X9rsM028EpsSSEmGGELCJh2ZcPVsQKBgQDm
lic/pSdFbpH7xgb+VAd8nh5bKPZjkURLoT1DJ/lp02Xi9aU1Ma1ccTW+HKFzLw1O
yuMub79c6EFXD5gEpttmtT7e76S1PubnTQle6QDpkCrBcd7qIraZunuPv2zf34QO
aHP1kD5TddrE0d45ftod0/rt5iAnNzvme2Qye61HbwKBgG5iYrfnNFWHsJUvETL8
AuBWcAoMRr4dQgxlsl8Rz44LWziL1WrRcg7Z/9LiFi52XEwjCS9EGpeDbI6FNkr5
nsuocxmH2/+7XTT/6s47lsWIaJ7unltX/STUbY3bv47jz1AU1ajLvqSEwEM1e4PK
TAQLTiJK00fp0yIA4yy/ezuT
-----END PRIVATE KEY-----'''
now = int(time.time())
payload = {
        'aud': 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
        'iss': service_account_id,
        'iat': now,
        'exp': now + 3600}

# JWT generation
encoded_token = jwt.encode(
    payload,
    private_key,
    algorithm='PS256',
    headers={'kid': key_id})

url = 'https://iam.api.cloud.yandex.net/iam/v1/tokens'
x = requests.post(url,  headers={'Content-Type': 'application/json'}, json = {'jwt': encoded_token}).json()
token = x['iamToken']
print(token)