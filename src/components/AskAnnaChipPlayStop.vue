<template>
  <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleClick()">
    <v-icon left>{{ statusIcon }}</v-icon>
    <v-tooltip top content-class="opacity-1">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <template>
            <span> {{ statusValue }} </span>
          </template>
        </div>
      </template>
      Auto-update log
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps({
  value: Boolean
})

const emit = defineEmits(['onClick'])

const ICONS = {
  PAUSED: 'mdi-play',
  RUNNING: 'mdi-pause'
}
const TEXTS = {
  SUCCESS: 'Succeeded',
  RUNNING: 'Pause auto-update log',
  PAUSED: 'Continue auto-update log'
}
const status = computed(() => (props.value ? 'RUNNING' : 'PAUSED'))

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
