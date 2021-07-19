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
          <v-row dense class="mx-2">
            <v-col cols="12">
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
            </v-col>
            <v-col cols="12">
              <v-btn small outlined text block color="error" class="btn--hover" @click="handleOpenConfirmDeleteJob"
                >Remove this job
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
    <confirm-delete-job-popup
      :jobName="job.name"
      :value="deleteJobConfirmPopup"
      @onClose="handlCloseConfirmDeletePopup"
      @onDeleteConfirm="handleDeleteConfirmJob"
    />
  </div>
</template>

<script>
import useJobStore from '@/features/job/composition/useJobStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, defineComponent, computed } from '@vue/composition-api'
import ConfirmDeleteJobPopup from '@/features/project/components/popup/ConfirmDeleteJobPopup'

export default defineComponent({
  name: 'JobMenuPopup',

  components: {
    ConfirmDeleteJobPopup
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
    const jobStore = useJobStore()
    const router = useRouterAskAnna(context)

    const menu = ref(false)
    const deleteJobConfirmPopup = ref(false)

    const editJobRouteName = 'workspace-project-job-edit'

    const disabledButtonEditJob = computed(() => context.root.$route.name === editJobRouteName)

    const handlerOpenEditJobPage = async () => {
      router.push({ name: editJobRouteName })
      handleClose()
    }

    const handleOpenConfirmDeleteJob = async () => (deleteJobConfirmPopup.value = true)

    const handlCloseConfirmDeletePopup = () => (deleteJobConfirmPopup.value = false)

    const handleClose = () => (menu.value = false)

    const handleDeleteConfirmJob = async () => {
      const isDeleted = await jobStore.deleteJob(props.job)

      deleteJobConfirmPopup.value = false
      menu.value = false
      if (isDeleted) {
        router.push({ name: 'workspace-project-jobs' })
      }
    }

    return {
      menu,
      deleteJobConfirmPopup,
      disabledButtonEditJob,

      handleClose,
      handleDeleteConfirmJob,
      handlerOpenEditJobPage,
      handleOpenConfirmDeleteJob,
      handlCloseConfirmDeletePopup
    }
  }
})
</script>
