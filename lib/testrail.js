'use strict'

const got = require('got')

const apiPath = 'index.php?/api/v2'

function getAPI (baseUrl, user, token) {
  return got.extend({
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    auth: `${user}:${token}`,
    baseUrl
  })
}

async function getOrAddRun (api, projectId, suiteId) {
  let res
  try {
    res = await api.get(`${apiPath}/get_runs/${projectId}&is_completed=0&suite_id=${suiteId}`)
  } catch (e) {
    throw new Error(e.body.error)
  }
  const { body } = res
  if (Array.isArray(body) && body.length > 0) {
    return body[0].id
  } else {
    const { body } = await api.post(`${apiPath}/add_run/${projectId}`, { body: {
      suite_id: suiteId,
      name: `autotest_${new Date().toJSON().slice(0, 19)}`
    } })
    console.log(body.id)
    return body.id
  }
}

async function updateResults (api, runId, results) {
  try {
    const { body } = await api.post(`${apiPath}/add_results_for_cases/${runId}`, { body: { results } })
    return body
  } catch (e) {
    throw new Error(e.body.error)
  }
}

module.exports = {
  getAPI,
  getOrAddRun,
  updateResults
}
