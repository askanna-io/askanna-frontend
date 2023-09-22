<template>
  <VMenu
    location="top"
    v-model="menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        v-bind="props"
        variant="plain"
        density="compact"
        class="mr-4 opacity-100 z-10"
        icon="mdi-format-color-fill"
      >
        <AskAnnaTooltip>Highlight</AskAnnaTooltip>
      </AskAnnaButton>
    </template>

    <AskAnnaCard width="140px">
      <div class="p-2">
        <div class="flex justify-between">
          <template
            v-for="item in swatches"
            :key="item"
          >
            <AskAnnaButton
              class="w-5"
              size="x-small"
              :color="item"
              variant="flat"
              @click="handleOnIputColor(item)"
            >
            </AskAnnaButton>
          </template>
        </div>
        <AskAnnaButton
          size="x-small"
          class="w-full mt-1"
          @click="handleClose"
        >
          No highlight
        </AskAnnaButton>
      </div>
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