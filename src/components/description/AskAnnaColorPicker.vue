<template>
  <VMenu top v-model="menu" :nudge-top="25" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <AskAnnaTooltip top>
        <template v-slot:activator="{ on: onHover }">
          <span v-on="onHover">
            <AskAnnaButton
              v-bind="attrs"
              v-on="on"
              dark
              icon
              x-small
              text
              color="secondary"
              class="btn--hover btn--without-text mr-3"
              :class="{ 'pt-1': $vuetify.breakpoint.xsOnly }"
            >
              <AskAnnaIcon>mdi-format-color-fill</AskAnnaIcon>
            </AskAnnaButton>
          </span>
        </template>
        <span>Highlight</span>
      </AskAnnaTooltip>
    </template>
    <AskAnnaCard width="140px" flat class="px-2 pt-2">
      <AskAnnaRow no-gutters>
        <AskAnnaCol cols="12" class="color-picker-col">
          <template v-for="item in swatches">
            <AskAnnaButton
              :key="item"
              x-small
              depressed
              :color="item"
              class="btn--hover btn--without-text color--accent-2"
              @click="handleOnIputColor(item)"
            >
            </AskAnnaButton>
          </template>
        </AskAnnaCol>
        <AskAnnaCol cols="12" class="py-2">
          <AskAnnaButton block x-small depressed outlined text class="btn--hover" @click="handleClose">
            No highlight
          </AskAnnaButton>
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaCard>
  </VMenu>
</template>

<script setup lang="ts">
const emit = defineEmits(['onChangeColor', 'onUnsetColor'])

const swatches = ['#ff7872', '#faed7a', '#49b0ad', '#ffb385', '#9e9e9e']

const menu = ref(false)
const selectedColor = ref('#ffffff')

const handleOnIputColor = (color: string) => {
  selectedColor.value = color
  emit('onChangeColor', color)
}

const handleClose = () => {
  menu.value = false
  selectedColor.value = '#ffffff'

  emit('onUnsetColor')
}

watch(menu, menu => {
  if (!menu) selectedColor.value = '#ffffff'
})
</script>

<style lang="scss">
.color-picker-col {
  display: flex;
  justify-content: space-around;

  .v-btn:not(.v-btn--round).v-size--x-small {
    min-width: 20px;
    width: 20px;
  }
}
</style>
