<template>
  <AskAnnaLoadingProgress :loading="packagesStore.loadingPackages">
    <v-row align="center" justify="center">
      <v-col cols="12" class="pt-0">
        <v-data-table
          v-scroll="throttle(onScroll, 1000)"
          disable-pagination
          hide-default-footer
          :mobile-breakpoint="0"
          :headers="headersComputed"
          :options="{ itemsPerPage: -1 }"
          :items="packagesStore.projectPackages.results"
          class="job-table askanna-table scrollbar cursor--pointer"
          @click:row="handleClickRow"
        >
          <template v-slot:top>
            <package-toolbar
              v-sticky="sticked"
              :sticky-z-index="1"
              sticky-offset="{top: 52, bottom: 10}"
              :breadcrumbs="breadcrumbsComputed"
            />
          </template>
          <template v-slot:item.filename="{ item }">
            <v-tooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.filename, maxLength) }}
                </div>
              </template>
              <span>{{ item.filename }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.short_uuid="{ item }">
            <v-tooltip top content-class="opacity-1">
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  <v-btn class="px-0" text small>#{{ item.short_uuid.slice(0, 4) }}</v-btn>
                  <v-tooltip v-if="!$vuetify.breakpoint.xsOnly" right content-class="opacity-1">
                    <template v-slot:activator="{ on }">
                      <v-btn icon text x-small v-on="on" v-show="value" @click.stop="handleCopy(item.short_uuid)"
                        ><v-icon>mdi-content-copy</v-icon></v-btn
                      >
                    </template>
                    <span>Copy package SUUID</span>
                  </v-tooltip>
                </div>
              </template>
              <span>{{ item.short_uuid }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.created="{ item }">
            <span class="text-no-wrap">{{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}</span>
          </template>
          <template v-slot:item.created_by="{ item }">
            <v-tooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ slicedText(item.created_by.name, maxLength) }}
                </div>
              </template>
              <span>{{ item.created_by.name }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.description="{ item }">
            <v-tooltip top content-class="opacity-1">
              <template v-slot:activator="{ on, value }">
                <div v-on="on">
                  {{ slicedText(item.description, maxLength) }}
                  <v-tooltip right content-class="opacity-1">
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
            <v-tooltip top content-class="opacity-1">
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
  </AskAnnaLoadingProgress>
</template>

<script lang="ts">
import { throttle } from 'lodash'
import useCopy from '@/core/composition/useCopy'
import useQuery from '@/core/composition/useQuery'
import useMoment from '@/core/composition/useMoment'
import { useRouter, useWindowSize } from '@/core/plugins/vue-hooks'
import useSlicedText from '@/core/composition/useSlicedText'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useProjectStore } from '@/features/project/useProjectStore'
import { usePackagesStore } from '@/features/packages/usePackagesStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import PackageToolbar from '@/features/package/components/PackageToolbar.vue'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

export default defineComponent({
  name: 'history',

  components: {
    PackageToolbar,
    AskAnnaLoadingProgress
  },

  setup(_, context) {
    const copy = useCopy()
    const moment = useMoment()
    const { route } = useRouter()
    const router = useRouterAskAnna()
    const { width } = useWindowSize()
    const slicedText = useSlicedText()
    const projectStore = useProjectStore()
    const packagesStore = usePackagesStore()
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = useBreadcrumbs({ start: 2 })

    const sticked = computed(() => !projectStore.menu.sticked)
    const next = computed(() => packagesStore.projectPackages.next)
    const packageId = computed(() => projectStore.project.package.short_uuid)

    const { projectId } = route.value.params

    const query = useQuery({
      next,
      limit: 18,
      offset: 100,
      uuid: projectId,
      storeAction: packagesStore.getProjectPackages
    })

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    const fetchData = async () => {
      await packagesStore.resetStore()
      await packagesStore.getInitialProjectPackages({ params: { limit: 100, offset: 0 }, uuid: projectId })
    }

    onBeforeMount(() => fetchData())

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

    const headers = (isMobile: boolean = false) => [
      {
        text: 'SUUID',
        value: 'short_uuid',
        sortable: false,
        width: isMobile ? '1%' : '10%',
        class: 'text-left text-subtitle-2 font-weight-bold h-20' + (isMobile ? '' : ' w-min-110'),
        isShowOnMobile: true
      },
      {
        text: 'Date created',
        value: 'created',
        width: isMobile ? '15%' : '10%',
        class: 'w-min-210 text-left text-subtitle-2 font-weight-bold h-20',
        isShowOnMobile: true
      },
      {
        text: 'By',
        value: 'created_by',
        sort: sortBy,
        width: '10%',
        class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20',
        isShowOnMobile: true
      },
      {
        text: 'Description',
        align: 'left',
        value: 'description',
        width: '60%',
        class: 'w-max-110 text-left text-subtitle-2 font-weight-bold h-20',
        isShowOnMobile: true
      },
      {
        text: '',
        value: 'uuid',
        sortable: false,
        width: '10%',
        class: 'w-min-110 text-left text-subtitle-2 font-weight-bold h-20',
        isShowOnMobile: false
      }
    ]
    const isMobile = computed(() => context.root.$vuetify.breakpoint.xsOnly)
    const headersComputed = computed(() =>
      isMobile.value ? headers(isMobile.value).filter(item => item.isShowOnMobile === isMobile.value) : headers()
    )

    const breadcrumbsComputed = computed(() => {
      const { workspaceId, projectId } = route.value.params

      const first = {
        title: `Package: #${packageId.value.slice(0, 4)}`,
        to: {
          name: 'workspace-project-code',
          params: { workspaceId, projectId, folderName: '' }
        },
        exact: true,
        disabled: false,
        showTooltip: true,
        tooltip: `
          <span>${packageId.value}</span>
        `
      }

      return [first, ...breadcrumbs.value]
    })

    const handleClickRow = ({ short_uuid, versionId }) => {
      router.push({
        name: 'workspace-project-package-folder',
        params: { projectId: route.value.params.projectId, packageId: short_uuid, versionId, folderName: '' }
      })
    }

    const handleDownload = async packageData => {
      const source = await packagesStore.downloadPackage({
        projectId: packageData.project.short_uuid,
        packageId: packageData.short_uuid
      })
      forceFileDownload.trigger({ source, name: `code_${packageData.short_uuid}_${packageData.filename}` })
    }

    const handleCopy = id => copy.handleCopyText(id)

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
      sticked,
      headers,
      throttle,
      onScroll,
      maxLength,
      packageId,
      slicedText,
      handleCopy,
      packagesStore,
      headersComputed,
      breadcrumbsComputed,

      handleClickRow,
      handleDownload
    }
  }
})
</script>

<style>
.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}
.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}
</style>
