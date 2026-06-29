import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'
import codeCoverageTask from '@cypress/code-coverage/task'

const metricsDir = 'cypress/results'
const metricsFile = path.join(metricsDir, 'metrics.md')

export default defineConfig({
  allowCypressEnv: true,
  video: true,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)

      fs.mkdirSync(metricsDir, { recursive: true })

      // Reset metrics file at the start of every Cypress run
      fs.writeFileSync(metricsFile, '| Flow | Time |\n|---|---:|\n')

      on('task', {
        logMetric({ name, ms }) {
          fs.appendFileSync(metricsFile, `| ${name} | ${ms} ms |\n`)
          return null
        },
      })

      return config
    },
  },
})