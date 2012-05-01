var request = require('request'),
    methods = require('./methods'),
    url = require('url'),
    crypto = require('crypto')

var config = require('./config')

exports.createClient = function (options) {
  return new Hunch(options)
}

function Hunch(options) {
  if (!options || !options.app_id || !options.app_secret)
    throw new Error('need app_id & app_secret')
  this.options = options
  this.defaultHeaders = {
    accept: 'application/json'
  }
}

Hunch.prototype = {
  request: function (method, params, cb) {
    if (typeof params == 'function') {
      cb = params
      params = null
    }
    var fullUrl = getUrl(method)
    var form = { app_id: this.options.app_id }
    extend(form, params)
    // generate auth_sig
    form.auth_sig = getAuthSig(form, this.options.app_secret)
    var reqOpts = {
      url: fullUrl,
      method: 'post',
      form: form,
      headers: this.defaultHeaders,
    }
    return request.post(reqOpts, function (err, res, body) {
      if (err) return cb(err)
      if (res.statusCode != 200) {
        var e = new Error('status code: ' + res.statusCode)
        if (body) e.message += '\n' + body + '\n'
        return cb(e)
      }
      try {
        var json = JSON.parse(body)
      } catch (e) {
        return cb(e)
      }
      if (!json.ok) {
        var e = new Error('not ok. error code: ' + json.error_code)
        e.message += '\n' + json.errors.join('\n') + '\n'
        return cb(e)
      }
      return cb(null, json, res)
    })
  }
}
Object.keys(methods).forEach(function (m) {
  Hunch.prototype[m] = function (params, cb) {
    return this.request(m, params, cb)
  }
})

//
// utils
//

var base = 'http://api.hunch.com/api/v1/'
function getUrl(method) {
  return base + methods[method].full + '/'
}

function extend(into) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.forEach(function (arg) {
    Object.keys(arg).forEach(function (k) {
      into[k] = arg[k]
    })
  })
  return into
}

//
// http://hunch.com/developers/v1/resources/samples
//

function urlencode(x) {
  return escape(x).replace('+','%2B').replace('/','%2F').replace('@','%40').replace('%20','+');
}

function getAuthSig(queryDict, APP_SECRET) {
  var keys = [];
  for (var key in queryDict)
      keys.push(key);
  keys.sort();
  var queries = [];
  for (var i in keys)
      queries.push( urlencode(keys[i]) + '=' + urlencode(queryDict[keys[i]]) );
  var data = queries.join('&') + APP_SECRET;
  return crypto.createHash('sha1').update(data).digest('hex')
}

if (require.main === module) {
  var c = exports.createClient(config)
  var r = c.get_recommendations({ topic_ids: 'cat_tech' }, function (err, body, res) {
    if (err) return console.log(err)
    console.log(body)
  })
  // console.log(r.url)
  // console.log(r.body.toString())
}