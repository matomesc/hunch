module.exports = {}

var methods = [
  'get-recommendations',
  'get-results',
  'get-similar-results',
  'flag-result',
  'get-auth-token',
  'get-token-status',
  'get-user',
  'get-friends',
  'get-tastemates',
  'get-recommendees',
  'get-result-topics',
  'get-topics',
  'get-activity',
  'get-preferences',
  'set-preference',
  'delete-preference',
  'get-predictions',
  'get-questions',
  'teach-hunch-about-you',
  'save-result',
  'recommend-result',
  'delete-save',
  'delete-recommendation',
  'batch'
]

methods.forEach(function (m) {
  var m_ = m.split('-').join('_')
  module.exports[m_] = { full: m }
})

if (require.main === module) {
  console.log(module.exports)
}