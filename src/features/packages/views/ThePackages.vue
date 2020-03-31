<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table :headers="headers" :items="projectPackages" @click:row="handleClickRow" fixed-header class="j21">
        <template v-slot:top>
          <v-subheader>Packages</v-subheader>
        </template>

        <template v-slot:item.uuid="{ item }">
          <v-chip outlined label color="primary" @click.stop="handleDownload(item)">
            <v-avatar left><v-icon>mdi-cloud-download</v-icon></v-avatar
            >Download</v-chip
          >
        </template>

        <template v-slot:item.created_at="{ item }">
          {{ $moment(item.created_at).format(' Do MMMM YYYY, h:mm:ss a') }}
        </template>

        <template v-slot:item.menu="{ item }">
          <v-menu bottom color="primary" :close-on-content-click="false" :nudge-width="200" offset-x :key="item.name">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" color="primary">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="handleHistory(item)">
                <v-list-item-title>History</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { createComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment.js'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

import usePackages from '../composition/usePackages'

export default createComponent({
  name: 'ThePackages',

  setup(props, context) {
    const moment = useMoment(context)
    const packages = usePackages(context)
    const forceFileDownload = useForceFileDownload()

    return {
      ...moment,
      ...packages,
      forceFileDownload
    }
  },

  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'filename'
        },
        { text: 'Created', value: 'created_at' },
        { text: '', value: 'uuid', sortable: false },
        { text: '', value: 'menu' }
      ]
    }
  },

  methods: {
    async handleDownload(packageData) {
      const source = await this.downloadPackage({
        projectId: packageData.project,
        packageId: packageData.uuid
      })
      this.forceFileDownload.trigger({ source, name: packageData.filename })
    },
    handleHistory({ project_id, uuid }) {
      this.$router.push({
        name: 'workspace-project-packages-uuid-history',
        params: { projectId: project_id, packageId: uuid, versionId: '1' }
      })
    },
    handleClickRow({ project_id, uuid }) {
      this.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid',
        params: { projectId: project_id, packageId: uuid, versionId: '1' }
      })
    }
  }
})
</script>
