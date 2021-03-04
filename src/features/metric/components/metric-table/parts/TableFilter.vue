<template>
  <v-menu v-model="menu" :disabled="disabled" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <span
        v-on="on"
        class="pr-5"
        :class="{ 'cursor--pointer': !disabled }"
        @mouseover="handleOnHover"
        @mouseleave="handleOnBlur"
      >
        {{ title }}
        <span v-if="!disabled" class="mr-5" style="position: relative;">
          <v-icon
            style="left: 3px; top: 1px; right: auto; position: absolute;"
            v-show="isActive"
            v-bind="attrs"
            text
            outlined
            small
            :color="getColor()"
            text-color="white"
            filter
          >
            mdi-filter-variant
          </v-icon>
        </span>
      </span>
    </template>

    <v-card>
      <v-list>
        <v-list-item-group v-model="model" @change="handleApply" color="primary">
          <v-list-item dense v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider />

      <v-list v-if="false">
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Filter by value</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list v-if="false">
            <v-list-item-group v-model="model2" multiple color="primary">
              <v-list-item dense v-for="(item, i) in values" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-list-group>
      </v-list>

      <v-card-actions v-if="false">
        <v-spacer></v-spacer>

        <v-btn small outlined text class="btn--hover" @click="menu = false">
          Cancel
        </v-btn>
        <v-btn small outlined color="secondary" text class="btn--hover" @click="handleApply">
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { ref, reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TableFilter',

  props: {
    title: {
      type: String,
      default: ''
    },
    sortBy: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props, context) {
    const items = [
      {
        sort: `${props.sortBy}`,
        text: 'Sort A -> Z',
        icon: 'mdi-sort-alphabetical-ascending'
      },
      {
        sort: `-${props.sortBy}`,
        text: 'Sort Z -> A',
        icon: 'mdi-sort-alphabetical-descending'
      }
    ]

    const menu = ref()
    const model = ref(null)
    const model2 = ref(null)
    const active = ref(false)
    const values = ref(['1001', '1176', '1201', '0.623', 'Ok'])

    const isActive = computed(() => active.value || typeof model.value === 'number' || menu.value)

    const handleOnBlur = () => (active.value = false)
    const handleOnHover = () => (active.value = true)

    const getColor = () => (typeof model.value === 'number' ? 'primary' : 'secondary')

    const handleApply = () => {
      const ordering = items[model.value] && items[model.value]['sort']
      context.emit('onSort', { ordering, limit: 100, offset: 0 })
      //menu.value = false
    }

    return {
      model2,
      menu,
      items,
      model,
      values,
      getColor,
      isActive,

      handleOnBlur,
      handleOnHover,
      handleApply
    }
  }
})
</script>
<style>
.big-json {
  max-height: 300px;
  overflow: hidden;
}

.scroll {
  height: 300px;
  width: 40px;
  overflow-y: scroll;
  display: inline-block;
}

.scroll .inner {
  height: 300%;
  width: 100%;
  content: '.';
}
.scroll.--simple::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scroll.--simple::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
.scroll.--simple::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}
.scroll.--simple::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
.scroll.--simple::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.9);
}
</style>
