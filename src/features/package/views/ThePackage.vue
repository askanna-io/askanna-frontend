<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <v-data-table
        fixed-header
        :page.sync="page"
        :headers="headers"
        :items="packageFiles"
        class="job-2ble"
        @page-count="pageCount = $event"
      >
        <template v-slot:top>
          <v-breadcrumbs :items="items">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" exact>
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </template>
        <template v-slot:item.icon="{ item }">
          <v-icon v-if="!item.file">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.file] }}
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
import { createComponent } from '@vue/composition-api'

import useMoment from '@/core/composition/useMoment.js'

export default createComponent({
  name: 'ThePackages',

  setup(props, context) {
    const moment = useMoment(context)

    return {
      ...moment
    }
  },

  data() {
    return {
      items: [
        {
          text: 'Packages',
          disabled: false,
          to: '/workspace/project/1/packages/'
        },
        {
          text: 'Package - #1',
          disabled: true,
          to: '/workspace/project/1/packages/1'
        }
      ],
      packageFiles: [
        {
          name: '.git',
          date: '10 feb 2020',
          author: 'Evan You',
          modified: '10 March 2020'
        },
        {
          name: '.public',
          date: '8 feb 2020',
          author: 'Robert',
          modified: '10 March 2020'
        },
        {
          name: '.gitignore',
          file: 'txt',
          date: '9 feb 2020',
          author: 'Andrii',
          modified: '20 March 2020'
        },
        {
          name: 'babel.config.js',
          file: 'js',
          date: '2 feb 2020',
          author: 'Andrii',
          modified: '12 March 2020'
        },
        {
          name: 'package.json',
          file: 'json',
          date: '3 feb 2020',
          author: 'Andrii',
          modified: '3 March 2020'
        },
        {
          name: 'README.md',
          file: 'md',
          date: '1 feb 2020',
          author: 'Andrii',
          modified: '10 March 2020'
        },
        {
          name: 'vue.config.js',
          file: 'js',
          date: '2 feb 2020',
          author: 'Andrii',
          modified: '13 March 2020'
        },
        {
          name: 'yarn.lock',
          file: 'txt'
        }
      ],

      currentJob: null,
      loading: true,
      openD: false,
      jobResults: {
        name: '',
        runtime: '',
        memory: '',
        return_payload: ''
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
          value: 'icon',
          width: 10
        },
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Modified', value: 'modified' },
        { text: 'Author', value: 'author' }
      ],

      open: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel'
      },
      tree: [],
      items2: [
        {
          name: '.git'
        },
        {
          name: 'node_modules'
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [
                {
                  name: 'logo.png',
                  file: 'png'
                }
              ]
            },
            {
              name: 'favicon.ico',
              file: 'png'
            },
            {
              name: 'index.html',
              file: 'html'
            }
          ]
        },
        {
          name: '.gitignore',
          file: 'txt'
        },
        {
          name: 'babel.config.js',
          file: 'js'
        },
        {
          name: 'package.json',
          file: 'json'
        },
        {
          name: 'README.md',
          file: 'md'
        },
        {
          name: 'vue.config.js',
          file: 'js'
        },
        {
          name: 'yarn.lock',
          file: 'txt'
        }
      ]
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
