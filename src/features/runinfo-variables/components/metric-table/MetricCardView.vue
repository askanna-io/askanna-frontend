<template>
  <v-container fluid px-1 mx-0>
    <v-data-iterator :items="items" hide-default-footer>
      <template v-slot:default="props">
        <v-row>
          <template v-for="(item, index) in props.items">
            <v-col v-for="(metric, index2) in item.metric" :key="`${index}-${index2}`" cols="12" sm="6" md="4" lg="3">
              <v-card height="100%">
                <v-card-title class="subheading-2 font-weight-bold">
                  {{ metric.name }}
                </v-card-title>
                <v-card-subtitle class="text-subtitle-2 font-weight-bold">
                  {{ metric.value }}
                </v-card-subtitle>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item dense v-for="(label, index3) in item.label" :key="`${index}-${index2}-${index3}`">
                    <v-list-item-content class="primary--text">
                      {{ label.name }}{{ label.value && `: ` }}
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      {{ label.value }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>
import { reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricCardView',

  props: {
    items: Array
  },

  setup(props, context) {
    return {}
  }
})
</script>
<style></style>
