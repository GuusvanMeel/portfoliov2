const isCoverage = process.env.CYPRESS_COVERAGE === 'true'

module.exports = {
  presets: ['next/babel'],
  plugins: isCoverage ? ['istanbul'] : [],
}