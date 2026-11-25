// Test data for the admin end-to-end tests.
// Every project created by a test MUST start with TEST_PROJECT_PREFIX, so the
// cleanupTestProjects task can remove leftovers (also after a failed run).
export const TEST_PROJECT_PREFIX = 'CYPRESS TEST'

export const testProject = {
  title: `${TEST_PROJECT_PREFIX} PROJECT`,
  description: 'THIS IS A CYPRESS TEST PROJECT. IF YOU SEE THIS ON THE PORTFOLIO, A TEST RUN DID NOT CLEAN UP.',
  tags: 'tag1, tag2, tag 3',
  duration: '2 weeks',
  imageUrl:
    'https://res.cloudinary.com/dnfdgzek3/image/upload/v1776412550/Screenshot_2026-04-17_095441_nalrgu.png',
  githubUrl: 'https://github.com/GuusvanMeel/Next-Episode-WPF',
}

export const editedTestProject = {
  title: `${TEST_PROJECT_PREFIX} PROJECT - edited title`,
  description: 'edited description THIS IS A CYPRESS TEST PROJECT',
  tags: 'edited-tag, tag2, tag 3',
  duration: 'edited duration',
}
