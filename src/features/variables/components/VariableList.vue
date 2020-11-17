<template>
  <v-data-table
    class="variables-table ask-anna-table"
    :items="items"
    :headers="headers"
    hide-default-footer
    item-key="short_uuid"
  >
    <template v-slot:top>
      <slot name="header" />
    </template>

    <template v-slot:item.short_uuid="{ item }">
      <ask-anna-copy :text="item.short_uuid" prefix="#" />
    </template>
    <template v-slot:item.name="{ item }">
      <ask-anna-copy :text="item.name" slicedText :show="30" />
    </template>
    <template v-slot:item.value="{ item }">
      <v-expansion-panels class="ask-anna-expansion-panels" :disabled="item.is_masked" flat tile accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <ask-anna-copy :text="item.is_masked ? '********' : item.value" :show="30" />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ item.value }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-slot:item.is_masked="{ item }">
      {{ item.is_masked ? 'Yes' : 'No' }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn class="my-2" small outlined color="secondary" @click="handleEditItem(item)">
        <v-icon color="secondary" left small class="mr-2"> mdi-pencil </v-icon>Edit
      </v-btn>
    </template>
    <template v-slot:no-data>
      No variables in project
    </template>
  </v-data-table>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import AskAnnaCopy from '@/core/components/shared/AskAnnaCopy'
import { ref, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'VariableList',

  props: {
    items: {
      type: Array,
      default: () => []
    }
  },

  components: { AskAnnaCopy },

  setup(props, context) {
    const { width } = useWindowSize()

    const modal = ref(null)

    const headers = ref([
      {
        text: 'UUID',
        align: 'start',
        sortable: false,
        value: 'short_uuid',
        width: '10%'
      },
      { text: 'Name', value: 'name', width: '35%' },
      { text: 'Value', value: 'value', width: '35%', sortable: false },
      { text: 'Masked', value: 'is_masked', width: '10%' },
      { text: '', value: 'actions', width: '10%', sortable: false }
    ])

    const handleEditItem = item => context.emit('onEditItem', item.short_uuid)

    return {
      headers,
      handleEditItem
    }
  }
})
</script>
<style lang="scss">
.variables-table .v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: unset !important;
}
.variables-table .theme--light.v-expansion-panels .v-expansion-panel {
  background-color: unset !important;
}
.ask-anna-table {
  .ask-anna-expansion-panels {
    .v-expansion-panel-header,
    .v-expansion-panel-content__wrap {
      padding-left: 0;
    }
  }
}
</style>
