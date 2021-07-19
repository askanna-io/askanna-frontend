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
            <span class="title font-weight-light">{{ jobrun.name || 'Run:' + jobrun.short_uuid }}</span>
          </v-toolbar-title>
          <v-spacer />

          <v-btn icon @click.stop.prevent="handleClose" small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-actions>
          <v-row dense class="mx-2">
            <v-col cols="12">
              <v-btn
                text
                block
                small
                outlined
                class="btn--hover"
                @click="handlerOpenEditRunPage"
                :disabled="disabledButtonEditJobRun"
              >
                Edit run info
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn small outlined text block color="error" class="btn--hover" @click="handleOpenConfirmDeleteRun"
                >Remove this run
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
    <confirm-delete-run-popup
      :runInfo="jobrun"
      :value="deleteRunConfirmPopup"
      @onClose="handlCloseConfirmDeletePopup"
      @onDeleteConfirm="handleDeleteConfirmRun"
    />
  </div>
</template>

<script>
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, defineComponent, computed } from '@vue/composition-api'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import ConfirmDeleteRunPopup from '@/features/project/components/popup/ConfirmDeleteRunPopup'

export default defineComponent({
  name: 'JobRunMenuPopup',

  components: {
    ConfirmDeleteRunPopup
  },

  props: {
    jobrun: {
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
    const jobRunStore = useJobRunStore()
    const router = useRouterAskAnna(context)

    const menu = ref(false)
    const deleteRunConfirmPopup = ref(false)

    const editJobRunRouteName = 'workspace-project-jobs-job-jobrun-edit'

    const disabledButtonEditJobRun = computed(() => context.root.$route.name === editJobRunRouteName)
    const handlerOpenEditRunPage = async () => {
      router.push({ name: editJobRunRouteName })
      handleClose()
    }

    const handleClose = () => {
      menu.value = false
    }

    const handleOpenConfirmDeleteRun = async () => (deleteRunConfirmPopup.value = true)

    const handlCloseConfirmDeletePopup = () => (deleteRunConfirmPopup.value = false)

    const handleDeleteConfirmRun = async () => {
      const isDeleted = await jobRunStore.deleteRunInfo(props.jobrun)
      deleteRunConfirmPopup.value = false
      menu.value = false
      if (isDeleted) {
        router.push({ name: 'workspace-project-job-jobruns' })
      }
    }

    return {
      menu,
      deleteRunConfirmPopup,
      disabledButtonEditJobRun,

      handleClose,
      handlerOpenEditRunPage,
      handleDeleteConfirmRun,
      handleOpenConfirmDeleteRun,
      handlCloseConfirmDeletePopup
    }
  }
})
</script>
