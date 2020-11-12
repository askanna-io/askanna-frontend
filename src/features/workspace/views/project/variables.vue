<template>
  <v-data-table
    class="variables-table"
    show-expand
    :headers="headers"
    :items="variables"
    hide-default-footer
    :expanded.sync="expanded"
    item-key="short_uuid"
  >
    <template v-slot:top>
      <v-card flat>
        <v-card-text>
          <p>
            Project variables are applied to every run environment within this project. You can use variables for
            settings, passwords, tokens, etcetera. You can use the variable in your job definition via
            <b>VARIABLE_NAME</b>. Also the variables are avaiable as environment variables, so you can refer directly to
            them via for example you Python script.
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
      <v-toolbar color="grey lighten-4" flat dense>
        <v-spacer />

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
              <v-icon color="primary" left>mdi-plus</v-icon>
              New variable
            </v-btn>
          </template>
          <v-card>
            <v-app-bar flat>
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
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      id="edited-item-name"
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
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      @input="handleChangeValue"
                      :value="editedItem.masked ? '*****' : editedItem.value"
                      :disabled="isEdit && editedItem.masked"
                      no-resize
                      hide-details
                      outlined
                      name="input-7-4"
                      label="Value"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pt-0" cols="12">
                    <v-checkbox
                      :disabled="isEdit && editedItem.masked && isSaved"
                      v-model="maskedModel"
                      label="Masked"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions class="ml-5">
              <v-btn @click="close" small outlined text color="secondary" class="mr-1 btn--hover">
                Cancel
              </v-btn>
              <v-btn v-if="isEdit" small outlined text color="error" class="mr-1 btn--hover" @click="deleteItem">
                Delete
              </v-btn>
              <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="450px">
          <v-card>
            <v-card-title
              >Are you sure you want to delete variable:
              <span class="primary--text">{{ editedItem.name }}</span> ?</v-card-title
            >
            <v-card-actions class="ml-5">
              <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="deleteItemConfirm"
                >Yes</v-btn
              >
              <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">No</v-btn>
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
      <v-expansion-panels :disabled="item.masked" flat tile accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <ask-anna-copy :text="item.masked ? '*****' : item.value" :show="30" />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ item.value }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-slot:item.masked="{ item }">
      {{ item.masked ? 'Yes' : 'No' }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn class="my-2" small outlined color="secondary" @click="editItem(item)">
        <v-icon color="secondary" left small class="mr-2"> mdi-pencil </v-icon>Edit
      </v-btn>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td />
      <td />
      <td>{{ item.value }}</td>
      <td />

      <td />
      <td />
    </template>
    <template v-slot:no-data>
      No variables in project
    </template>
  </v-data-table>
</template>

<script>
import useCopy from '@/core/composition/useCopy'
import AskAnnaCopy from '@/core/components/shared/AskAnnaCopy'
import { ref, toRefs, reactive, computed, defineComponent } from '@vue/composition-api'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

export default defineComponent({
  name: 'Variables',

  components: { AskAnnaCopy },

  setup(props, context) {
    const copy = useCopy(context)
    const snackBar = useSnackBar()

    const modal = ref(null)

    const state = reactive({
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
        { text: 'Name', value: 'name', width: '35%', sortable: false },
        { text: 'Value', value: 'value', width: '35%', sortable: false },
        { text: 'Masked', value: 'masked', width: '10%', sortable: false },
        { text: '', value: 'actions', width: '10%', sortable: false },
        { text: '', value: 'data-table-expand' }
      ],
      variables: [],
      editedIndex: -1,
      editedItem: {
        short_uuid: '',
        name: '',
        value: '',
        masked: false
      },
      isSaved: true,
      defaultItem: {
        short_uuid: '',
        name: '',
        value: '',
        masked: false
      }
    })

    const isEdit = computed(() => state.editedIndex !== -1)
    const formTitle = computed(() => (!isEdit.value ? 'Add a variable' : 'Edit a variable'))

    const initialize = () => {
      state.variables = [
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
    }

    const editItem = item => {
      state.editedIndex = state.variables.indexOf(item)
      state.editedItem = Object.assign({}, item)
      state.dialog = true
    }

    const handleChangeValue = val => (state.editedItem.value = val)

    const deleteItem = () => {
      state.dialogDelete = true
    }

    const deleteItemConfirm = () => {
      state.variables.splice(state.editedIndex, 1)
      closeDelete()
    }

    const close = () => {
      state.dialog = false
      state.isSaved = true
      state.editedItem = Object.assign({}, state.defaultItem)
      state.editedIndex = -1
    }

    const closeDelete = () => {
      state.dialogDelete = false
      close()
    }

    const save = () => {
      if (state.editedIndex > -1) {
        Object.assign(state.variables[state.editedIndex], state.editedItem)
      } else {
        state.variables.push({ ...state.editedItem, short_uuid: `asd21-21dasd-12as-${state.variables.length + 1}` })
      }
      close()
    }

    const maskedModel = computed({
      get: () => state.editedItem.masked,
      set: val => {
        if (!state.editedItem.masked) {
          state.isSaved = false
        }
        state.editedItem.masked = val
      }
    })

    initialize()

    const expanded = ref([])

    return {
      ...toRefs(state),
      expanded,
      isEdit,
      handleCopy: copy.handleCopyTextById,
      modal,
      formTitle,
      close,
      editItem,
      deleteItem,
      deleteItemConfirm,
      closeDelete,
      save,
      maskedModel,
      handleChangeValue
    }
  }
})
</script>
<style>
.variables-table .v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: unset !important;
}
.variables-table .theme--light.v-expansion-panels .v-expansion-panel {
  background-color: unset !important;
}
</style>
