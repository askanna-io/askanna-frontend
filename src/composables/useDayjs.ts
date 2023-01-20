import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

interface MillisecondsToStrParams {
  showSeconds: boolean
  minuteSeparation: string
  secondSeparation: string
  showLessMinuteText: boolean
}

export default function () {
  const ago = function (time: string) {
    return dayjs(time).fromNow()
  }

  const durationHumanize = function (
    startTime: string,
    endTime: string,
    params: MillisecondsToStrParams = {
      showSeconds: true,
      showLessMinuteText: false,
      minuteSeparation: ', ',
      secondSeparation: ' and '
    }
  ) {
    const d = dayjs
      .duration(dayjs(endTime).diff(dayjs(startTime)))
      .asMilliseconds()

    return millisecondsToStr(d, params)
  }

  const durationHumanizeBySecond = function (
    seconds: string,
    params: MillisecondsToStrParams = {
      showSeconds: true,
      showLessMinuteText: false,
      minuteSeparation: ', ',
      secondSeparation: ' and '
    }
  ) {
    const d = dayjs.duration(seconds, 'seconds').asMilliseconds()

    return millisecondsToStr(d, params)
  }

  const millisecondsToStr = function (
    milliseconds: number,
    params: MillisecondsToStrParams
  ) {
    const {
      showSeconds = true,
      showLessMinuteText = true,
      minuteSeparation = ' and ',
      secondSeparation = ''
    } = params

    if (!milliseconds || milliseconds <= 0) return 'less than a second'

    // check if miliseconds not more then 1 minute
    if (showLessMinuteText && milliseconds <= 60000) return 'within a minute'

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
      const and = hours ? minuteSeparation : ' '
      result += `${and}${minutes} minute${numberEnding(minutes)}`
    }
    const seconds = temp % 60
    if (seconds && showSeconds) {
      const and = minutes ? secondSeparation : ' '
      result += `${and}${seconds} second${numberEnding(seconds)}`
    }

    return result
  }

  const nextClosestData = (dates: string[]) => {
    const next = dates
      .map(function (s) {
        return dayjs.utc(s)
      })
      .sort(function (m) {
        return m.valueOf()
      })
      .find(function (m) {
        return m.isAfter(dayjs())
      })

    if (next) {
      return {
        datatime: next.local().format(' Do MMMM YYYY, h:mm:ss a'),
        fromNow: millisecondsToStr(
          dayjs.duration(dayjs(next).diff(dayjs())).asMilliseconds(),
          {
            showSeconds: false,
            showLessMinuteText: true,
            minuteSeparation: ' and ',
            secondSeparation: ' '
          }
        )
      }
    } else {
      return { nextDatatime: null, fromNow: null }
    }
  }

  const checkIfTimeZoneEq = (timezone: string) => timezone !== dayjs.tz.guess()

  return {
    ago,
    dayjs,
    nextClosestData,
    durationHumanize,
    checkIfTimeZoneEq,
    durationHumanizeBySecond
  }
}
