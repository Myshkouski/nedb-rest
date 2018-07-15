module.exports = function(options) {
  var server = require('../dist/server')

  var HOST = options.host || 'localhost'
  var PORT = options.port || 27017

  server.listen(PORT, HOST, function() {
    options.log && console.log('Listening on http://' + HOST + ':' + PORT)
  })

  return server
}
