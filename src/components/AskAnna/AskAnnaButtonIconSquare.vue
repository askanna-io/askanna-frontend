<template>
  <VBtn
    size="x-small"
    variant="text"
    v-bind="$attrs"
    class="group/button min-w-max font-normal text-base text-secondary cursor"
    :class="{ 'hover:text-primary': $attrs.color !== 'primary' && $attrs.color !== 'white', 'rounded p-0.5': $attrs.icon }"
  >
    <AskAnnaIcon
      :icon="$attrs.icon"
      :size="$attrs.iconSize"
      :class="$attrs.iconClass"
      :color="$attrs.iconColor"
      class="hover:text-primary"
    />
    <slot />
  </VBtn>
</template>