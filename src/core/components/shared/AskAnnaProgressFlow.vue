<template>
  <div>
    <svg class="grey" ref="svgNode" :id="svgID" width="100%">
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
          viewBox="0 0 20 20"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="grey" />
        </marker>
      </defs>
      <g ref="gNode">
        <foreignObject x="20" y="40" width="180" height="50">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <v-card outlined>
              <v-avatar>
                <v-progress-circular
                  :rotate="360"
                  :size="30"
                  :width="2"
                  :value="value"
                  :color="value === 100 ? 'green' : 'orange'"
                >
                  {{ value }}
                </v-progress-circular>
              </v-avatar>
              <v-chip
                v-if="chip4"
                small
                close
                :color="value === 100 ? 'green' : 'orange'"
                label
                outlined
                @click:close="handleClose"
              >
                <v-avatar left v-if="value === 100">
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-avatar>
                Testing
              </v-chip>
            </v-card>
          </div>
        </foreignObject>
      </g>
      <line x1="200" y1="65" x2="233" y2="40" stroke="grey" stroke-width="2" marker-end="url(#arrow)" />
      <line x1="200" y1="65" x2="233" y2="100" stroke="grey" stroke-width="2" marker-end="url(#arrow)" />
      <g ref="gNode2">
        <foreignObject x="240" y="20" width="180" height="50">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <v-card outlined mt-2>
              <v-avatar left>
                <v-progress-circular
                  :rotate="360"
                  :size="30"
                  :width="2"
                  :value="value1"
                  :color="value1 === 100 ? 'green' : 'orange'"
                >
                  {{ value1 }}
                </v-progress-circular>
              </v-avatar>
              <v-chip v-if="chip4" small close color="orange" label outlined @click:close="handleClose">
                Build
              </v-chip>
            </v-card>
          </div>
        </foreignObject>
      </g>
      <g ref="gNode3">
        <foreignObject x="240" y="80" width="180" height="50">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <v-card outlined mt-2>
              <v-avatar left>
                <v-progress-circular
                  :rotate="360"
                  :size="30"
                  :width="2"
                  :value="value2"
                  :color="value2 === 100 ? 'green' : 'orange'"
                >
                  {{ value2 }}
                </v-progress-circular>
              </v-avatar>
              <v-chip
                small
                close
                :color="value2 === 100 ? 'green' : 'orange'"
                label
                outlined
                @click:close="handleClose"
              >
                <v-avatar left v-if="value2 === 100">
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-avatar>
                Build 2
              </v-chip>
            </v-card>
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'AskAnnaProgressFlow',

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
      interval: {},
      chip4: true,
      value: 0,
      value1: 0,
      value2: 0
    }
  },
  computed: {
    svgID() {
      return `svg-${this.id}`
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },

  mounted() {
    this.interval = setInterval(() => {
      if (this.value === 100) {
        if (this.value1 < 100) {
          this.value1 += 10
        }
        if (this.value2 < 100) {
          this.value2 += 20
        }

        if (this.value1 === 100 && this.value2) {
          this.value = this.value1 = this.value2 = 0
          return
        }
        return
      }
      this.value += 10
    }, 1000)
  },

  watch: {
    graphData(val) {}
  },

  methods: {
    close() {
      alert('Chip close clicked')
    },
    handleClose() {
      this.value = this.value1 = this.value2 = 0
    }
  }
}
</script>
