<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table
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

export default createComponent({
  name: 'ThePackage',

  setup(props, context) {
    const moment = useMoment(context)
    const packageData = usePackage()
    const breadcrumbs = useBreadcrumbs(context, { start: 3, subRoutes: true })
    const { height } = useWindowSize()

    onBeforeMount(() => {
      const { projectId, packageId, folderName } = context.root.$route.params

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
    treeView() {
      const path = this.$route.params.folderName || '/'
      let parentPath
      if (path && path !== '/') {
        const currentPath = this.packageData.files.find(file => file.path === path && file.is_dir)
        parentPath = this.packageData.files.find(file => file.path === currentPath.parent && file.is_dir)
        parentPath = {
          ...parentPath,
          name: '...',
          ext: 'parent'
        }
      }
      const tree = this.packageData.files.filter(file => file.parent === path)
      return parentPath ? [parentPath, ...tree] : tree
    },
    calcHeight() {
      return this.height - 450
    }
  },

  methods: {
    handleClickRow(item) {
      this.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid-name',
        params: { ...this.$route.params, folderName: item.path }
      })
    }
  }
})
</script>
