<template>
  <AskAnnaRow align="center" justify="center">
    <AskAnnaCol cols="12" :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
      <AskAnnaCard class="AskAnna--notebook" flat v-html="notebookHtml" />
    </AskAnnaCol>
  </AskAnnaRow>
</template>

<script setup lang="ts">
// @ts-expect-error
import Nb from '@/composables/notebook/notebook.js'

const props = defineProps({
  fileSource: {
    type: [Blob, String, Object],
    default: () => ''
  }
})

const nb = Nb()

const notebookHtml = computed(() => {
  if (!props.fileSource) return

  let data = props.fileSource
  if (data && typeof data === 'string') {
    data = JSON.parse(data)
  }

  const notebook = nb.parse(data)
  const rendered = notebook.render()

  return rendered.outerHTML
})
</script>

<style lang="scss">
.mobile-view {
  .AskAnna--notebook {
    width: 100%;
    overflow-x: scroll;
  }
  .nb-notebook {
    width: auto;
    padding-left: 100px;
    padding-right: 10px;
  }
}

.AskAnna--notebook pre {
  border-radius: 4px;
}

.AskAnna--notebook .nb-notebook code[class*='language-'],
.AskAnna--notebook .nb-notebook pre[class*='language-'] {
  font-size: 14px;
}

.AskAnna--notebook pre code {
  background-color: unset;
  padding-left: 0;
}
.nb-notebook {
  padding-left: 106px;
  padding-right: 106px;

  line-height: 1.5;
}

.nb-notebook pre {
  white-space: pre-wrap;
}

.nb-stdout,
.nb-stderr {
  white-space: pre-wrap;
  margin: 1em 0;
  padding: 0.1em 0.5em;
}

.nb-stderr {
  background-color: #faa;
}

.nb-cell + .nb-cell {
  margin-top: 0.5em;
}

.nb-output table {
  border: 1px solid #000;
  border-collapse: collapse;
}

.nb-output th {
  font-weight: bold;
  background: #f5f5f5;
  padding: 6px 12px;
}

.nb-output thead th {
  text-align: left !important;
}

.nb-output td {
  white-space: pre;
  border: 1px solid #000;
  padding: 12px;
  text-align: left;
  vertical-align: middle;
  border-collapse: collapse;
}

.nb-cell {
  position: relative;
}

.nb-raw-cell {
  white-space: pre-wrap;
  background-color: #f5f2f0;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  padding: 1em;
  margin: 0.5em 0;
}

.nb-output {
  min-height: 1em;
  width: 100%;
  overflow-x: scroll;
}

.nb-output img {
  max-width: 100%;
}

.nb-output:before,
.nb-input:before {
  position: absolute;
  font-family: monospace;
  color: #999;
  left: -7.5em;
  width: 7em;
  text-align: right;
}

.nb-input:before {
  content: 'In [' attr(data-prompt-number) ']:';
}
.nb-output:before {
  content: 'Out [' attr(data-prompt-number) ']:';
}

.nb-notebook div[style='max-height:1000px;max-width:1500px;overflow:auto;'] {
  max-height: none !important;
}

.katex {
  font: normal 1.21em KaTeX_Main, Times New Roman, serif;
  line-height: 1.2;
  text-indent: 0;
  text-rendering: auto;
  border-color: currentColor;
}
.katex * {
  -ms-high-contrast-adjust: none !important;
}
.katex .katex-version:after {
  content: '0.12.0';
}
.katex .katex-mathml {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
.katex .katex-html > .newline {
  display: block;
}
.katex .base {
  position: relative;
  white-space: nowrap;
  width: min-content;
}
.katex .base,
.katex .strut {
  display: inline-block;
}
.katex .textbf {
  font-weight: 700;
}
.katex .textit {
  font-style: italic;
}
.katex .textrm {
  font-family: KaTeX_Main;
}
.katex .textsf {
  font-family: KaTeX_SansSerif;
}
.katex .texttt {
  font-family: KaTeX_Typewriter;
}
.katex .mathnormal {
  font-family: KaTeX_Math;
  font-style: italic;
}
.katex .mathit {
  font-family: KaTeX_Main;
  font-style: italic;
}
.katex .mathrm {
  font-style: normal;
}
.katex .mathbf {
  font-family: KaTeX_Main;
  font-weight: 700;
}
.katex .boldsymbol {
  font-family: KaTeX_Math;
  font-weight: 700;
  font-style: italic;
}
.katex .amsrm,
.katex .mathbb,
.katex .textbb {
  font-family: KaTeX_AMS;
}
.katex .mathcal {
  font-family: KaTeX_Caligraphic;
}
.katex .mathfrak,
.katex .textfrak {
  font-family: KaTeX_Fraktur;
}
.katex .mathtt {
  font-family: KaTeX_Typewriter;
}
.katex .mathscr,
.katex .textscr {
  font-family: KaTeX_Script;
}
.katex .mathsf,
.katex .textsf {
  font-family: KaTeX_SansSerif;
}
.katex .mathboldsf,
.katex .textboldsf {
  font-family: KaTeX_SansSerif;
  font-weight: 700;
}
.katex .mathitsf,
.katex .textitsf {
  font-family: KaTeX_SansSerif;
  font-style: italic;
}
.katex .mainrm {
  font-family: KaTeX_Main;
  font-style: normal;
}
.katex .vlist-t {
  display: inline-table;
  table-layout: fixed;
  border-collapse: collapse;
}
.katex .vlist-r {
  display: table-row;
}
.katex .vlist {
  display: table-cell;
  vertical-align: bottom;
  position: relative;
}
.katex .vlist > span {
  display: block;
  height: 0;
  position: relative;
}
.katex .vlist > span > span {
  display: inline-block;
}
.katex .vlist > span > .pstrut {
  overflow: hidden;
  width: 0;
}
.katex .vlist-t2 {
  margin-right: -2px;
}
.katex .vlist-s {
  display: table-cell;
  vertical-align: bottom;
  font-size: 1px;
  width: 2px;
  min-width: 2px;
}
.katex .vbox {
  -ms-flex-direction: column;
  flex-direction: column;
  align-items: baseline;
}
.katex .hbox,
.katex .vbox {
  display: -ms-inline-flexbox;
  display: inline-flex;
}
.katex .hbox {
  -ms-flex-direction: row;
  flex-direction: row;
  width: 100%;
}
.katex .thinbox {
  display: inline-flex;
  flex-direction: row;
  width: 0;
  max-width: 0;
}
.katex .msupsub {
  text-align: left;
}
.katex .mfrac > span > span {
  text-align: center;
}
.katex .mfrac .frac-line {
  display: inline-block;
  width: 100%;
  border-bottom-style: solid;
}
.katex .hdashline,
.katex .hline,
.katex .mfrac .frac-line,
.katex .overline .overline-line,
.katex .rule,
.katex .underline .underline-line {
  min-height: 1px;
}
.katex .mspace {
  display: inline-block;
}
.katex .clap,
.katex .llap,
.katex .rlap {
  width: 0;
  position: relative;
}
.katex .clap > .inner,
.katex .llap > .inner,
.katex .rlap > .inner {
  position: absolute;
}
.katex .clap > .fix,
.katex .llap > .fix,
.katex .rlap > .fix {
  display: inline-block;
}
.katex .llap > .inner {
  right: 0;
}
.katex .clap > .inner,
.katex .rlap > .inner {
  left: 0;
}
.katex .clap > .inner > span {
  margin-left: -50%;
  margin-right: 50%;
}
.katex .rule {
  display: inline-block;
  border: 0 solid;
  position: relative;
}
.katex .hline,
.katex .overline .overline-line,
.katex .underline .underline-line {
  display: inline-block;
  width: 100%;
  border-bottom-style: solid;
}
.katex .hdashline {
  display: inline-block;
  width: 100%;
  border-bottom-style: dashed;
}
.katex .sqrt > .root {
  margin-left: 0.27777778em;
  margin-right: -0.55555556em;
}
.katex .fontsize-ensurer.reset-size1.size1,
.katex .sizing.reset-size1.size1 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size1.size2,
.katex .sizing.reset-size1.size2 {
  font-size: 1.2em;
}
.katex .fontsize-ensurer.reset-size1.size3,
.katex .sizing.reset-size1.size3 {
  font-size: 1.4em;
}
.katex .fontsize-ensurer.reset-size1.size4,
.katex .sizing.reset-size1.size4 {
  font-size: 1.6em;
}
.katex .fontsize-ensurer.reset-size1.size5,
.katex .sizing.reset-size1.size5 {
  font-size: 1.8em;
}
.katex .fontsize-ensurer.reset-size1.size6,
.katex .sizing.reset-size1.size6 {
  font-size: 2em;
}
.katex .fontsize-ensurer.reset-size1.size7,
.katex .sizing.reset-size1.size7 {
  font-size: 2.4em;
}
.katex .fontsize-ensurer.reset-size1.size8,
.katex .sizing.reset-size1.size8 {
  font-size: 2.88em;
}
.katex .fontsize-ensurer.reset-size1.size9,
.katex .sizing.reset-size1.size9 {
  font-size: 3.456em;
}
.katex .fontsize-ensurer.reset-size1.size10,
.katex .sizing.reset-size1.size10 {
  font-size: 4.148em;
}
.katex .fontsize-ensurer.reset-size1.size11,
.katex .sizing.reset-size1.size11 {
  font-size: 4.976em;
}
.katex .fontsize-ensurer.reset-size2.size1,
.katex .sizing.reset-size2.size1 {
  font-size: 0.83333333em;
}
.katex .fontsize-ensurer.reset-size2.size2,
.katex .sizing.reset-size2.size2 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size2.size3,
.katex .sizing.reset-size2.size3 {
  font-size: 1.16666667em;
}
.katex .fontsize-ensurer.reset-size2.size4,
.katex .sizing.reset-size2.size4 {
  font-size: 1.33333333em;
}
.katex .fontsize-ensurer.reset-size2.size5,
.katex .sizing.reset-size2.size5 {
  font-size: 1.5em;
}
.katex .fontsize-ensurer.reset-size2.size6,
.katex .sizing.reset-size2.size6 {
  font-size: 1.66666667em;
}
.katex .fontsize-ensurer.reset-size2.size7,
.katex .sizing.reset-size2.size7 {
  font-size: 2em;
}
.katex .fontsize-ensurer.reset-size2.size8,
.katex .sizing.reset-size2.size8 {
  font-size: 2.4em;
}
.katex .fontsize-ensurer.reset-size2.size9,
.katex .sizing.reset-size2.size9 {
  font-size: 2.88em;
}
.katex .fontsize-ensurer.reset-size2.size10,
.katex .sizing.reset-size2.size10 {
  font-size: 3.45666667em;
}
.katex .fontsize-ensurer.reset-size2.size11,
.katex .sizing.reset-size2.size11 {
  font-size: 4.14666667em;
}
.katex .fontsize-ensurer.reset-size3.size1,
.katex .sizing.reset-size3.size1 {
  font-size: 0.71428571em;
}
.katex .fontsize-ensurer.reset-size3.size2,
.katex .sizing.reset-size3.size2 {
  font-size: 0.85714286em;
}
.katex .fontsize-ensurer.reset-size3.size3,
.katex .sizing.reset-size3.size3 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size3.size4,
.katex .sizing.reset-size3.size4 {
  font-size: 1.14285714em;
}
.katex .fontsize-ensurer.reset-size3.size5,
.katex .sizing.reset-size3.size5 {
  font-size: 1.28571429em;
}
.katex .fontsize-ensurer.reset-size3.size6,
.katex .sizing.reset-size3.size6 {
  font-size: 1.42857143em;
}
.katex .fontsize-ensurer.reset-size3.size7,
.katex .sizing.reset-size3.size7 {
  font-size: 1.71428571em;
}
.katex .fontsize-ensurer.reset-size3.size8,
.katex .sizing.reset-size3.size8 {
  font-size: 2.05714286em;
}
.katex .fontsize-ensurer.reset-size3.size9,
.katex .sizing.reset-size3.size9 {
  font-size: 2.46857143em;
}
.katex .fontsize-ensurer.reset-size3.size10,
.katex .sizing.reset-size3.size10 {
  font-size: 2.96285714em;
}
.katex .fontsize-ensurer.reset-size3.size11,
.katex .sizing.reset-size3.size11 {
  font-size: 3.55428571em;
}
.katex .fontsize-ensurer.reset-size4.size1,
.katex .sizing.reset-size4.size1 {
  font-size: 0.625em;
}
.katex .fontsize-ensurer.reset-size4.size2,
.katex .sizing.reset-size4.size2 {
  font-size: 0.75em;
}
.katex .fontsize-ensurer.reset-size4.size3,
.katex .sizing.reset-size4.size3 {
  font-size: 0.875em;
}
.katex .fontsize-ensurer.reset-size4.size4,
.katex .sizing.reset-size4.size4 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size4.size5,
.katex .sizing.reset-size4.size5 {
  font-size: 1.125em;
}
.katex .fontsize-ensurer.reset-size4.size6,
.katex .sizing.reset-size4.size6 {
  font-size: 1.25em;
}
.katex .fontsize-ensurer.reset-size4.size7,
.katex .sizing.reset-size4.size7 {
  font-size: 1.5em;
}
.katex .fontsize-ensurer.reset-size4.size8,
.katex .sizing.reset-size4.size8 {
  font-size: 1.8em;
}
.katex .fontsize-ensurer.reset-size4.size9,
.katex .sizing.reset-size4.size9 {
  font-size: 2.16em;
}
.katex .fontsize-ensurer.reset-size4.size10,
.katex .sizing.reset-size4.size10 {
  font-size: 2.5925em;
}
.katex .fontsize-ensurer.reset-size4.size11,
.katex .sizing.reset-size4.size11 {
  font-size: 3.11em;
}
.katex .fontsize-ensurer.reset-size5.size1,
.katex .sizing.reset-size5.size1 {
  font-size: 0.55555556em;
}
.katex .fontsize-ensurer.reset-size5.size2,
.katex .sizing.reset-size5.size2 {
  font-size: 0.66666667em;
}
.katex .fontsize-ensurer.reset-size5.size3,
.katex .sizing.reset-size5.size3 {
  font-size: 0.77777778em;
}
.katex .fontsize-ensurer.reset-size5.size4,
.katex .sizing.reset-size5.size4 {
  font-size: 0.88888889em;
}
.katex .fontsize-ensurer.reset-size5.size5,
.katex .sizing.reset-size5.size5 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size5.size6,
.katex .sizing.reset-size5.size6 {
  font-size: 1.11111111em;
}
.katex .fontsize-ensurer.reset-size5.size7,
.katex .sizing.reset-size5.size7 {
  font-size: 1.33333333em;
}
.katex .fontsize-ensurer.reset-size5.size8,
.katex .sizing.reset-size5.size8 {
  font-size: 1.6em;
}
.katex .fontsize-ensurer.reset-size5.size9,
.katex .sizing.reset-size5.size9 {
  font-size: 1.92em;
}
.katex .fontsize-ensurer.reset-size5.size10,
.katex .sizing.reset-size5.size10 {
  font-size: 2.30444444em;
}
.katex .fontsize-ensurer.reset-size5.size11,
.katex .sizing.reset-size5.size11 {
  font-size: 2.76444444em;
}
.katex .fontsize-ensurer.reset-size6.size1,
.katex .sizing.reset-size6.size1 {
  font-size: 0.5em;
}
.katex .fontsize-ensurer.reset-size6.size2,
.katex .sizing.reset-size6.size2 {
  font-size: 0.6em;
}
.katex .fontsize-ensurer.reset-size6.size3,
.katex .sizing.reset-size6.size3 {
  font-size: 0.7em;
}
.katex .fontsize-ensurer.reset-size6.size4,
.katex .sizing.reset-size6.size4 {
  font-size: 0.8em;
}
.katex .fontsize-ensurer.reset-size6.size5,
.katex .sizing.reset-size6.size5 {
  font-size: 0.9em;
}
.katex .fontsize-ensurer.reset-size6.size6,
.katex .sizing.reset-size6.size6 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size6.size7,
.katex .sizing.reset-size6.size7 {
  font-size: 1.2em;
}
.katex .fontsize-ensurer.reset-size6.size8,
.katex .sizing.reset-size6.size8 {
  font-size: 1.44em;
}
.katex .fontsize-ensurer.reset-size6.size9,
.katex .sizing.reset-size6.size9 {
  font-size: 1.728em;
}
.katex .fontsize-ensurer.reset-size6.size10,
.katex .sizing.reset-size6.size10 {
  font-size: 2.074em;
}
.katex .fontsize-ensurer.reset-size6.size11,
.katex .sizing.reset-size6.size11 {
  font-size: 2.488em;
}
.katex .fontsize-ensurer.reset-size7.size1,
.katex .sizing.reset-size7.size1 {
  font-size: 0.41666667em;
}
.katex .fontsize-ensurer.reset-size7.size2,
.katex .sizing.reset-size7.size2 {
  font-size: 0.5em;
}
.katex .fontsize-ensurer.reset-size7.size3,
.katex .sizing.reset-size7.size3 {
  font-size: 0.58333333em;
}
.katex .fontsize-ensurer.reset-size7.size4,
.katex .sizing.reset-size7.size4 {
  font-size: 0.66666667em;
}
.katex .fontsize-ensurer.reset-size7.size5,
.katex .sizing.reset-size7.size5 {
  font-size: 0.75em;
}
.katex .fontsize-ensurer.reset-size7.size6,
.katex .sizing.reset-size7.size6 {
  font-size: 0.83333333em;
}
.katex .fontsize-ensurer.reset-size7.size7,
.katex .sizing.reset-size7.size7 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size7.size8,
.katex .sizing.reset-size7.size8 {
  font-size: 1.2em;
}
.katex .fontsize-ensurer.reset-size7.size9,
.katex .sizing.reset-size7.size9 {
  font-size: 1.44em;
}
.katex .fontsize-ensurer.reset-size7.size10,
.katex .sizing.reset-size7.size10 {
  font-size: 1.72833333em;
}
.katex .fontsize-ensurer.reset-size7.size11,
.katex .sizing.reset-size7.size11 {
  font-size: 2.07333333em;
}
.katex .fontsize-ensurer.reset-size8.size1,
.katex .sizing.reset-size8.size1 {
  font-size: 0.34722222em;
}
.katex .fontsize-ensurer.reset-size8.size2,
.katex .sizing.reset-size8.size2 {
  font-size: 0.41666667em;
}
.katex .fontsize-ensurer.reset-size8.size3,
.katex .sizing.reset-size8.size3 {
  font-size: 0.48611111em;
}
.katex .fontsize-ensurer.reset-size8.size4,
.katex .sizing.reset-size8.size4 {
  font-size: 0.55555556em;
}
.katex .fontsize-ensurer.reset-size8.size5,
.katex .sizing.reset-size8.size5 {
  font-size: 0.625em;
}
.katex .fontsize-ensurer.reset-size8.size6,
.katex .sizing.reset-size8.size6 {
  font-size: 0.69444444em;
}
.katex .fontsize-ensurer.reset-size8.size7,
.katex .sizing.reset-size8.size7 {
  font-size: 0.83333333em;
}
.katex .fontsize-ensurer.reset-size8.size8,
.katex .sizing.reset-size8.size8 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size8.size9,
.katex .sizing.reset-size8.size9 {
  font-size: 1.2em;
}
.katex .fontsize-ensurer.reset-size8.size10,
.katex .sizing.reset-size8.size10 {
  font-size: 1.44027778em;
}
.katex .fontsize-ensurer.reset-size8.size11,
.katex .sizing.reset-size8.size11 {
  font-size: 1.72777778em;
}
.katex .fontsize-ensurer.reset-size9.size1,
.katex .sizing.reset-size9.size1 {
  font-size: 0.28935185em;
}
.katex .fontsize-ensurer.reset-size9.size2,
.katex .sizing.reset-size9.size2 {
  font-size: 0.34722222em;
}
.katex .fontsize-ensurer.reset-size9.size3,
.katex .sizing.reset-size9.size3 {
  font-size: 0.40509259em;
}
.katex .fontsize-ensurer.reset-size9.size4,
.katex .sizing.reset-size9.size4 {
  font-size: 0.46296296em;
}
.katex .fontsize-ensurer.reset-size9.size5,
.katex .sizing.reset-size9.size5 {
  font-size: 0.52083333em;
}
.katex .fontsize-ensurer.reset-size9.size6,
.katex .sizing.reset-size9.size6 {
  font-size: 0.5787037em;
}
.katex .fontsize-ensurer.reset-size9.size7,
.katex .sizing.reset-size9.size7 {
  font-size: 0.69444444em;
}
.katex .fontsize-ensurer.reset-size9.size8,
.katex .sizing.reset-size9.size8 {
  font-size: 0.83333333em;
}
.katex .fontsize-ensurer.reset-size9.size9,
.katex .sizing.reset-size9.size9 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size9.size10,
.katex .sizing.reset-size9.size10 {
  font-size: 1.20023148em;
}
.katex .fontsize-ensurer.reset-size9.size11,
.katex .sizing.reset-size9.size11 {
  font-size: 1.43981481em;
}
.katex .fontsize-ensurer.reset-size10.size1,
.katex .sizing.reset-size10.size1 {
  font-size: 0.24108004em;
}
.katex .fontsize-ensurer.reset-size10.size2,
.katex .sizing.reset-size10.size2 {
  font-size: 0.28929605em;
}
.katex .fontsize-ensurer.reset-size10.size3,
.katex .sizing.reset-size10.size3 {
  font-size: 0.33751205em;
}
.katex .fontsize-ensurer.reset-size10.size4,
.katex .sizing.reset-size10.size4 {
  font-size: 0.38572806em;
}
.katex .fontsize-ensurer.reset-size10.size5,
.katex .sizing.reset-size10.size5 {
  font-size: 0.43394407em;
}
.katex .fontsize-ensurer.reset-size10.size6,
.katex .sizing.reset-size10.size6 {
  font-size: 0.48216008em;
}
.katex .fontsize-ensurer.reset-size10.size7,
.katex .sizing.reset-size10.size7 {
  font-size: 0.57859209em;
}
.katex .fontsize-ensurer.reset-size10.size8,
.katex .sizing.reset-size10.size8 {
  font-size: 0.69431051em;
}
.katex .fontsize-ensurer.reset-size10.size9,
.katex .sizing.reset-size10.size9 {
  font-size: 0.83317261em;
}
.katex .fontsize-ensurer.reset-size10.size10,
.katex .sizing.reset-size10.size10 {
  font-size: 1em;
}
.katex .fontsize-ensurer.reset-size10.size11,
.katex .sizing.reset-size10.size11 {
  font-size: 1.19961427em;
}
.katex .fontsize-ensurer.reset-size11.size1,
.katex .sizing.reset-size11.size1 {
  font-size: 0.20096463em;
}
.katex .fontsize-ensurer.reset-size11.size2,
.katex .sizing.reset-size11.size2 {
  font-size: 0.24115756em;
}
.katex .fontsize-ensurer.reset-size11.size3,
.katex .sizing.reset-size11.size3 {
  font-size: 0.28135048em;
}
.katex .fontsize-ensurer.reset-size11.size4,
.katex .sizing.reset-size11.size4 {
  font-size: 0.32154341em;
}
.katex .fontsize-ensurer.reset-size11.size5,
.katex .sizing.reset-size11.size5 {
  font-size: 0.36173633em;
}
.katex .fontsize-ensurer.reset-size11.size6,
.katex .sizing.reset-size11.size6 {
  font-size: 0.40192926em;
}
.katex .fontsize-ensurer.reset-size11.size7,
.katex .sizing.reset-size11.size7 {
  font-size: 0.48231511em;
}
.katex .fontsize-ensurer.reset-size11.size8,
.katex .sizing.reset-size11.size8 {
  font-size: 0.57877814em;
}
.katex .fontsize-ensurer.reset-size11.size9,
.katex .sizing.reset-size11.size9 {
  font-size: 0.69453376em;
}
.katex .fontsize-ensurer.reset-size11.size10,
.katex .sizing.reset-size11.size10 {
  font-size: 0.83360129em;
}
.katex .fontsize-ensurer.reset-size11.size11,
.katex .sizing.reset-size11.size11 {
  font-size: 1em;
}
.katex .delimsizing.size1 {
  font-family: KaTeX_Size1;
}
.katex .delimsizing.size2 {
  font-family: KaTeX_Size2;
}
.katex .delimsizing.size3 {
  font-family: KaTeX_Size3;
}
.katex .delimsizing.size4 {
  font-family: KaTeX_Size4;
}
.katex .delimsizing.mult .delim-size1 > span {
  font-family: KaTeX_Size1;
}
.katex .delimsizing.mult .delim-size4 > span {
  font-family: KaTeX_Size4;
}
.katex .nulldelimiter {
  display: inline-block;
  width: 0.12em;
}
.katex .delimcenter,
.katex .op-symbol {
  position: relative;
}
.katex .op-symbol.small-op {
  font-family: KaTeX_Size1;
}
.katex .op-symbol.large-op {
  font-family: KaTeX_Size2;
}
.katex .op-limits > .vlist-t {
  text-align: center;
}
.katex .accent > .vlist-t {
  text-align: center;
}
.katex .accent .accent-body {
  position: relative;
}
.katex .accent .accent-body:not(.accent-full) {
  width: 0;
}
.katex .overlay {
  display: block;
}
.katex .mtable .vertical-separator {
  display: inline-block;
  min-width: 1px;
}
.katex .mtable .arraycolsep {
  display: inline-block;
}
.katex .mtable .col-align-c > .vlist-t {
  text-align: center;
}
.katex .mtable .col-align-l > .vlist-t {
  text-align: left;
}
.katex .mtable .col-align-r > .vlist-t {
  text-align: right;
}
.katex .svg-align {
  text-align: left;
}
.katex svg {
  display: block;
  position: absolute;
  width: 100%;
  height: inherit;
  fill: currentColor;
  stroke: currentColor;
  fill-rule: nonzero;
  fill-opacity: 1;
  stroke-width: 1;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-miterlimit: 4;
  stroke-dasharray: none;
  stroke-dashoffset: 0;
  stroke-opacity: 1;
}
.katex svg path {
  stroke: none;
}
.katex img {
  border-style: none;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
}
.katex .stretchy {
  width: 100%;
  display: block;
  position: relative;
  overflow: hidden;
}
.katex .stretchy:after,
.katex .stretchy:before {
  content: '';
}
.katex .hide-tail {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.katex .halfarrow-left {
  position: absolute;
  left: 0;
  width: 50.2%;
  overflow: hidden;
}
.katex .halfarrow-right {
  position: absolute;
  right: 0;
  width: 50.2%;
  overflow: hidden;
}
.katex .brace-left {
  position: absolute;
  left: 0;
  width: 25.1%;
  overflow: hidden;
}
.katex .brace-center {
  position: absolute;
  left: 25%;
  width: 50%;
  overflow: hidden;
}
.katex .brace-right {
  position: absolute;
  right: 0;
  width: 25.1%;
  overflow: hidden;
}
.katex .x-arrow-pad {
  padding: 0 0.5em;
}
.katex .mover,
.katex .munder,
.katex .x-arrow {
  text-align: center;
}
.katex .boxpad {
  padding: 0 0.3em;
}
.katex .fbox,
.katex .fcolorbox {
  box-sizing: border-box;
  border: 0.04em solid;
}
.katex .cancel-pad {
  padding: 0 0.2em;
}
.katex .cancel-lap {
  margin-left: -0.2em;
  margin-right: -0.2em;
}
.katex .sout {
  border-bottom-style: solid;
  border-bottom-width: 0.08em;
}
.katex-display {
  display: block;
  margin: 1em 0;
  text-align: center;
}
.katex-display > .katex {
  display: block;
  text-align: center;
  white-space: nowrap;
}
.katex-display > .katex > .katex-html {
  display: block;
  position: relative;
}
.katex-display > .katex > .katex-html > .tag {
  position: absolute;
  right: 0;
}
.katex-display.leqno > .katex > .katex-html > .tag {
  left: 0;
  right: auto;
}
.katex-display.fleqn > .katex {
  text-align: left;
  padding-left: 2em;
}

.nb-notebook .nb-output code[class*='language-'],
.nb-notebook .nb-output pre[class*='language-'] {
  color: #000;
  background: 0 0;
  text-shadow: 0 1px #fff;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 14px;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}
.nb-notebook .nb-output code[class*='language-'] ::-moz-selection,
.nb-notebook .nb-output code[class*='language-']::-moz-selection,
.nb-notebook .nb-output pre[class*='language-'] ::-moz-selection,
.nb-notebook .nb-output pre[class*='language-']::-moz-selection {
  text-shadow: none;
  background: #b3d4fc;
}
.nb-notebook .nb-output code[class*='language-'] ::selection,
.nb-notebook .nb-output code[class*='language-']::selection,
.nb-notebook .nb-output pre[class*='language-'] ::selection,
.nb-notebook .nb-output pre[class*='language-']::selection {
  text-shadow: none;
  background: #b3d4fc;
}
@media print {
  .nb-notebook .nb-output code[class*='language-'],
  .nb-notebook .nb-output pre[class*='language-'] {
    text-shadow: none;
  }
}
.nb-notebook .nb-output pre[class*='language-'] {
  padding: 1em;
  margin: 0.5em 0;
  overflow: auto;
}
.nb-notebook :not(pre) > code[class*='language-'],
.nb-notebook .nb-output pre[class*='language-'] {
  background: #f5f2f0;
}
.nb-notebook:not(pre) > code[class*='language-'] {
  padding: 0.1em;
  border-radius: 0.3em;
  white-space: normal;
}
.nb-notebook .nb-output .token.cdata,
.nb-notebook .nb-output .token.comment,
.nb-notebook .nb-output .token.doctype,
.nb-notebook .nb-output .token.prolog {
  color: #708090;
}
.nb-notebook .nb-output .token.punctuation {
  color: #999;
}
.nb-notebook .nb-output .token.namespace {
  opacity: 0.7;
}
.nb-notebook .nb-output .token.boolean,
.nb-notebook .nb-output .token.constant,
.nb-notebook .nb-output .token.deleted,
.nb-notebook .nb-output .token.number,
.nb-notebook .nb-output .token.property,
.nb-notebook .nb-output .token.symbol,
.nb-notebook .nb-output .token.tag {
  color: #905;
}
.nb-notebook .nb-output .token.attr-name,
.nb-notebook .nb-output .token.builtin,
.nb-notebook .nb-output .token.char,
.nb-notebook .nb-output .token.inserted,
.nb-notebook .nb-output .token.selector,
.nb-notebook .nb-output .token.string {
  color: #690;
}
.nb-notebook .nb-output .language-css .token.string,
.nb-notebook .nb-output .style .token.string,
.nb-notebook .nb-output .token.entity,
.nb-notebook .nb-output .token.operator,
.nb-notebook .nb-output .token.url {
  color: #9a6e3a;
}
.nb-notebook .nb-output .token.atrule,
.nb-notebook .nb-output .token.attr-value,
.nb-notebook .nb-output .token.keyword {
  color: #07a;
}
.nb-notebook .nb-output .token.class-name,
.nb-notebook .nb-output .token.function {
  color: #dd4a68;
}
.nb-notebook .nb-output .token.important,
.nb-notebook .nb-output .token.regex,
.nb-notebook .nb-output .token.variable {
  color: #e90;
}
.nb-notebook .nb-output .token.bold,
.nb-notebook .nb-output .token.important {
  font-weight: 700;
}
.nb-notebook .nb-output .token.italic {
  font-style: italic;
}
.nb-notebook .nb-output .token.entity {
  cursor: help;
}
</style>
