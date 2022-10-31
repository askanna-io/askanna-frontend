<template>
  <div class="AskAnna--job-definition">
    <AskAnnaCardTitle :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }">Definition</AskAnnaCardTitle>
    <AskAnnaContainer class="mx-1 py-0" fluid>
      <AskAnnaRow>
        <AskAnnaCol
          :cols="$vuetify.breakpoint.xsOnly ? 12 : 2"
          :sm="job.schedules.length ? 4 : 5"
          :class="{ 'py-0': $vuetify.breakpoint.xsOnly }"
        >
          <AskAnnaRow>
            <AskAnnaCol cols="12"><RunInfoCopyText text="SUUID" :value="job.short_uuid" /></AskAnnaCol>
            <AskAnnaCol cols="12">
              <AskAnnaLinkCopy
                text="Code: "
                :to="to"
                :routeParams="routeParams"
                :value="lastPackage.short_uuid"
                @click="handleGoToCode"
              />
            </AskAnnaCol>
            <AskAnnaCol cols="12"
              ><run-info-env
                text="Environment"
                :fullMode="false"
                :value="environment"
                :nudgeLeft="nudgeLeft"
                :fullValue="!job.schedules.length"
              />
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCol>
        <AskAnnaCol
          :cols="$vuetify.breakpoint.xsOnly ? 12 : 2"
          :sm="job.schedules.length ? 4 : 5"
          v-if="job.schedules.length || nextRun.datatime"
        >
          <AskAnnaRow>
            <AskAnnaCol v-if="nextRun.datatime" cols="12">
              <AskAnnaTooltip top left content-class="opacity-1">
                <template v-slot:activator="{ on }">
                  <span class="hover-text" v-on="on"><span>Next run at </span>{{ nextRun.datatime }}</span>
                </template>
                <span>which is {{ prefix }}{{ nextRun.fromNow }}</span>
              </AskAnnaTooltip>
            </AskAnnaCol>
            <AskAnnaCol v-if="job.schedules.length" cols="12">
              <AskAnnaFlex class="d-flex">
                <span class="font-weight-bold">{{ title }}:</span>
                <ul class="list--unformated">
                  <li class="hover-text" v-for="(item, i) in schedules" :key="i" height="20">
                    <AskAnnaTooltip top left content-class="opacity-1">
                      <template v-slot:activator="{ on, value }">
                        <span class="hover-text" v-on="on">
                          <template v-if="isMultipleSchedules"
                            >{{ i + 1 }}. {{ item.humanizeFormat.value | capitalize }}</template
                          >
                          <template v-else>
                            {{ item.humanizeFormat.value | lowercase }}
                          </template>
                          <AskAnnaIcon
                            v-if="item.isDifferentTimeZone"
                            left
                            dense
                            dark
                            class="ma-0"
                            :color="getColor(value)"
                            :class="{ 'pl-1': isMultipleSchedules }"
                            >mdi-map-clock-outline</AskAnnaIcon
                          >
                        </span>
                      </template>
                      <div>
                        <span>Definition: {{ item.raw_definition }}</span
                        ><br />
                        <template>
                          <span>Time zone: {{ item.cron_timezone }}</span
                          ><br />
                        </template>
                        <span>Next:{{ item.next_run }}</span>
                      </div>
                    </AskAnnaTooltip>
                  </li>
                </ul>
              </AskAnnaFlex>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCol>
        <AskAnnaCol
          :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }"
          :cols="$vuetify.breakpoint.xsOnly ? 12 : 2"
          :sm="job.schedules.length ? 4 : 5"
        >
          <AskAnnaRow>
            <AskAnnaCol cols="12"
              ><NotificationsEmail
                title="Notification"
                :fullMode="false"
                :nudgeLeft="nudgeLeft"
                :notifications="job.notifications"
                :fullValue="!job.schedules.length"
              />
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaContainer>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['handleGoToCode'])
const props = defineProps({
  job: {
    type: Object,
    default: () => {
      return {
        timezone: '',
        environment: '',
        notifications: {
          all: { email: [] },
          error: { email: [] }
        }
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
  },
  to: {
    type: String,
    default: () => ''
  },
  routeParams: {
    type: Object,
    default: () => {}
  }
})

const isMultipleSchedules = computed(() => props.job.schedules.length > 1)
const title = computed(() => (isMultipleSchedules.value ? 'Schedules' : 'Schedule'))
const prefix = computed(() => (props.nextRun.fromNow === 'within a minute' ? '' : 'in '))
const environment = computed(() => ({ name: props.job.environment, timezone: props.job.timezone }))

const nudgeLeft = computed(() => (environment.value.name.length > 30 ? 0 : 150))

const getColor = active => (active ? 'primary' : 'grey lighten-2')

const handleGoToCode = () => emits('handleGoToCode')
</script>
<style scoped>
.list--unformated {
  list-style-type: none;
  padding-left: 3px;
}
.code-wrapper {
  display: flex;
  align-items: baseline;
}
</style>
