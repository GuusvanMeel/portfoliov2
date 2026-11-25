import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'
import codeCoverageTask from '@cypress/code-coverage/task'
import { loadEnvConfig } from '@next/env'
import { createClient } from '@supabase/supabase-js'
import { TEST_PROJECT_PREFIX } from './cypress/support/testData'

// Load NEXT_PUBLIC_SUPABASE_* from .env.local locally; in CI they come from the job environment.
loadEnvConfig(process.cwd())

/**
 * Deletes every project whose title starts with TEST_PROJECT_PREFIX.
 * Signs in as the admin test account, so normal row-level security applies.
 */
async function cleanupTestProjects(email: string, password: string): Promise<number> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error('cleanupTestProjects: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  if (!email || !password) {
    throw new Error('cleanupTestProjects: missing TEST_EMAIL or TEST_PASSWORD')
  }

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } })
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    throw new Error(`cleanupTestProjects: sign-in failed: ${signInError.message}`)
  }

  const { data, error } = await supabase
    .from('projects')
    .delete()
    .like('title', `${TEST_PROJECT_PREFIX}%`)
    .select('id')
  await supabase.auth.signOut()

  if (error) {
    throw new Error(`cleanupTestProjects: delete failed: ${error.message}`)
  }
  return data?.length ?? 0
}

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
        cleanupTestProjects() {
          return cleanupTestProjects(config.env.TEST_EMAIL, config.env.TEST_PASSWORD)
        },
        logMetric({ name, ms }) {
          fs.appendFileSync(metricsFile, `| ${name} | ${ms} ms |\n`)
          return null
        },
      })

      return config
    },
  },
})