var should = require('should')
var hunch = require('../hunch')
var methods = require('../methods')
var config = require('../config')

var client = hunch.createClient(config)

describe('methods', function () {
  it('should be exported', function (done) {
    Object.keys(methods).forEach(function (method) {
      method.should.not.include('-')
      should.exist(methods[method].full)
    })
    done()
  })
})

describe("require('hunch')", function () {
  it('should export .createClient()', function (done) {
    should.exist(hunch.createClient)
    done()
  })
})