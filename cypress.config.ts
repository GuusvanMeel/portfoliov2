import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  allowCypressEnv: true,
 video: true,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      on('task', {
        logMetric({ name, ms }) {
          const dir = 'cypress/results'
          fs.mkdirSync(dir, { recursive: true })

          const file = path.join(dir, 'metrics.md')

          if (!fs.existsSync(file)) {
            fs.writeFileSync(file, '| Flow | Time |\n|---|---:|\n')
          }

          fs.appendFileSync(file, `| ${name} | ${ms} ms |\n`)
          return null
        },
      })

      return config
    },
  },
})
