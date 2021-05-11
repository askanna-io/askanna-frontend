import numeral from 'numeral'
import { SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const numberFormated = (num: string | number) => {
    const decs = countDecimals(Number(num))
    const formats = ['0,0', '0,0.0', '0,0.00', '0,0.000']
    const numberFormat = formats[decs] || '0,0.000'

    return numeral(num).format(numberFormat)
  }

  const countDecimals = (val: number) => {
    if (Math.floor(val) === val) return 0
    return val.toString().split('.')[1].length || 0
  }

  return { numberFormated }
}
