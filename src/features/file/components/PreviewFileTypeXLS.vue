<template>
  <div
    class="fill-height pb-3 br-4 pt-0"
    :class="{ 'px-4 p-2': !$vuetify.display.xs }"
  >
    <VTabs
      v-model="currentSheet"
      left
      show-arrows
      center-active
    >
      <VTab
        v-for="(tab, index) of data"
        :key="index"
      >Sheet: {{ tab.name }}</VTab>
    </VTabs>

    <VWindow v-model="currentSheet">
      <template
        v-for="(tab, index) in data"
        :key="index"
      >
        <VWindowItem :value="index">
          <KeepAlive>
            <Suspense>
              <VDataTable
                class="askanna-table askanna-table--no-wrap"
                :search="search"
                :items="tab.items"
                :row-height="40"
                hide-default-footer
                :items-per-page="-1"
                :mobile-breakpoint="0"
                :headers="tab.headers"
                :group-by="activeGroup?.value || []"
              >
                <template
                  v-slot:headers
                  v-if="tab.isNoHeaderPresent"
                >
                </template>
                <template v-slot:top>
                  <div
                    v-if="tab.headers.length && !tab.isNoHeaderPresent"
                    class="flex justify-end mt-4 gap-x-4"
                  >
                    <div class="flex w-full px-4 sm:px-0 sm:w-52">
                      <AskAnnaSelect
                        width="100px"
                        label="Group by"
                        return-object
                        v-model="activeGroup"
                        :items="groupItems(tab.headers)"
                      />
                    </div>
                    <div
                      v-if="!$vuetify.display.xs"
                      class="flex flex-grow-0 w-56"
                    >
                      <AskAnnaTextField
                        single-line
                        hide-details
                        label="Search"
                        v-model="search"
                        variant="underlined"
                        append-inner-icon="mdi-magnify"
                      />
                    </div>
                  </div>
                </template>
                <template
                  v-slot:body="{ items, columns }"
                  v-if="tab.isNoHeaderPresent"
                >
                  <template
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <tr class="pointer hover:bg-third max-w-max">
                      <template v-for="(val) in Object.values(item.raw)">
                        <AskAnnaTableItem class="whitespace-nowrap">{{ val }}</AskAnnaTableItem>
                      </template>
                    </tr>
                  </template>
                </template>
                <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
                  <tr>
                    <td :colspan="columns.length">
                      <AskAnnaButton
                        variant="text"
                        @click="toggleGroup(item)"
                        :icon="isGroupOpen(item) ? 'mdi-minus' : 'mdi-plus'"
                      />
                      {{ item.key }}: {{ item.value }}
                    </td>
                  </tr>
                </template>
                <template v-slot:bottom>
                </template>

                <template v-slot:no-data>
                  <AskAnnaAlert
                    dense
                    outlined
                    class="my-4 text-center v-flex"
                  >
                    <template v-if="search">There is no data available for this search. </template>
                    <template v-else>
                      This sheet doesn't seem to contain data, or we don't support viewing this type of data.<br />
                      In case you have a question about this, or you need support, send us a message:
                      <a
                        href="mailto:support@askanna.io"
                        target="_blank"
                      >support@askanna.io</a>
                    </template>
                  </AskAnnaAlert>
                </template>
              </VDataTable>
            </Suspense>
          </KeepAlive>
        </VWindowItem>
      </template>
    </VWindow>
  </div>
</template>

<script setup lang="ts">
import { utils, read } from 'xlsx'
import { VDataTable } from 'vuetify/labs/VDataTable'

const props = defineProps({
  fileSource: {
    type: [String, Object, Blob],
    default: () => ''
  },
  fileBlob: {
    type: Blob
  },
  images: {
    type: Array,
    default: () => []
  },
  cdnBaseUrl: {
    type: String,
    default: () => ''
  }
})

const search = ref()
const activeGroup = ref()
const defaultGroupValue = { name: 'No group by', value: [{ key: '', order: '' }] }


const currentSheet = ref('sheet')

const data = ref([
  {
    name: '',
    items: [],
    headers: []
  }
])

const groupItems = headers => {
  const items = headers.map(el => ({ name: el.title, value: [{ key: el.key, order: 'asc' }] }))

  return [defaultGroupValue, ...items]
}

const getData = () => {
  const reader = new FileReader()

  reader.readAsBinaryString(props.fileBlob)

  reader.onload = e => {
    const result = e.target.result
    const workbook = read(result, {
      type: 'binary'
    })

    data.value = workbook.SheetNames.map(name => {
      let items = utils.sheet_to_json(workbook.Sheets[name])

      if (!items || !items.length) {
        return {
          name: 'Empty',
          items: [],
          headers: []
        }
      }

      const isNoHeaderPresent = [0, 1, '0', '1'].includes(Object.keys(items[0])[0])
      const header = isNoHeaderPresent ? 1 : 0

      if (isNoHeaderPresent) {
        items = utils.sheet_to_json(workbook.Sheets[name], { header })

        const headers = Object.keys(items[0])
          .filter(key => key)
          .map(key => ({
            key,
            title: '',
            width: 'auto',
            sortable: false,
          }))


        return { name, items: items.map(el => ({ ...el })), headers, isNoHeaderPresent }
      }

      const headers = Object.keys(items[0])
        .map((key) => ({
          key,
          title: key === '__EMPTY' ? '' : key,
          sortable: true,
          width: '110px',
        }))

      return {
        name,
        items,
        headers,
        isNoHeaderPresent
      }
    })
  }
}

watchEffect(() => {
  if (!props.fileBlob) return

  getData()
})
</script>