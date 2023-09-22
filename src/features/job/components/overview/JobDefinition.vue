<template>
  <div class="py-2">
    <AskAnnaTitle class="px-4 pb-3">Definition</AskAnnaTitle>
    <div class="flex flex-col sm:flex-row items-start px-4">
      <div class="basis-2/4">
        <RunInfoCopyText
          title="SUUID"
          :value="job.suuid"
          copyTitle="Copy job SUUID"
        />
        <AskAnnaLinkCopy
          :to="to"
          text="Code: "
          :value="packageSuuid"
          copyTitle="Copy code SUUID"
          :routeParams="routeParams"
          @click="handleGoToCode"
        />
        <RunInfoEnv
          isJobSection
          text="Environment"
          :fullMode="false"
          :value="environment"
          :nudgeLeft="nudgeLeft"
          copyTitle="Copy image name"
          :fullValue="!job.schedules?.length"
        />
      </div>
      <div>
        <NotificationsEmail
          title="Notification"
          :fullMode="false"
          :nudgeLeft="nudgeLeft"
          :notifications="job.notifications"
          :fullValue="!job.schedules?.length"
        />
        <template v-if="job.schedules?.length || nextRun?.datatime">
          <div
            v-if="nextRun?.datatime"
            class="flex h-8 items-center"
          >
            <span><span class="font-bold">Next run at: </span>{{ nextRun?.datatime }}
              <AskAnnaTooltip>
                <span>which is {{ prefix }}{{ nextRun.fromNow }}</span>
              </AskAnnaTooltip>
            </span>
          </div>
          <div
            v-if="job.schedules?.length"
            class="flex items-start pt-1"
          >
            <div class=" font-bold">{{ title }}:</div>
            <ul class="list-none pl-1">
              <li
                v-for="(item, i) in schedules"
                :key="i"
                class="pb-1"
              >
                <span>
                  <template v-if="isMultipleSchedules">
                    {{ i + 1 }}. {{ capitalize(item.humanizeFormat.value) }}
                  </template>
                  <template v-else>
                    {{ lowercase(item.humanizeFormat.value) }}
                  </template>
                  <AskAnnaIcon
                    v-if="item.isDifferentTimeZone"
                    class="pl-2"
                    size="small"
                    icon="mdi-map-clock-outline"
                  />

                  <AskAnnaTooltip>
                    <div>
                      <span>Definition: {{ item.raw_definition }}</span><br />
                      <span>Time zone: {{ item.cron_timezone }}</span><br />
                      <span>Next:{{ item.next_run_at }}</span>
                    </div>
                  </AskAnnaTooltip>
                </span>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useLowerCase from '@//composables/useLowerCase'

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
  packageSuuid: {
    type: String,
    default: () => ''
  },
  to: {
    type: String,
    default: () => ''
  },
  routeParams: {
    type: Object,
    default: () => { }
  }
})

const lowercase = useLowerCase()
const capitalize = useCapitalize()

const isMultipleSchedules = computed(() => props.job.schedules?.length > 1)
const title = computed(() => (isMultipleSchedules.value ? 'Schedules' : 'Schedule'))
const prefix = computed(() => (props.nextRun.fromNow === 'within a minute' ? '' : 'in '))
const environment = computed(() => ({ name: props.job.environment, timezone: props.job.timezone }))

const nudgeLeft = computed(() => (environment.value.name?.length > 30 ? 0 : 150))

const handleGoToCode = () => emits('handleGoToCode')
</script>