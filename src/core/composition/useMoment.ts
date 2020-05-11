import { SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const moment = context.root.$moment

  const runTimeHours = function (startTime: string, endTime: string) {
    return moment.duration(moment(endTime).diff(moment(startTime))).asSeconds()
  }

  const ago = function (time: string) {
    return moment(time).fromNow()
  }

  const seconds = function (seconds: string) {
    return moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('HH:mm:s')
  }

  return { runTimeHours, ago, seconds, $moment: moment }
}
