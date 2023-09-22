<template>
  <VBtn
    size="small"
    v-bind="$attrs"
    variant="outlined"
    class="group/button min-w-max"
    :class="{ 'hover:text-primary': $attrs.color !== 'primary' && $attrs.color !== 'white' }"
  >
    <template v-if="$attrs.icon">
      <AskAnnaIcon
        :icon="$attrs.icon"
        :class="$attrs.classIcon"
        :color="$attrs.colorIcon || 'secondary'"
      />
    </template>
    <template
      v-if="$attrs.prependIcon"
      v-slot:prepend
    >
      <AskAnnaIcon
        :color="$attrs.colorIcon || 'secondary'"
        :class="{ 'group-hover/button:text-primary': $attrs.color !== 'primary' }"
      />
    </template>
    <template v-slot:loader>
      <div
        v-if="$attrs.loadingText"
        class="flex"
      >{{ $attrs.loadingText }}...</div>
      <AskAnnaIcon
        icon="mdi-loading"
        class="animate-spin"
      />
    </template>
    <slot />
  </VBtn>
</template>
