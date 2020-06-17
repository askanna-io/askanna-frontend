<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table
        fixed-header
        :headers="headers"
        :items="projectPackageHistory"
        class="job-table scrollbar"
        @click:row="handleClickRow"
      >
        <template v-slot:top>
          <v-breadcrumbs :items="breadcrumbs">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :to="item.to" exact>
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </template>

        <template v-slot:item.created="{ item }">
          {{ $moment(item.created).format(' Do MMMM YYYY, h:mm:ss a') }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment'
import usePackages from '@packages/composition/usePackages'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

export default defineComponent({
  setup(props, context) {
    const moment = useMoment(context)
    const packages = usePackages(context)
    const breadcrumbs = useBreadcrumbs(context, { start: 2 })

    const headers = [
      {
        text: 'Name',
        align: 'left',
        value: 'filename'
      },
      { text: 'Created', value: 'created' },
      { text: 'Uuid', value: 'short_uuid', sortable: false }
    ]

    const handleClickRow = ({ short_uuid, versionId }) => {
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid',
        params: { projectId: context.root.$route.params.projectId, packageId: short_uuid, versionId }
      })
    }

    return {
      ...moment,
      ...packages,
      headers,
      breadcrumbs,
      handleClickRow
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
