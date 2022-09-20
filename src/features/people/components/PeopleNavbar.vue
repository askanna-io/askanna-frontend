<template>
  <div>
    <v-card
      class="mx-auto"
      flat
      sticky-container
      :outlined="!$vuetify.breakpoint.xsOnly"
      :class="{ 'mb-1': $vuetify.breakpoint.xsOnly, 'mb-3': !$vuetify.breakpoint.xsOnly }"
    >
      <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
        <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
          <v-breadcrumbs v-if="sticked" class="pl-0" :items="breadcrumbs">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :to="item.to" :exact="item.exact">
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-toolbar>
      </div>
      <v-breadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :exact="item.exact">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-card>
  </div>
</template>
<script setup lang="ts">
const projectStore = useProjectStore()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 3 })

const sticked = computed(() => projectStore.menu.sticked)

const onStick = data => {
  projectStore.menu.isSticked = data.sticked
  if (!data.sticked) projectStore.menu.sticked = false
}
</script>
