var test = require('tap').test
var rewire = require('rewire')

var newEvent = require('palmettoflow-event').newEvent

var palmetto = require('palmettoflow-nodejs')
var ee = palmetto()

var svc = rewire('../')

svc.__set__('jwt', {
  verify: function (token, secret, cb) {
    cb(null)
  }
})

svc({ 
  COUCHSVR: 'http://admin:admin@localhost:5984',
  PREFIX: 'db_',
  SECRET: 'foo'
}, ee) 

test('get all 1234', function (t) {
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
})

test('create new couchdb document', function (t) {
  var ne = newEvent('db', 'put', {
    db: 'tom',
    doc: { _id: '1234-thing', foo: 'bar' }
  }, {
    token: 'beep'
  })

  ee.on(ne.from, function (event) {
    t.ok(true)
    t.end()
  })

  ee.emit('send', ne)

})

test('get couchdb document by id', function (t) {
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
})


test('remove couchdb document by id', function (t) {
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
})
