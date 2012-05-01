var should = require('should')
var hunch = require('../hunch')

describe("require('hunch')", function () {
  it('should export .createClient()', function (done) {
    should.exist(hunch.createClient)
    done()
  })
})

// describe('Hunch()', function () {
// })