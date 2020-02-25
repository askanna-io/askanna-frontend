<template>
  <v-card class="mb-6 pa-0 ">
    <v-system-bar :height="height">
      <v-icon btn @click="expand = !expand">{{ expandIcon }}</v-icon>
      <span>{{ flow.name }}</span>
      <v-spacer></v-spacer>
      <v-btn text icon @click="changeStatus">
        <v-icon :color="actionFlowStyle.color">{{ actionFlowStyle.icon }}</v-icon>
      </v-btn>
    </v-system-bar>
    <transition name="component-fade" mode="out-in">
      <v-card-text v-show="expand"> <ask-anna-progress-flow :graphData="flow.jobs" :id="flow.id"/></v-card-text>
    </transition>
  </v-card>
</template>

<script>
export default {
  name: 'Flow',

  props: {
    flow: {
      type: Object,
      default: function() {
        return {
          id: 0,
          name: 'Flow 1',
          expanded: true,
          status: {
            running: true
          }
        }
      }
    }
  },

  data() {
    return {
      height: 40,
      window: true,
      lightsOut: false,
      expandValue: false
    }
  },

  computed: {
    expandIcon() {
      return this.flow.expanded ? 'mdi-menu-up' : 'mdi-menu-down'
    },
    actionFlowStyle() {
      return this.flow.status.running ? { icon: 'mdi-stop', color: 'red' } : { icon: 'mdi-play', color: 'success' }
    },
    expand: {
      get() {
        return this.flow.expanded
      },
      set(val) {
        this.flow.expanded = val
        this.expandValue = val
      }
    }
  },
  methods: {
    changeStatus() {
      this.flow.status.running = !this.flow.status.running
    }
  }
}
</script>
<style scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.4s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
