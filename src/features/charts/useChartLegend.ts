import * as d3 from 'd3'

export default function () {
  const swatches = (
    data,
    {
      format,
      columns = null,
      marginLeft = 0,
      swatchSize = 15,
      unknown: formatUnknown,
      swatchWidth = swatchSize,
      swatchHeight = swatchSize
    } = {}
  ) => {
    const color = d3.scaleOrdinal(data, d3.schemeSet2)
    const id = 'chart-legend'
    const unknown = formatUnknown == null ? undefined : color.unknown()
    const unknowns = unknown == null || unknown === d3.scaleImplicit ? [] : [unknown]
    const domain = color.domain().concat(unknowns)
    if (format === undefined) format = x => (x === unknown ? formatUnknown : x)

    const a = domain.map(value => {
      const label = `${format(value)}`
      return `<div class=${id}-item>
        <div class=${id}-swatch style="background:${color(value)}""></div>
        <div class=${id}-label title=${label}>${label}</div>
      </div>`
    })

    if (columns !== null) {
      return `<div style="display: flex; align-items: center; margin-left: ${+marginLeft}px; min-height: 33px;">
    <style>
  
  .${id}-item {
    break-inside: avoid;
    display: flex;
    align-items: center;
    padding-bottom: 1px;
    display: flex;
    align-items: center;
    padding-right: 18px;
  }
  
  .${id}-label {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - ${+swatchWidth}px - 0.5em);
  }
  
  .${id}-swatch {
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin: 0 0.5em 0 0;
  }
  
    </style>
    <div style= "width: 100%; columns: 200px auto; font-size:14px; max-width: 870px; margin: 0 auto;">${a.join('')}
    </div>
  </div>`
    }
    return `<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 14px sans-serif;">
    <style>
  
  .${id} {
    display: inline-flex;
    align-items: center;
    margin-right: 1em;
  }
  
  .${id}::before {
    content: "";
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin-right: 0.5em;
    background: var(--color);
  }
  
    </style>
    <div>${domain.map(value => `<span class="${id}" style="--color: ${color(value)}">${format(value)}</span>`)}</div>`
  }

  return {
    swatches
  }
}
