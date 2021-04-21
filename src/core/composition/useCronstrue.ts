import cronstrue from 'cronstrue'

type CrontFormat = string

export default () => {
  const humanizeCron = (crontFormat: CrontFormat) => {
    return { type: 'cron', value: cronstrue.toString(crontFormat) }
  }

  return { humanizeCron }
}
