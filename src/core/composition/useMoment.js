export default function(context) {
  const moment = context.root.$moment

  const runTimeHours = function(startTime, endTime) {
    console.log(moment(startTime, 'YYYY/MM/DD HH:mm'), moment(endTime, 'YYYY/MM/DD HH:mm'))
    return moment.duration(moment(endTime).diff(moment(startTime))).asMinutes()
  }

  return { runTimeHours }
}
