export default function(context) {
  const moment = context.root.$moment

  const runTimeHours = function(startTime, endTime) {
    return moment.duration(moment(endTime).diff(moment(startTime))).asSeconds()
  }

  const ago = function(time) {
    return moment(time).fromNow()
  }

  return { runTimeHours, ago }
}
