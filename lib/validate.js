'use strict'

module.exports = function validateOption (options) {
  const requiredKeys = ['source', 'url', 'projectId', 'suiteId', 'user', 'token']
  const missingKeys = requiredKeys.map(key => options[key]).filter(value => !value)
  if (missingKeys.length > 0) throw new Error(`The following option(s) are missing: ${missingKeys.join(', ')}`)
}
