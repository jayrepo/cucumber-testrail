'use strict'

function getResults (data, prefix = '_C', passId = 1, failId = 5) {
  const results = new Map()
  data.forEach(feature => feature.elements.forEach(scenario => {
    const tags = scenario.tags.map(tag => tag.name.slice(1))
      .filter(tag => tag.startsWith(prefix))
      .map(tag => parseInt(tag.slice(2), 10))
    const scenarioResult = { status: 'passed', comment: '' }
    const failedStep = scenario.steps.find(step => step.result.status === 'failed')
    if (failedStep) {
      scenarioResult.status = 'failed'
      scenarioResult.comment = `[${failedStep.keyword}${failedStep.name}]: ${failedStep.result.error_message}\n`
    }
    tags.forEach(tag => {
      if (results.has(tag)) {
        if (scenarioResult.status === 'failed') {
          const prevResult = results.get(tag)
          prevResult.status_id = failId
          prevResult.comment = (prevResult.comment || '') + scenarioResult.comment
        }
      } else {
        results.set(tag, {
          case_id: tag,
          status_id: scenarioResult.status === 'failed' ? failId : passId,
          comment: scenarioResult.comment
        })
      }
    })
  }))
  return [...results.values()]
}
module.exports = getResults
