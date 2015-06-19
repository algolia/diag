# diag

`diag` is the [Algolia](https://www.algolia.com/) diagnostic tool.

![screenshot](screenshot.gif)

Current [diagnostics](src/diagnostics/):

  * full [user-agent](https://github.com/faisalman/ua-parser-js) and timezone of the user
  * current ip
  * proxy detection
  * [geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation) and reverse geocoding using [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim#Reverse_Geocoding_.2F_Address_lookup)
  * [navigation timing](http://www.w3.org/TR/navigation-timing/) of the diag tool webpage
  * `/favicon.ico` download timing from big websites
  * Algolia [/diag](https://latency-dsn.algolia.net/diag) endpoint [resource timing](https://www.w3.org/TR/resource-timing/)
  * [algoliasearch](https://github.com/algolia/algoliasearch-client-js) simple empty search
  * Latency, bandwidth, ipv6 and mobile connection measurements using [lognormal/boomerang](https://github.com/lognormal/boomerang)

## dev mode

```sh
npm install
npm run dev
```

## build mode

```sh
npm run build
npm run serve-build
```

## publish (https://algolia.github.io/diag/)

```sh
npm run publish
```

## [boomerang](https://github.com/lognormal/boomerang) build

We use [lognormal/boomerang](https://github.com/lognormal/boomerang) as a way to gather
even more information on the setup.

The frontend/boomerang file was built with:

```sh
git clone git@github.com:lognormal/boomerang.git
cd boomerang
npm install -g uglifyjs
make PLUGINS='plugins/rt.js plugins/bw.js plugins/ipv6.js plugins/mobile.js' MINIFIER='uglifyjs'
```
