<template>
  <div>
    <v-card-title>Definition</v-card-title>
    <v-container class="ma-1 fluid">
      <v-row>
        <v-col cols="2" sm="6">
          <span>Code: </span>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <a v-if="lastPackage && lastPackage.short_uuid" @click="handleGoToCode" class="text-body-2"
                  >#{{ lastPackage.short_uuid.slice(0, 4) }}</a
                >
              </span>
            </template>
            <span>{{ lastPackage && lastPackage.short_uuid }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="6" sm="6"> <span>Environment: </span>{{ job.environment }}</v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

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
    lastPackage: {
      type: Object,
      default: () => {
        return {
          short_uuid: ''
        }
      }
    }
  },

  setup(rops, context) {
    const handleGoToCode = () => context.emit('handleGoToCode')

    return { handleGoToCode }
  }
})
</script>
