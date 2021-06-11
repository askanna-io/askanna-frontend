<template>
  <div class="text-center">
    <v-menu v-model="menu" rounded :close-on-content-click="false" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" @click.stop.prevent="on.click" small>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-card flat elevation="24" width="300">
        <v-toolbar flat height="40" class="secondary--text" color="white">
          <v-toolbar-title class="pl-0">
            <span class="title font-weight-light">{{ job.name || 'Job:' + job.short_uuid }}</span>
          </v-toolbar-title>
          <v-spacer />

          <v-btn icon @click.stop.prevent="handleClose" small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-actions>
          <v-btn
            text
            block
            small
            outlined
            class="btn--hover"
            @click="handlerOpenEditJobPage"
            :disabled="disabledButtonEditJob"
          >
            Edit job
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from '@vue/composition-api'
import ConfirmDeleteProjectPopup from '@/features/project/components/popup/ConfirmDeleteProjectPopup'

export default defineComponent({
  name: 'JobMenuPopup',

  components: {
    ConfirmDeleteProjectPopup
  },

  props: {
    job: {
      type: Object,
      default: function () {
        return {
          name: '',
          short_uuid: '',
          description: ''
        }
      }
    }
  },

  setup(props, context) {
    const menu = ref(false)
    const editJobRouteName = 'workspace-project-job-edit'

    const disabledButtonEditJob = computed(() => context.root.$route.name === editJobRouteName)
    const handlerOpenEditJobPage = async () => {
      context.root.$router.push({ name: editJobRouteName })
      handleClose()
    }

    const handleClose = () => {
      menu.value = false
    }

    return {
      menu,
      disabledButtonEditJob,

      handleClose,
      handlerOpenEditJobPage
    }
  }
})
</script>
