<template>
  <v-menu top v-model="menu" :nudge-top="25" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-tooltip top>
        <template v-slot:activator="{ on: onHover }">
          <div v-on="onHover">
            <v-btn
              v-bind="attrs"
              v-on="on"
              dark
              icon
              x-small
              text
              color="secondary"
              class="btn--hover btn--without-text mr-3"
            >
              <v-icon>mdi-format-color-fill</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Highlight</span>
      </v-tooltip>
    </template>
    <v-card width="140px" flat class="px-2 pt-2">
      <v-row no-gutters>
        <v-col cols="12" class="color-picker-col">
          <template v-for="item in swatches">
            <v-btn
              :key="item"
              x-small
              depressed
              :color="item"
              class="btn--hover btn--without-text color--accent-2"
              @click="handleOnIputColor(item)"
            >
            </v-btn>
          </template>
        </v-col>
        <v-col cols="12" class="py-2">
          <v-btn block x-small depressed outlined text class="btn--hover" @click="handleClose">
            No highlight
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
import { ref, watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaColorPicker',

  setup(_, context) {
    const swatches = ['#ff7872', '#faed7a', '#49b0ad', '#ffb385', '#9e9e9e']

    const menu = ref(false)
    const selectedColor = ref('#ffffff')

    const handleOnIputColor = color => {
      selectedColor.value = color
      context.emit('onChangeColor', color)
    }

    const handleClose = () => {
      menu.value = false
      selectedColor.value = '#ffffff'

      context.emit('onUnsetColor')
    }

    watch(menu, menu => {
      if (!menu) handleOnIputColor('#ffffff')
    })

    return {
      menu,
      swatches,
      selectedColor,

      handleClose,
      handleOnIputColor
    }
  }
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
