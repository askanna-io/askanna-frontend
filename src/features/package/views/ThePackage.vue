<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table
        fixed-header
        :page.sync="page"
        :headers="headers"
        :items="packageData.files"
        class="job-2ble"
        @page-count="pageCount = $event"
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
        <template v-slot:item.info="{ item }">
          <v-btn @click="handleJobInfo(item)" class="ma-2" large color="teal" icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
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
    const breadcrumbs = useBreadcrumbs(context, 3)

    onBeforeMount(() => {
      const { projectId, packageId } = context.root.$route.params

      packageData.getPackage({
        projectId,
        packageId
      })
    })

    return {
      ...moment,
      ...packageData,
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
        ini: 'mdi-file-cog-outline'
      },

      page: 1,
      pageCount: 2,
      itemsPerPage: 10,
      expanded: [],
      singleExpand: false,
      selection: 2,

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
      ],

      open: ['public']
    }
  },

  computed: {
    sticked: {
      get() {
        return this.stickedVal
      },
      set(val) {
        this.stickedVal = val
      }
    }
  },

  methods: {
    onStick(data) {
      this.sticked = data.sticked
    }
  }
})
</script>

<style scoped>
.job-table .v-data-table__wrapper {
  max-height: 100vh;
}
.job-sub-table .v-data-table__wrapper {
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
