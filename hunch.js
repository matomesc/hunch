var request = require('request')

exports.createClient = function (options) {
  return new Hunch(options)
}

function Hunch(options) {
  this.options = options
}

Hunch.prototype = {
  
}