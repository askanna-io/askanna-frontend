<template>
  <AskAnnaButton
    v-if="!$vuetify.display.xs"
    @click="handleScrollToTop()"
    prependIcon="mdi-arrow-up-bold"
    :class="{ 'hidden': !isShowButton }"
  >
    Scroll to top
  </AskAnnaButton>
</template>

<script setup>
const isShowButton = ref(false)

const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}


const scrollFunction = () => {
  if (
    document.body.scrollTop > 145 ||
    document.documentElement.scrollTop > 145
  ) {
    isShowButton.value = true
  } else {
    isShowButton.value = false
  }
}

window.addEventListener("scroll", scrollFunction)
</script>