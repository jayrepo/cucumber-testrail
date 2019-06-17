'use strict'

const fs = require('fs')
const validate = require('./lib/validate')
const getResults = require('./lib/getResults')
const { getAPI, getOrAddRun, updateResults } = require('./lib/testrail')

module.exports = async function postResults (options) {
  validate(options)
  const data = JSON.parse(fs.readFileSync(options.source))
  const results = getResults(data, options.prefix, options.passId, options.failId)
  if (results.length === 0) return
  const api = getAPI(options.url, options.user, options.token)
  const runId = await getOrAddRun(api, options.projectId, options.suiteId)
  return updateResults(api, runId, results)
}
