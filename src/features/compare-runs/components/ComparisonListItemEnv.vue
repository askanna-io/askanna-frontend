<template>
  <div>
    <v-tooltip v-if="isSliced" top content-class="opacity-1">
      <template v-slot:activator="{ on, value: show }">
        <div v-on="on">
          <span>{{ envNameSliced }}</span>

          <v-tooltip right content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaCopyText
                v-on="on"
                v-show="show"
                icon
                :text="envNameComputed"
                :showText="false"
                :iconColor="'grey lighten-2'"
                :buttonType="{ text: true }"
                :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
              />
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </template>
      <div>Image name: {{ imageComputed.name }}</div>
    </v-tooltip>

    <div v-else>
      <v-hover v-slot="{ hover }" open-delay="200">
        <div>
          {{ envNameSliced }}
          <v-tooltip right content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaCopyText
                v-on="on"
                v-show="hover"
                icon
                :showText="false"
                :text="envNameComputed"
                :iconColor="'grey lighten-2'"
                :buttonType="{ text: true }"
                :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
              />
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-hover>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useStartSlicedText from '@/core/composition/useStartSlicedText'
import AskAnnaCopyText from '@/core/components/shared/AskAnnaCopyText.vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      name: '',
      label: '',
      timezone: '',
      description: '',
      image: { name: '', tag: '', digest: '' }
    })
  }
})

const slicedStartText = useStartSlicedText()

const imageComputed = computed(() => ({
  name: props.value.name || '',
  tag: props.value.tag || '',
  digest: props.value.digest || ''
}))

const envNameComputed = computed(() => props.value.name)
const envNameSliced = computed(() => slicedStartText(props.value.name, 27))

const isSliced = computed(() => envNameComputed.value.length > 28)
</script>
