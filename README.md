# Palmetto Flow PouchDB Service

A service that provides the following functions on a pouchDB Database:

* create/update - ie PUT
* get
* allDocs - with start_key and end_key
* remove

## usage

Register Service in Container

``` js
var ee = palmetto()
var cfg = config.get('pouchdb')
var pouchDBSvc = require('palmettoflow-pouchdb-svc')
// init service
pouchDBSvc(cfg, ee)
```

Configuration

* COUCHSVR - name or url of database server
* PREFIX - specified prefix of databases
* SECRET - jsonwebtoken secret

Create Document

``` js 
var to = setTimeout(function () {
  console.log('request timed out')
}, 1000)

var ne = newEvent('db', 'put', {
  db: 'tom',
  doc: { _id: '1234-thing', foo: 'bar' }
}, {
  token: 'beep'
})

ee.on(ne.from, function (event) {
  clearTimeout(to)
  // handle response
})

ee.emit('send', ne)

```

Remove Document

``` js
var ne = newEvent('db', 'remove', {
  db: 'tom',
  _id: '1234-thing',
  _rev: '3-caa9467dbcfc3dc6cacd4aaaa550b038'
}, {
  token: 'beep'
})

ee.on(ne.from, function (event) {
  t.ok(true)
  t.end()
})

ee.emit('send', ne)
```

Get Document

``` js
var ne = newEvent('db', 'get', {
  db: 'tom',
  _id: '1234-thing'
}, {
  token: 'beep'
})

ee.on(ne.from, function (event) {
  t.ok(true)
  t.end()
})

ee.emit('send', ne)
```

AllDocs

``` js
var ne = newEvent('db', 'allDocs', {
  db: 'tom',
  start_key: '1234',
  end_key: '1234{}'
}, {
  token: 'foo'
})

ee.on(ne.from, function (event) {
  console.log(event)
  t.end()
})

ee.emit('send', ne)
```

