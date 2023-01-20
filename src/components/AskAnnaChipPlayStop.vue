<template>
  <AskAnnaButton small outlined color="secondary" class="mr-1 btn--hover" @click="handleClick()">
    <AskAnnaIcon left>{{ statusIcon }}</AskAnnaIcon>
    <AskAnnaTooltip top content-class="opacity-1">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <template>
            <span> {{ statusValue }} </span>
          </template>
        </div>
      </template>
      Auto-update log
    </AskAnnaTooltip>
  </AskAnnaButton>
</template>

<script setup lang="ts">
const props = defineProps({
  value: Boolean
})

const emit = defineEmits(['onClick'])

const ICONS = {
  paused: 'mdi-play',
  running: 'mdi-pause'
}
const TEXTS = {
  finished: 'Succeeded',
  running: 'Pause auto-update log',
  paused: 'Continue auto-update log'
}
const status = computed(() => (props.value ? 'running' : 'paused'))

const statusIcon = computed(() => ICONS[status.value])
const statusValue = computed(() => TEXTS[status.value])

const handleClick = () => emit('onClick')
</script>
<style>
.askaanna-chip-play-stop {
  width: 110px;
}
.askaanna-chip-play-stop.v-chip:before {
  background-color: initial;
}
</style>
