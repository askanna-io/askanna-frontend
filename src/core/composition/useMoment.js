export default function(context) {
  const moment = context.root.$moment

  const runTimeHours = function(startTime, endTime) {
    return moment.duration(moment(endTime).diff(moment(startTime))).asSeconds()
  }

  const ago = function(time) {
    return moment(time).fromNow()
  }

  const seconds = function(seconds) {
    return moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('HH:mm:s')
  }

  return { runTimeHours, ago, seconds }
}