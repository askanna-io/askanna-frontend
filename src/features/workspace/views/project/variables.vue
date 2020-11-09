<template>
  <v-data-table :headers="headers" :items="variables" hide-default-footer>
    <template v-slot:top>
      <v-card flat>
        <v-card-text>
          <p>
            Project variables are applied to every run environment within this project. You can use variables for
            settings, passwords, tokens, etcetera. You can usethe variable in your job definition via
            <b>VARIABLE_NAME</b> . Also the variables are avaiable as environment variables, so you can refer directly
            to them via for example you Python script.
          </p>
          <p>
            Masked variables can be used for sensitive information. By default we will not expose the value of these
            variables.
          </p>
          <a
            class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
            href="https://docs.askanna.io/#/jobs?id=variables"
            target="_blank"
            >Read the documentation for more information.</a
          >
        </v-card-text>
      </v-card>
      <v-toolbar color="grey lighten-4" flat dense class="br-r5">
        <v-spacer />

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
              <v-icon color="primary" left>mdi-plus</v-icon>
              New variable
            </v-btn>
          </template>
          <v-card>
            <v-app-bar flat dense white--text color="white">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-spacer />

              <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text>
              <v-container class="pb-0">
                <v-row>
                  <v-col cols="12" sm="10" md="10">
                    <v-text-field
                      v-model="editedItem.name"
                      autofocus
                      @keyup.enter="handlerCreateProject"
                      small
                      dense
                      hide-details
                      outlined
                      label="Name"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="10" md="10">
                    <v-textarea
                      v-model="editedItem.value"
                      hide-details
                      outlined
                      name="input-7-4"
                      label="Value"
                      value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pt-0" cols="12">
                    <v-checkbox v-model="editedItem.masked" label="Masked" hide-details />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions class="ml-5">
              <v-btn text @click="close" small outlined>
                Cancel
              </v-btn>
              <v-btn v-if="editedIndex !== -1" color="error" outlined small text @click="deleteItem">
                Delete
              </v-btn>
              <v-btn small outlined text color="primary" class="mr-1 btn--hover" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="450px">
          <v-card>
            <v-card-title>Are you sure you want to delete variable {{ editedItem.name }} ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" small outlined text @click="deleteItemConfirm">Yes</v-btn>
              <v-btn color="secondary" small outlined text @click="closeDelete">No</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.short_uuid="{ item }">
      <ask-anna-copy :text="item.short_uuid" prefix="#" />
    </template>
    <template v-slot:item.name="{ item }">
      <ask-anna-copy :text="item.name" :show="30" />
    </template>
    <template v-slot:item.value="{ item }">
      <ask-anna-copy :text="item.masked ? '*****' : item.value" :show="30" />
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn class="my-2" small outlined color="secondary" @click="editItem(item)">
        <v-icon color="secondary" left small class="mr-2"> mdi-pencil </v-icon>Edit
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import AskAnnaCopy from '@/core/components/shared/AskAnnaCopy'

export default defineComponent({
  name: 'Variables',

  components: { AskAnnaCopy },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'UUID',
        align: 'start',
        sortable: false,
        value: 'short_uuid',
        width: '10%'
      },
      { text: 'Name', value: 'name', width: '35%' },
      { text: 'Value', value: 'value', width: '35%' },
      { text: 'Masked', value: 'masked', width: '10%' },
      { text: '', value: 'actions', width: '10%', sortable: false }
    ],
    variables: [],
    editedIndex: -1,
    editedItem: {
      short_uuid: '',
      name: '',
      value: '',
      masked: false
    },
    defaultItem: {
      short_uuid: '',
      name: '',
      value: '',
      masked: false
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add a variable' : 'Edit a variable'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.variables = [
        {
          short_uuid: 'asd21-21dasd-12as-1',
          name: 'Token auth',
          value: '12312-123-12--3333',
          masked: false
        },
        {
          short_uuid: 'asd21-21dasd-12as-2',
          name: 'Token API',
          value: '12312-123-12--3333',
          masked: false
        },
        {
          short_uuid: 'asd21-21dasd-12as-3',
          name: 'WB_VARIABE_TEST long name also should show on some way like this',
          value: 'https://google.com',
          masked: true
        }
      ]
    },

    editItem(item) {
      this.editedIndex = this.variables.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem() {
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.variables.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.close()
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.variables[this.editedIndex], this.editedItem)
      } else {
        this.variables.push({ ...this.editedItem, short_uuid: `asd21-21dasd-12as-${this.variables.length + 1}` })
      }
      this.close()
    }
  }
})
</script>
