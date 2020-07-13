<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table
        fixed-header
        :headers="headers"
        :items="projectPackageHistory"
        class="job-table scrollbar cursor--pointer"
        @click:row="handleClickRow"
      >
        <template v-slot:top>
          <package-toolbar :breadcrumbs="breadcrumbs">
            <template v-slot:left>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <div v-on="on">
                    <a @click="handeBackToPackageRoot"
                      >Package #{{ packageId.slice(0, 4) }}<v-icon small>mdi-chevron-right</v-icon></a
                    >
                  </div>
                </template>
                <span>{{ packageId }}</span>
              </v-tooltip>
            </template>
          </package-toolbar>
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
                  <span>Copy run UUID</span>
                </v-tooltip>
              </div>
            </template>
            <span>{{ item.short_uuid }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.created="{ item }">
          {{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
        </template>
        <template v-slot:item.created_by="{ item }"> {{ item.created_by.name }} </template>
        <template v-slot:item.uuid="{ item }">
          <v-btn outlined label small class="btn--hover" color="secondary" @click.stop="handleDownload(item)">
            <v-icon left>mdi-download</v-icon>
            Download
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import useMoment from '@/core/composition/useMoment'
import { defineComponent } from '@vue/composition-api'
import usePackages from '@packages/composition/usePackages'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import PackageToolbar from '@/features/package/components/PackageToolbar'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'history',

  components: {
    PackageToolbar
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)

    const packages = usePackages(context)
    const forceFileDownload = useForceFileDownload()
    const breadcrumbs = useBreadcrumbs(context, { start: 3 })

    const headers = [
      { text: 'UUID', value: 'short_uuid', sortable: false, class: 'w-min-110' },
      { text: 'Date created', value: 'created' },
      { text: 'By', value: 'created_by' },
      {
        text: 'Name',
        align: 'left',
        value: 'filename'
      },
      { text: '', value: 'uuid', sortable: false }
    ]

    const handleClickRow = ({ short_uuid, versionId }) => {
      context.root.$router.push({
        name: 'workspace-project-package-version',
        params: { projectId: context.root.$route.params.projectId, packageId: short_uuid, versionId }
      })
    }

    const handleDownload = async packageData => {
      const source = await packages.downloadPackage({
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
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    return {
      ...moment,
      ...packages,
      headers,
      breadcrumbs,
      handleCopy,
      handleClickRow,
      handleDownload,
      handeBackToPackageRoot,
      packageId: context.root.$route.params.packageId
    }
  }
})
</script>

<style>
.job-table .v-data-table__wrapper {
  max-height: 500px;
}
.job-sub-table .v-data-table__wrapper {
  max-height: 200px;
}
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
