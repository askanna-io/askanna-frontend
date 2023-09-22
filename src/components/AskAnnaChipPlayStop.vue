<template>
  <AskAnnaButton
    @click="handleClick()"
    :prependIcon="statusIcon"
  >
    {{ statusValue }}
    <AskAnnaTooltip>

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
