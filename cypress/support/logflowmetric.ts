export function logFlowMetric(name: string, start: number) {
  cy.then(() => {
    const elapsedMs = Math.round(performance.now() - start)

    cy.task('logMetric', {
      name,
      ms: elapsedMs,
    })
  })
}