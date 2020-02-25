<template>
  <div>
    <svg class="grey" ref="svgNode" :id="svgID" width="100%">
      <g ref="gNode"></g>
    </svg>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import Vue from 'vue'

import Detail from './Detail'

export default {
  name: 'TheDagreD3Graph',

  props: {
    graphData: {
      type: Array,
      default: () => []
    },
    id: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      g: '',
      render: '',
      reverse: false,
      relation: false,
      graphStyleMediumAnim: () => {
        return {
          style: 'stroke: #f66; stroke-width: 2px; stroke-dasharray: 5, 5;',
          class: 'animation animation-slow density-medium weight-medium',
          arrowheadStyle: 'fill: #f66'
        }
      },
      graphStyleLowAnim: () => {
        return {
          style: 'stroke: #f66; stroke-width: 2px; stroke-dasharray: 5, 5;',
          class: 'animation animation-medium density-medium weight-medium',
          arrowheadStyle: 'fill: #f66'
        }
      }
    }
  },
  computed: {
    svgID() {
      return `svg-${this.id}`
    }
  },

  mounted() {
    this.initGraph()
    this.renderGraph()
    const thx = this

    window.setTimeout(function(v, k) {
      thx.graphData.forEach(function(val, key) {
        val.label = 'Label - ' + val.label

        val.svgPath = thx.$d3.select(`#${thx.svgID}`)

        var ComponentClass = Vue.extend(Detail)
        var instance = new ComponentClass({
          propsData: { type: 'primary' }
        })

        instance.$mount(`#${thx.svgID} .actions`)
      })

      thx.$d3
        .select('body')
        .transition()
        .duration(1000)
        .style('background', '#ff5722')
    }, 3000)
  },

  watch: {
    graphData(val) {
      this.renderGraph()
    }
  },

  methods: {
    initGraph() {
      const thx = this

      // Set up zoom support
      const svg = this.$d3.select(`#${this.svgID}`)
      const inner = this.$d3.select(`#${this.svgID} g`)
      /*      const zoom = this.$d3.zoom().on('zoom', function() {
        inner.attr('transform', thx.$d3.event.transform)
      })
      svg.call(zoom) */

      // Create and configure the renderer
      this.render = new this.$dagreD3.render()
    },

    changeReverse() {
      this.reverse = !this.reverse
      this.renderGraph()
    },

    changeRelation() {
      this.relation = !this.relation
      this.renderGraph()
    },

    handleRelation(...theArgs) {
      if (this.reverse) theArgs.reverse()
      return theArgs
    },

    clearGraphNodes() {
      this.g.setNode('please select quotes or tags', {})
    },

    setGraphNodes() {
      // set Nodes and Edges
      this.graphData.map(item => {
        var className = item.status ? 'running' : 'stopped'
        var html = '<div>'
        html += '<span class=status></span>'
        html += '<div class="actions"></div>'
        html += '</div>'
        this.g.setNode(item.id, {
          labelType: 'html',
          label: html,
          rx: 5,
          ry: 5,
          padding: 5,
          class: className
        })

        const hasInputQueueProperty = Object.prototype.hasOwnProperty.call(item, 'inputQueue')

        if (hasInputQueueProperty) {
          this.g.setEdge(item.inputQueue, item.id, {
            label: `${item.inputThroughput}/s`,
            width: 40,
            labelType: 'html',
            lineInterpolate: 'basis'
          })
        }
      })
    },

    renderGraph() {
      this.g = new this.$dagreD3.graphlib.Graph({ directed: true, compound: true }).setGraph({
        nodesep: 70,
        ranksep: 50,
        rankdir: 'LR',
        marginx: 40,
        marginy: 20
      })

      this.graphData.length ? this.setGraphNodes() : this.clearGraphNodes()

      // Set margins, if not present
      const hasMarginxProperty = Object.prototype.hasOwnProperty.call(this.g.graph(), 'marginx')
      const hasmarginyProperty = Object.prototype.hasOwnProperty.call(this.g.graph(), 'marginy')

      if (!hasMarginxProperty && !hasmarginyProperty) {
        this.g.graph().marginx = 20
        this.g.graph().marginy = 20
      }

      this.g.graph().transition = function(selection) {
        return selection.transition().duration(500)
      }

      // Render the graph into svg g
      this.$d3.select(`#${this.svgID} g`).call(this.render, this.g)

      // Center the graph
      const initialScale = 1.65
      const svg = this.$d3.select(`#${this.svgID}`)

      svg.attr('height', this.g.graph().height * initialScale + 40)
    }
  }
}
</script>

<style>
text {
  font-weight: 300;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serf;
  font-size: 14px;
}

.node rect {
  stroke: #333;
  fill: #fff;
  stroke-width: 1.5px;
}

.edgePath path.path {
  stroke: #333;
  fill: none;
  stroke-width: 1.5px;
}
.hidden {
  display: none;
}
.arrowhead {
  stroke: blue;
  fill: blue;
  stroke-width: 1.5px !important;
}

marker > path {
  stroke-width: 1.5px !important;
}

.inactive path {
  stroke: #c1c1c1 !important;
}
.inactive marker path {
  stroke: #c1c1c1;
  fill: #c1c1c1;
}

.density-low path {
  stroke: green !important;
}
.density-medium path {
  stroke: orange !important;
}
.density-high path {
  stroke: red !important;
}

.density-low marker path {
  fill: green;
}
.density-medium marker path {
  fill: orange;
}
.density-high marker path {
  fill: red;
}

.animation-slow {
  animation: arc-animation 100s linear infinite;
}
.animation-medium {
  animation: arc-animation 50s linear infinite;
}
.animation-fast {
  animation: arc-animation 10s linear infinite;
}

.animation {
  stroke-dasharray: 5px 10px;
  stroke-linecap: round;
  stroke-dashoffset: 1500;
}

@keyframes arc-animation {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
