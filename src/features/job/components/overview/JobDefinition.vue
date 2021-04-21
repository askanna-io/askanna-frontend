<template>
  <div class="AskAnna--job-definition">
    <v-card-title>Definition</v-card-title>
    <v-container class="ma-1" fluid>
      <v-row>
        <v-col cols="2" sm="6">
          <span>Code: </span>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <a v-if="lastPackage && lastPackage.short_uuid" @click="handleGoToCode" class="text-body-1"
                  >#{{ lastPackage.short_uuid.slice(0, 4) }}</a
                >
              </span>
            </template>
            <span>{{ lastPackage && lastPackage.short_uuid }}</span>
          </v-tooltip>
        </v-col>
        <v-col v-if="nextRun.datatime" cols="6" sm="6">
          <v-tooltip top left>
            <template v-slot:activator="{ on }">
              <span class="hover-text" v-on="on"><span> Next run at </span>{{ nextRun.datatime }}</span>
            </template>
            <span>which is {{ prefix }}{{ nextRun.fromNow }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" sm="6"> <span>Environment: </span>{{ job.environment }} </v-col>
        <v-col v-if="job.schedules.length" cols="6" sm="6">
          <v-flex class="d-flex">
            <span>{{ title }}:</span>
            <ul class="list--unformated">
              <li class="hover-text" v-for="(item, i) in schedules" :key="i" height="20">
                <v-tooltip top left :content-class="'opacity-1'">
                  <template v-slot:activator="{ on }">
                    <span class="hover-text" v-on="on">
                      <template v-if="isMultipleSchedules"
                        >{{ i + 1 }}. {{ item.humanizeFormat.value | capitalize }}</template
                      >
                      <template v-else>
                        {{ item.humanizeFormat.value | lowercase }}
                      </template>
                    </span>
                  </template>
                  <div>
                    <span>Definition: {{ item.raw_definition }}</span
                    ><br />
                    <span>Next:{{ item.next_run }}</span>
                  </div>
                </v-tooltip>
              </li>
            </ul>
          </v-flex>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobDefinition',

  props: {
    job: {
      type: Object,
      default: () => {
        return {
          env_variables: ''
        }
      }
    },
    schedules: {
      type: Array,
      default: () => {
        return []
      }
    },

    nextRun: {
      type: Object,
      default: () => {
        return {
          fromNow: '',
          datatime: ''
        }
      }
    },
    lastPackage: {
      type: Object,
      default: () => {
        return {
          short_uuid: ''
        }
      }
    }
  },

  setup(props, context) {
    const isMultipleSchedules = computed(() => props.job.schedules.length > 1)
    const title = computed(() => (isMultipleSchedules.value ? 'Schedules' : 'Schedule'))
    const prefix = computed(() => (props.nextRun.fromNow === 'within a minute' ? '' : 'in '))

    const handleGoToCode = () => context.emit('handleGoToCode')

    return { title, prefix, isMultipleSchedules, handleGoToCode }
  }
})
</script>
<style scoped>
.list--unformated {
  list-style-type: none;
  padding-left: 3px;
}
</style>
