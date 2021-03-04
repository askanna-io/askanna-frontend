<template>
  <ask-anna-loading-progress :loading="loadingPackages">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0">
        <v-data-table
          v-scroll="throttle(onScroll, 1000)"
          disable-pagination
          hide-default-footer
          :headers="headers"
          :options="{ itemsPerPage: -1 }"
          :items="projectPackages.results"
          class="job-table askanna-table scrollbar cursor--pointer"
          @click:row="handleClickRow"
        >
          <template v-slot:top>
            <package-toolbar v-sticky="sticked" sticky-offset="{top: 52, bottom: 10}" :breadcrumbs="breadcrumbs">
              <template v-slot:left>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <a @click="handeBackToPackageRoot" class="text-body-2"
                        >Package #{{ packageId.slice(0, 4) }}<v-icon small>mdi-chevron-right</v-icon></a
                      >
                    </div>
                  </template>
                  <span>{{ packageId }}</span>
                </v-tooltip>
              </template>
            </package-toolbar>
          </template>
          <template v-slot:item.filename="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.filename, maxLength) }}
                </div>
              </template>
              <span>{{ item.filename }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.short_uuid="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  <v-btn class="px-0" text small>#{{ item.short_uuid.slice(0, 4) }}</v-btn>
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn icon text x-small v-on="on" v-show="value" @click.stop="handleCopy(item.short_uuid)"
                        ><v-icon>mdi-content-copy</v-icon></v-btn
                      >
                    </template>
                    <span>Copy package UUID</span>
                  </v-tooltip>
                </div>
              </template>
              <span>{{ item.short_uuid }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.created="{ item }">
            {{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
          </template>
          <template v-slot:item.created_by="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.created_by.name, maxLength) }}
                </div>
              </template>
              <span>{{ item.created_by.name }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.description="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  {{ slicedText(item.description, maxLength) }}
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn icon text x-small v-on="on" v-show="value"></v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>
              <span>{{ item.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.uuid="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn outlined label small class="btn--hover" color="secondary" @click.stop="handleDownload(item)">
                    <v-icon :left="$vuetify.breakpoint.name !== 'sm'">mdi-download</v-icon>

                    <span class="hidden-sm-only">Download</span>
                  </v-btn>
                </div>
              </template>
              <span>Download</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </ask-anna-loading-progress>
</template>

<script>
import { throttle } from 'lodash'
import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useMoment from '@/core/composition/useMoment'
import useSlicedText from '@/core/composition/useSlicedText'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import usePackagesStore from '@packages/composition/usePackagesStore'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'history',

  components: {
    PackageToolbar
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)
    const { width } = useWindowSize()
    const slicedText = useSlicedText()
    const projectStore = useProjectStore()
    const packagesStore = usePackagesStore(context)
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = useBreadcrumbs(context, { start: 3 })

    const sticked = computed(() => !projectStore.stickedVM.value)

    const { projectId: uuid } = context.root.$route.params

    const next = computed(() => packagesStore.state.projectPackages.value.next)

    const query = useQuery({
      next,
      uuid,
      limit: 18,
      offset: 100,
      storeAction: packagesStore.getProjectPackages
    })

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    onBeforeMount(async () => {
      await packagesStore.resetStore()
      await packagesStore.getInitialProjectPackages({ params: { limit: 100, offset: 0 }, uuid })
    })

    const sortBy = (a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }

      return 0
    }

    const headers = [
      {
        text: 'UUID',
        value: 'short_uuid',
        sortable: false,
        width: '10%',
        class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20'
      },
      {
        text: 'Date created',
        value: 'created',
        width: '10%',
        class: 'w-min-210 text-left text-subtitle-2 font-weight-bold h-20'
      },
      {
        text: 'By',
        value: 'created_by',
        sort: sortBy,
        width: '10%',
        class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20'
      },
      {
        text: 'Description',
        align: 'left',
        value: 'description',
        width: '60%',
        class: 'w-max-110 text-left text-subtitle-2 font-weight-bold h-20'
      },
      {
        text: '',
        value: 'uuid',
        sortable: false,
        width: '10%',
        class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20'
      }
    ]

    const handleClickRow = ({ short_uuid, versionId }) => {
      context.root.$router.push({
        name: 'workspace-project-package-folder',
        params: { projectId: context.root.$route.params.projectId, packageId: short_uuid, versionId, folderName: '' }
      })
    }

    const handleDownload = async packageData => {
      const source = await packagesStore.downloadPackage({
        projectId: packageData.project.short_uuid,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: packageData.filename })
    }

    const handeBackToPackageRoot = () => {
      const { workspaceId, projectId, packageId } = context.root.$route.params
      context.root.$router.push({
        name: 'workspace-project-package',
        params: { workspaceId, projectId, packageId }
      })
    }

    const handleCopy = id => {
      context.root.$copyText(id).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    const maxLength = computed(() => {
      switch (context.root.$vuetify.breakpoint.name) {
        case 'xs':
          return 40 - (550 - width.value) / 12
        case 'sm':
          return 30 - (841 - width.value) / 15
        default:
          1000
      }
    })

    return {
      ...moment,
      ...packagesStore,
      sticked,
      headers,
      throttle,
      onScroll,
      maxLength,
      slicedText,
      handleCopy,
      breadcrumbs,
      handleClickRow,
      handleDownload,
      handeBackToPackageRoot,
      packageId: context.root.$route.params.packageId
    }
  }
})
</script>

<style>
.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}

.job-table .v-data-table__expanded__row {
  background-color: aliceblue;
}

.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}

.job-sub-table .v-data-table__wrapper table {
  background: aliceblue;
}

.job-sub-table table .v-data-table-header tr th {
  background-color: beige !important;
}
</style>
