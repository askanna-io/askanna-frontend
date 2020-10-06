import { SetupContext } from '@vue/composition-api'
import moment from 'moment'

export default function (context: SetupContext) {
  const runTimeHours = function (startTime: string, endTime: string) {
    return moment.duration(moment(endTime).diff(moment(startTime))).asSeconds()
  }

  const ago = function (time: string) {
    return moment(time).fromNow()
  }

  const seconds = function (seconds: string) {
    return moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('HH:mm:s')
  }

  const duratioHumanize = function (startTime: string, endTime: string) {
    const d = moment.duration(moment(endTime).diff(moment(startTime))).asMilliseconds()

    return millisecondsToStr(d)
  }

  const millisecondsToStr = function (milliseconds: number) {
    if (!milliseconds || milliseconds <= 0) return 'less than a second'

    let result = ''
    function numberEnding(n: number) {
      return n > 1 ? 's' : ''
    }

    let temp = Math.floor(milliseconds / 1000)
    const years = Math.floor(temp / 31536000)

    if (years) {
      result = `${years} year${numberEnding(years)}`
    }
    const days = Math.floor((temp %= 31536000) / 86400)
    if (days) {
      result += ` ${days} day${numberEnding(days)}`
    }
    const hours = Math.floor((temp %= 86400) / 3600)
    if (hours) {
      result += ` ${hours} hour${numberEnding(hours)}`
    }
    const minutes = Math.floor((temp %= 3600) / 60)
    if (minutes) {
      result += ` ${minutes} minute${numberEnding(minutes)}`
    }
    const seconds = temp % 60
    if (seconds) {
      result += ` ${seconds} second${numberEnding(seconds)}`
    }

    return result
  }

  return { runTimeHours, ago, seconds, $moment: moment, duratioHumanize }
}
