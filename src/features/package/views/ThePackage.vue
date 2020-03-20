<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0 pb-0">
      <the-file
        v-if="file"
        :fileSource="fileSource"
        :file="file"
        :breadcrumbs="breadcrumbs"
        :currentPath="currentPath"
      />
      <v-data-table
        v-else
        fixed-header
        :headers="headers"
        :items="treeView"
        :options="{ itemsPerPage: -1 }"
        :height="calcHeight"
        class="job-table scrollbar"
        @click:row="handleClickRow"
        hide-default-footer
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
        <template v-slot:item.type="{ item }">
          <v-icon v-if="item.is_dir">
            mdi-folder
          </v-icon>
          <v-icon v-else>
            {{ files[item.ext] }}
          </v-icon>
        </template>
        <template v-slot:item.last_modified="{ item }">
          {{ $moment(item.last_modified).format(' Do MMMM YYYY, h:mm:ss a') }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import usePackage from '../composition/usePackage'
import { onBeforeMount } from '@vue/composition-api'
import { createComponent } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment.js'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

import TheFile from './TheFile'

export default createComponent({
  name: 'ThePackage',

  components: { TheFile },

  setup(props, context) {
    const moment = useMoment(context)
    const packageData = usePackage()
    const breadcrumbs = useBreadcrumbs(context, { start: 3, subRoutes: true })
    const { height } = useWindowSize()

    onBeforeMount(() => {
      const { projectId, packageId, folderName } = context.root.$route.params
      const path = folderName || '/'

      packageData.getFileSource()

      packageData.getPackage({
        projectId,
        packageId,
        folderName
      })
    })

    return {
      ...moment,
      ...packageData,
      height,
      breadcrumbs
    }
  },

  data() {
    return {
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        yml: 'mdi-file-document-outline',
        rst: 'mdi-file-document-outline',
        gitignore: 'mdi-file-document-outline',
        in: 'mdi-file-settings',
        cfg: 'mdi-file-settings',
        xls: 'mdi-file-excel',
        py: 'mdi-language-python',
        ini: 'mdi-file-cog-outline',
        bat: 'mdi-file-cog-outline'
      },

      headers: [
        {
          text: '',
          align: 'left',
          sortable: false,
          value: 'type',
          width: 10
        },
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Size', value: 'size' },
        { text: 'Modified', value: 'last_modified' }
      ]
    }
  },

  computed: {
    path() {
      return this.$route.params.folderName || '/'
    },
    currentPath() {
      const pathArray = this.path.split('/')
      const fileName = pathArray.pop()
      const currentPath = this.packageData.files.find(item => item.name === fileName)

      if (currentPath && !currentPath.is_dir && currentPath.name !== '') {
        this.getFileSource(currentPath.path)
      }

      return currentPath
    },

    treeView() {
      let parentPath
      if (this.currentPath && this.currentPath.is_dir && this.path !== '/') {
        parentPath = this.packageData.files.find(file => file.name === this.currentPath.parent && file.is_dir)
        parentPath = {
          ...parentPath,
          name: '...',
          ext: 'parent'
        }
      }
      const tree = this.packageData.files.filter(item => item.parent === this.path)
      return parentPath ? [parentPath, ...tree] : tree
    },
    calcHeight() {
      return this.height - 450
    }
  },

  methods: {
    async handleClickRow(item) {
      const { projectId, packageId, versionId, folderName = '' } = this.$route.params

      if (typeof item.path === 'undefined') {
        this.$router.push({
          path: `/workspace/project/${projectId}/packages/${packageId}/version/${versionId}`
        })
        return
      }

      if (item.is_dir) {
        this.$router.push({
          path: `/workspace/project/${projectId}/packages/${packageId}/version/${versionId}/${item.path}`
        })
        return
      }

      this.$router.push({
        path: `/workspace/project/${projectId}/packages/${packageId}/version/${versionId}/${folderName}/${item.name}`
      })
    }
  }
})
</script>
