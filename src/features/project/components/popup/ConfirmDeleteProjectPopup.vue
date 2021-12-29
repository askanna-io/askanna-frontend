<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <v-card class="AskAnna-card AskAnna-card--in-dialog" :class="{ 'pt-2': $vuetify.breakpoint.xsOnly }">
      <v-toolbar
        flat
        white--text
        color="white"
        :dense="!$vuetify.breakpoint.xsOnly"
        :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }"
      >
        <v-toolbar-title v-if="!$vuetify.breakpoint.xsOnly" class="px-0"
          >Do you want to remove the <span class="primary--text">{{ title }}</span> project?</v-toolbar-title
        >
        <div v-else class="text-body-1 font-weight-bold">
          Do you want to remove the <span class="primary--text">{{ title }} </span>project?
        </div>
        <v-spacer />

        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        You are about to remove the <b>{{ projectName }}</b> project. Here's what will happen when you remove the
        <b>{{ projectName }}</b> project:
        <br />
        <br />
        <ul>
          <li>
            The <b>{{ projectName }}</b> project will be removed from this workspace
          </li>
          <li>
            All data related to the <b>{{ projectName }}</b> will be removed
          </li>
          <li>
            If other projects or systems use jobs, files or other parts of the <b>{{ projectName }}</b> project, they
            are not able to use it anymore
          </li>
        </ul>
        <br />
        After 30 days, the system will entirely delete the project from the backend. Within 30 days, you can
        <a href="mailto:support@askanna.io" target="_blank">contact us</a>
        if you want to undo the removal.
        <br />
        <br />
        Please confirm that you want to remove the <b>{{ projectName }}</b> project.
      </v-card-text>
      <v-card-actions :class="{ 'px-3': $vuetify.breakpoint.xsOnly }">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove project{{ $vuetify.breakpoint.xsOnly ? '' : `: ${name}` }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useSlicedText from '@/core/composition/useSlicedText'

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  projectName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.projectName, 17))
const title = computed(() => slicedText(props.projectName, 27))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const closeDelete = () => emit('onClose')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
