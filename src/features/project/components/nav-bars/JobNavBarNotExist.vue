<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <AskAnnaToolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <VBreadcrumbs :items="breadcrumbs" class="pl-0">
          <template v-slot:item="{ item }">
            <VBreadcrumbsItem :to="item.to" :exact="item.exact">
              {{ item.title }}
            </VBreadcrumbsItem>
          </template>
        </VBreadcrumbs>
        <AskAnnaSpacer />
      </AskAnnaToolbar>

      <AskAnnaCard :flat="!sticked" v-if="sticked" :class="{ 'ma-3': sticked }">
        <AskAnnaDivider v-if="!sticked" />
        <AskAnnaSlideYTransition>
          <ProjectToolBar v-if="sticked" :projectName="project.name" />
        </AskAnnaSlideYTransition>
      </AskAnnaCard>
    </div>
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <VBreadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" :exact="item.exact">
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  job: {
    type: Object,
    default: function () {
      return {
        name: ''
      }
    }
  },
  project: {
    type: Object,
    default: function () {
      return {
        name: ''
      }
    }
  },
  sticked: {
    type: Boolean,
    default: false
  },

  handleOnStick: {
    type: Function,
    default: () => {}
  }
})

const breadcrumbs = useBreadcrumbs({ start: 0, end: 5 })

const onStick = data => props.handleOnStick(data.sticked)
</script>
