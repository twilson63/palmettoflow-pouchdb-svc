var jwt = require('jsonwebtoken')
var PouchDB = require('pouchdb')
//PouchDB.plugin(require('pouchdb-upsert'))

var _ = require('underscore')

var response = require('palmettoflow-event').response
var responseError = require('palmettoflow-event').responseError


module.exports = function (config, ee) {

  var dbUrl = config.COUCHSVR || 'pouchdb'
  var dbPrefix = config.PREFIX || 'db_'

  var secret = new Buffer(config.JWT_SECRET || 'nosecret', 'base64')

  ee.on('/db/allDocs', function (e) {
    jwt.verify(e.actor.token, secret, function (err, decoded) {
      if (err) { return ee.emit('send', responseError(e, err)) }
      var db = PouchDB([dbUrl, dbPrefix + e.object.db].join('/'))
      db.allDocs({
        start_key: e.object.start_key,
        end_key: e.object.end_key,
        include_docs: true
      }).then(function (result) {
        ee.emit('send', response(e, _(result.rows).pluck('doc')))
      })
      .catch(function (err) {
        ee.emit('send', responseError(e, err))
      })
    })
  })

  ee.on('/db/put', function (e) {
    jwt.verify(e.actor.token, secret, function (err, decoded) {
      if (err) { return ee.emit('send', responseError(e, err)) }
      var db = PouchDB([dbUrl, dbPrefix + e.object.db].join('/'))
      db.put(e.object.doc).then(function (result) {
        ee.emit('send', response(e, result))
      })
      .catch(function (err) {
        ee.emit('send', responseError(e, err))
      })
    })
  })

  ee.on('/db/get', function (e) {
    jwt.verify(e.actor.token, secret, function (err, decoded) {
      if (err) { return responseError('send', err) }
      var db = PouchDB([dbUrl, dbPrefix + e.object.db].join('/'))
      db.get(e.object._id)
        .then(function (result) {
          ee.emit('send', response(e, result))
        })
        .catch(function (err) {
          ee.emit('send', responseError(e, err))
        })
    })
  })

  ee.on('/db/remove', function (e) {
    jwt.verify(e.actor.token, secret, function (err, decoded) {
      if (err) { return ee.emit('send', responseError(e, err)) }
      var db = PouchDB([dbUrl, dbPrefix + e.object.db].join('/'))
      db.remove(e.object._id, e.object._rev)
        .then(function (result) {
          ee.emit('send', response(e, result))
        })
        .catch(function (err) {
          ee.emit('send', responseError(e, err))
        })
    })
  })
}