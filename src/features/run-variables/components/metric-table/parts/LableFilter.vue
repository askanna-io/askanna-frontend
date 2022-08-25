<template>
  <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" nudge-right="60">
    <template v-slot:activator="{ on, attrs }">
      <v-row v-on="on" @mouseover="handleOnHover" @mouseleave="handleOnBlur">
        <v-col class="pt-0">
          {{ title }}
          <v-icon v-if="false" v-bind="attrs" text outlined small :color="colorComputed" text-color="white" filter>
            mdi-filter-variant
          </v-icon>
        </v-col>
      </v-row>
    </template>

    <v-card>
      <v-list>
        <v-list-item-group v-model="model" color="primary">
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
    </v-card>
  </v-menu>
</template>

<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'LableFilter',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const items = [
      {
        icon: 'mdi-sort-alphabetical-ascending',
        text: 'Sort A -> Z'
      },
      {
        icon: 'mdi-sort-alphabetical-descending',
        text: 'Sort Z -> A'
      }
    ]

    const model = ref(null)
    const model2 = ref(null)

    const menu = ref()

    const message = ref()

    const selectedValue = ref([])

    const active = ref(false)

    const isActive = computed(() => active.value || typeof model.value === 'number' || menu.value)

    const colorComputed = computed(() => {
      if (isActive.value) {
        return typeof model.value === 'number' ? 'primary' : 'secondary'
      }

      return 'grey lighten-5'
    })

    const handleOnBlur = () => (active.value = false)
    const handleOnHover = () => (active.value = true)

    return {
      model2,
      menu,
      items,
      model,
      message,
      isActive,
      selectedValue,
      colorComputed,

      handleOnBlur,
      handleOnHover
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
