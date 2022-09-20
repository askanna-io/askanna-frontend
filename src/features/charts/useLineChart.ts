import * as d3 from 'd3'

const numeral = useNumeral()
const { $moment } = useMoment()

export default function () {
  // Copyright 2021 Observable, Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/line-chart
  const render = (
    data,
    {
      id = 'chart', // id of div when chart render
      x = ([x]) => x, // given d in data, returns the (temporal) x-value
      y = ([, y]) => y, // given d in data, returns the (quantitative) y-value,
      z = () => 1, // given d in data, returns the (categorical) z-value
      title, // given d in data, returns the title text
      defined, // for gaps in data
      curve = d3.curveLinear, // method of interpolation between points
      marginTop = 30, // top margin, in pixels
      marginRight = 30, // right margin, in pixels
      marginBottom = 60, // bottom margin, in pixels
      marginLeft = 40, // left margin, in pixels
      width = 640, // outer width, in pixels
      height = 400, // outer height, in pixels
      xType = d3.scaleUtc, // type of x-scale
      xDomain, // [xmin, xmax]
      xRange = [marginLeft, width - marginRight], // [left, right]
      yType = d3.scaleLinear, // type of y-scale
      yDomain, // [ymin, ymax]
      yRange = [height - marginBottom, marginTop], // [bottom, top]
      strokeWidth = 1.5, // stroke width of line, in pixels
      strokeLinejoin = 'round', // stroke line join of line
      strokeLinecap = 'round', // stroke line cap of line
      strokeOpacity, // stroke opacity of line
      yFormat, // a format specifier string for the y-axis
      xLabel = 'X', // a label for the x-axis
      yLabel = 'Y', // a label for the y-axis
      zDomain,
      mixBlendMode = 'multiply', // blend mode of lines
      xTitle = 'X',
      yTitle = 'Y',
      colors = d3.schemeSet2 // array of categorical colors
    } = {}
  ) => {
    // Compute values.
    const X = d3.map(data, x)
    const Y = d3.map(data, y)
    const Z = d3.map(data, z)
    const O = d3.map(data, d => d)

    // Compute which data points are considered defined.
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i])
    const D = d3.map(data, defined)

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X)
    if (yDomain === undefined) yDomain = [0, d3.max(Y)]

    if (zDomain === undefined) zDomain = Z
    zDomain = new d3.InternSet(zDomain)

    // Omit any data not present in the z-domain.
    const I = d3.range(X.length).filter(i => zDomain.has(Z[i]))

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange)
    const yScale = yType(yDomain, yRange)

    const color = d3.scaleOrdinal(zDomain, colors)

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 80)
      .tickSizeOuter(0)

    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat) // was 40

    // Compute titles.
    if (title === undefined) {
      title = i => {
        let xVal = X[i]
        let label = `${xTitle}: ${xVal}\n${yTitle}: ${numeral.numberFormated(Y[i])}`

        if (xTitle.includes('time')) {
          xVal = $moment(xVal).format('Do MMMM YYYY, h:mm:ss a')
          label = `${xVal}\n${yTitle}: ${numeral.numberFormated(Y[i])}`
        }

        if (Z.filter(item => item).length) {
          label = label + `\n${'Series'}: ${Z[i]}`
        }
        return label
      }
    } else {
      const O = d3.map(data, d => d)
      const T = title
      title = i => T(O[i], i, data)
    }

    // Construct a line generator.
    const line = d3
      .line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]))

    const svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic; padding: 0 4px;')
      .attr('font-family', 'sans-serif')
      .style('font-size', '14px')
      .style('-webkit-tap-highlight-color', 'transparent')
      .style('overflow', 'visible')
      .on('pointerenter', pointerentered)
      .on('pointermove', pointermoved)
      .on('pointerleave', pointerleft)
      .on('touchstart', event => event.preventDefault())

    // render x axis
    svg
      .append('g')
      .style('font-size', '14px')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(xAxis)

    svg
      .append('g')
      .style('font-size', '14px')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick line')
          .attr('fill', 'currentColor')
          .attr('stroke-opacity', 0.1)
          .clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1)
          .style('font-size', '14px')
          .attr('fill', 'currentColor')
      )
      .call(g =>
        g
          .append('text')
          .attr('x', width - xLabel.length - 108)
          .attr('y', height - 20)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(xLabel)
          .style('font-size', '14px')
      )
      .call(g =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 20)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(yLabel)
          .style('font-size', '14px')
      )

    // render data in line chart
    const groupedData = d3.group(I, i => Z[i])
    const groupedArray = Array.from(groupedData.values())
    const strW = groupedArray.some(item => item.length > 5) ? strokeWidth : 5
    const path = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', typeof color === 'string' ? color : null)
      .attr('stroke-linecap', strokeLinecap)
      .attr('stroke-linejoin', strokeLinejoin)
      .attr('stroke-width', strW)
      .attr('stroke-opacity', strokeOpacity)
      .selectAll('path')
      .data(groupedData)
      .join('path')
      .style('mix-blend-mode', mixBlendMode)
      .attr('stroke', typeof color === 'function' ? ([z]) => color(z) : null)
      .attr('d', ([, I]) => line(I))

    const tooltip = svg.append('g').style('pointer-events', 'none')

    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event)
      const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)) // closest point
      tooltip.style('display', null)
      tooltip.attr('transform', `translate(${xScale(X[i])},${yScale(Y[i])})`)

      path
        .style('stroke', ([z]) => (Z[i] === z ? null : '#ddd'))
        .filter(([z]) => Z[i] === z)
        .raise()

      const tooltipPath = tooltip.selectAll('path').data([,]).join('path').attr('fill', 'white').attr('stroke', 'black')

      const text = tooltip
        .selectAll('text')
        .data([,])
        .join('text')
        .call(text =>
          text
            .selectAll('tspan')
            .data(`${title(i)}`.split(/\n/))
            .join('tspan')
            .attr('x', 0)
            .attr('y', (_, i) => `${i * 1.1}em`)
            // .attr('font-weight', (_, i) => (i ? null : 'bold'))
            .style('font-size', '14px')
            .text(d => d)
        )

      const { x, y, width: w, height: h } = text.node().getBBox()
      text.attr('transform', `translate(${-w / 2},${15 - y})`)
      tooltipPath.attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`)
      svg.property('value', O[i]).dispatch('input', { bubbles: true })
    }

    function pointerentered() {
      path.style('mix-blend-mode', null).style('stroke', '#ddd')
    }

    function pointerleft() {
      path.style('mix-blend-mode', 'multiply').style('stroke', null)
      svg.node().value = null
      svg.dispatch('input', { bubbles: true })
      tooltip.style('display', 'none')
    }

    return svg.node()
  }

  const clean = id => d3.selectAll(`#${id} > *`).remove()

  return { render, clean }
}
