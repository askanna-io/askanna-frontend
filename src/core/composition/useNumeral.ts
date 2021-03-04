import numeral from 'numeral'
import { SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const numberFormated = (num: string | number) => {
    const numberFormat = Number(num) % 1 ? '0,0.000' : '0,0'

    return numeral(num).format(numberFormat)
  }

  return { numberFormated }
}
