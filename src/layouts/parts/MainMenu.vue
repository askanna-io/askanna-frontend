<template>
  <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
    <AskAnnaFlex>
      <WorkspacesMenu />
      <ProjectsMenu />
    </AskAnnaFlex>
  </div>
</template>

<script setup lang="ts">
import ProjectsMenu from './ProjectsMenu.vue'
import WorkspacesMenu from './WorkspacesMenu.vue'
</script>
<style lang="scss">
.askAnna-main-menu {
  width: 530px;
  font-size: 16px !important;
  .table-link,
  .v-list-item__title,
  .v-text-field__slot .v-label,
  .v-text-field__slot input {
    font-size: 16px !important;
  }
  .v-data-table__wrapper td {
    padding-left: 6px !important;
  }
  .v-alert__border {
    border-width: 2px !important;
  }
  .v-skeleton-loader__heading {
    width: 100%;
    margin-bottom: 10px;
  }
  .v-btn--plain.v-btn--active:not(.v-btn--loading):not(:focus):not(:hover) .v-btn__content {
    opacity: 0.62;
  }
}
</style>
