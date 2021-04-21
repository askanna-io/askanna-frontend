import moment from 'moment-timezone'
import { SetupContext } from '@vue/composition-api'

interface MillisecondsToStrParams {
  showSeconds: boolean
}

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

  const millisecondsToStr = function (milliseconds: number, params: MillisecondsToStrParams = { showSeconds: true }) {
    const { showSeconds = true } = params
    if (!milliseconds || milliseconds <= 0) return 'less than a second'

    // check if miliseconds not more then 1 minute
    if (milliseconds <= 60000) return 'within a minute'

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
      result += ` ${days} day${numberEnding(days)},`
    }
    const hours = Math.floor((temp %= 86400) / 3600)
    if (hours) {
      result += ` ${hours} hour${numberEnding(hours)}`
    }
    const minutes = Math.floor((temp %= 3600) / 60)
    if (minutes) {
      const and = hours ? ' and ' : ' '
      result += `${and}${minutes} minute${numberEnding(minutes)}`
    }
    const seconds = temp % 60
    if (seconds && showSeconds) {
      result += ` ${seconds} second${numberEnding(seconds)}`
    }

    return result
  }

  const nextClosestData = (dates: string[]) => {
    const next = dates
      .map(function (s) {
        return moment.utc(s)
      })
      .sort(function (m) {
        return m.valueOf()
      })
      .find(function (m) {
        return m.isAfter()
      })

    if (next) {
      return {
        datatime: next.local().format(' Do MMMM YYYY, h:mm:ss a'),
        fromNow: millisecondsToStr(moment.duration(moment(next).diff(moment())).asMilliseconds(), {
          showSeconds: false
        })
      }
    } else {
      return { nextDatatime: null, fromNow: null }
    }
  }

  return { runTimeHours, ago, seconds, $moment: moment, duratioHumanize, nextClosestData }
}
