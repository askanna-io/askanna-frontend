<template>
  <VBtn
    v-bind="$attrs"
    variant="elevated"
    :height="$vuetify.display.xs ? '40px' : '28px'"
    :size="$vuetify.display.xs ? 'default' : 'small'"
    class="group/button min-w-max hover:text-primary"
    :prependIcon="$vuetify.display.xs ? '' : $attrs.nameIcon"
  >
    <template v-if="$vuetify.display.xs">
      <AskAnnaIcon
        size="large"
        :icon="$attrs.nameIcon"
        :color="$attrs.colorIcon || 'secondary'"
      />
    </template>

    <template v-else>
      <slot />
    </template>

    <template
      v-if="$attrs.nameIcon && !$vuetify.display.xs"
      v-slot:prepend
    >
      <AskAnnaIcon
        :color="$attrs.colorIcon || 'secondary'"
        :class="{ 'group-hover/button:text-primary': $attrs.color !== 'primary' }"
      />
    </template>

    <template v-slot:loader>
      <div class="flex">{{ $attrs.loadingText }}...</div>
      <AskAnnaIcon
        icon="mdi-loading"
        class="animate-spin"
      />
    </template>
  </VBtn>
</template>