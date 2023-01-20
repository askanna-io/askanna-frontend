// notebook.js 0.5.1
// http://github.com/jsvine/notebookjs
// notebook.js may be freely distributed under the MIT license.
import Prism from 'prismjs'
import './prism-tomorrow.css'
import { marked } from 'marked'
import * as DOMPurify from 'dompurify'
import 'prismjs/components/prism-python'
import { default as AnsiUp } from 'ansi_up'
import renderMathInElement from 'https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/contrib/auto-render.mjs'

const ansiUp = new AnsiUp()

var highlighter = function (code, lang) {
  if (typeof lang === 'undefined') lang = 'markup'

  return Prism.languages[lang] ? Prism.highlight(code, Prism.languages[lang]) : code
}

const nb = function () {
  const VERSION = '0.5.1'
  const doc = document

  // Helper functions
  const ident = function (x) {
    return x
  }

  const makeElement = function (tag, classNames) {
    const el = doc.createElement(tag)
    el.className = (classNames || [])
      .map(function (cn) {
        return nb.prefix + cn
      })
      .join(' ')
    return el
  }

  const escapeHTML = raw => raw.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const joinText = text => (text.join ? text.map(joinText).join('') : text)

  const getMarkdown = () => marked
  const getAnsi = () => ansiUp.ansi_to_html
  const getSanitizer = () => DOMPurify && DOMPurify.sanitize

  // Set up `nb` namespace
  const nb = {
    prefix: 'nb-',
    markdown: getMarkdown() || ident,
    sanitizer: getSanitizer(),
    highlighter: ident,
    VERSION: VERSION
  }

  // Inputs
  nb.Input = function (raw, cell) {
    this.raw = raw
    this.cell = cell
  }

  nb.Input.prototype.render = function () {
    if (!this.raw.length) {
      return makeElement('div')
    }
    const holder = makeElement('div', ['input'])
    const cell = this.cell
    if (typeof cell.number === 'number') {
      holder.setAttribute('data-prompt-number', this.cell.number)
    }
    const pre_el = makeElement('pre')
    const code_el = makeElement('code')
    const notebook = cell.worksheet.notebook
    const m = notebook.metadata
    const lang =
      this.cell.raw.language ||
      m.language ||
      (m.kernelspec && m.kernelspec.language) ||
      (m.language_info && m.language_info.name)
    code_el.setAttribute('data-language', lang)
    code_el.className = 'lang-' + lang
    code_el.innerHTML = nb.highlighter(escapeHTML(joinText(this.raw)), pre_el, code_el, lang)
    pre_el.appendChild(code_el)
    holder.appendChild(pre_el)
    this.el = holder

    return holder
  }

  // Outputs and output-renderers
  const imageCreator = function (format) {
    return function (data) {
      const el = makeElement('img', ['image-output'])
      el.src = 'data:image/' + format + ';base64,' + joinText(data).replace(/\n/g, '')

      return el
    }
  }

  nb.display = {}
  nb.display.text = function (text) {
    const el = makeElement('pre', ['text-output'])
    el.innerHTML = escapeHTML(joinText(text))

    return el
  }
  nb.display['text/plain'] = nb.display.text

  nb.display.html = function (html) {
    const el = makeElement('div', ['html-output'])
    el.innerHTML = nb.sanitizer(joinText(html))

    return el
  }
  nb.display['text/html'] = nb.display.html

  nb.display.marked = function (md) {
    return nb.display.html(nb.markdown(joinText(md)))
  }
  nb.display['text/markdown'] = nb.display.marked

  nb.display.svg = function (svg) {
    const el = makeElement('div', ['svg-output'])
    el.innerHTML = joinText(svg)

    return el
  }
  nb.display['text/svg+xml'] = nb.display.svg
  nb.display['image/svg+xml'] = nb.display.svg

  nb.display.latex = function (latex) {
    const el = makeElement('div', ['latex-output'])
    el.innerHTML = joinText(latex)

    return el
  }
  nb.display['text/latex'] = nb.display.latex

  nb.display.javascript = function (js) {
    const el = makeElement('script')
    el.innerHTML = joinText(js)

    return el
  }
  nb.display['application/javascript'] = nb.display.javascript

  nb.display.png = imageCreator('png')
  nb.display['image/png'] = nb.display.png
  nb.display.jpeg = imageCreator('jpeg')
  nb.display['image/jpeg'] = nb.display.jpeg

  nb.display_priority = [
    'png',
    'image/png',
    'jpeg',
    'image/jpeg',
    'svg',
    'image/svg+xml',
    'text/svg+xml',
    'html',
    'text/html',
    'text/markdown',
    'latex',
    'text/latex',
    'javascript',
    'application/javascript',
    'text',
    'text/plain'
  ]

  const render_display_data = function () {
    const o = this
    const formats = nb.display_priority.filter(function (d) {
      return o.raw.data ? o.raw.data[d] : o.raw[d]
    })
    const format = formats[0]
    if (format) {
      if (nb.display[format]) {
        return nb.display[format](o.raw[format] || o.raw.data[format])
      }
    }
    return makeElement('div', ['empty-output'])
  }

  const render_error = function () {
    const el = makeElement('pre', ['pyerr'])
    const raw = this.raw.traceback.join('\n')
    el.innerHTML = nb.highlighter(ansiUp.ansi_to_html(escapeHTML(raw)), el)

    return el
  }

  nb.Output = function (raw, cell) {
    this.raw = raw
    this.cell = cell
    this.type = raw.output_type
  }

  nb.Output.prototype.renderers = {
    display_data: render_display_data,
    execute_result: render_display_data,
    pyout: render_display_data,
    pyerr: render_error,
    error: render_error,
    stream: function () {
      const el = makeElement('pre', [this.raw.stream || this.raw.name])
      const raw = joinText(this.raw.text)
      el.innerHTML = nb.highlighter(ansiUp.ansi_to_html(raw), el)
      return el
    }
  }

  nb.Output.prototype.render = function () {
    const outer = makeElement('div', ['output'])
    if (typeof this.cell.number === 'number') {
      outer.setAttribute('data-prompt-number', this.cell.number)
    }
    const inner = this.renderers[this.type].call(this)
    outer.appendChild(inner)
    this.el = outer
    return outer
  }

  // Post-processing
  nb.coalesceStreams = function (outputs) {
    if (!outputs.length) {
      return outputs
    }
    let last = outputs[0]
    const new_outputs = [last]
    outputs.slice(1).forEach(function (o) {
      if (o.raw.output_type === 'stream' && last.raw.output_type === 'stream' && o.raw.stream === last.raw.stream) {
        last.raw.text = last.raw.text.concat(o.raw.text)
      } else {
        new_outputs.push(o)
        last = o
      }
    })
    return new_outputs
  }

  // Cells
  nb.Cell = function (raw, worksheet) {
    const cell = this
    cell.raw = raw
    cell.worksheet = worksheet
    cell.type = raw.cell_type
    if (cell.type === 'code') {
      cell.number = raw.prompt_number > -1 ? raw.prompt_number : raw.execution_count
      const source = raw.input || [raw.source]
      cell.input = new nb.Input(source, cell)
      const raw_outputs = (cell.raw.outputs || []).map(function (o) {
        return new nb.Output(o, cell)
      })
      cell.outputs = nb.coalesceStreams(raw_outputs)
    }
  }

  nb.Cell.prototype.renderers = {
    markdown: function () {
      const el = makeElement('div', ['cell', 'markdown-cell'])
      el.innerHTML = nb.markdown(joinText(this.raw.source))

      /* Requires to render KaTeX
            'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/contrib/auto-render.min.js',
            */
      if (renderMathInElement) {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$', right: '$', display: false }
          ]
        })
      }

      return el
    },
    heading: function () {
      const el = makeElement('h' + this.raw.level, ['cell', 'heading-cell'])
      el.innerHTML = joinText(this.raw.source)
      return el
    },
    raw: function () {
      const el = makeElement('div', ['cell', 'raw-cell'])
      el.innerHTML = joinText(this.raw.source)
      return el
    },
    code: function () {
      const cell_el = makeElement('div', ['cell', 'code-cell'])
      cell_el.appendChild(this.input.render())
      const output_els = this.outputs.forEach(function (o) {
        cell_el.appendChild(o.render())
      })
      return cell_el
    }
  }

  nb.Cell.prototype.render = function () {
    const el = this.renderers[this.type].call(this)
    this.el = el
    return el
  }

  // Worksheets
  nb.Worksheet = function (raw, notebook) {
    const worksheet = this
    this.raw = raw
    this.notebook = notebook
    this.cells = raw.cells.map(function (c) {
      return new nb.Cell(c, worksheet)
    })
    this.render = function () {
      const worksheet_el = makeElement('div', ['worksheet'])
      worksheet.cells.forEach(function (c) {
        worksheet_el.appendChild(c.render())
      })
      this.el = worksheet_el
      return worksheet_el
    }
  }

  // Notebooks
  nb.Notebook = function (raw, config) {
    const notebook = this
    this.raw = raw
    this.config = config
    const meta = (this.metadata = raw.metadata || {})
    this.title = meta.title || meta.name
    const _worksheets = raw.worksheets || [{ cells: raw.cells }]
    this.worksheets = _worksheets.map(function (ws) {
      return new nb.Worksheet(ws, notebook)
    })
    this.sheet = this.worksheets[0]
  }

  nb.Notebook.prototype.render = function () {
    const notebook_el = makeElement('div', ['notebook'])
    this.worksheets.forEach(function (w) {
      notebook_el.appendChild(w.render())
    })
    this.el = notebook_el
    return notebook_el
  }

  nb.highlighter = function (text, pre, code, lang) {
    var language = lang || 'python'
    pre.className = 'language-' + language
    if (typeof code != 'undefined') {
      code.className = 'language-' + language
    }
    return highlighter(text, language)
  }

  nb.parse = function (nbjson, config) {
    return new nb.Notebook(nbjson, config)
  }

  // Exports
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return nb
    })
  }
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = nb
    }
    exports.nb = nb
  } else {
    return nb
  }
}

export default nb
