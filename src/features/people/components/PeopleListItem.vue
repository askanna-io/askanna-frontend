<template>
  <AskAnnaCard
    link
    :elevation="hover ? 12 : 6"
    class="h-20 mx-auto py-2 cursor-pointer"
  >
    <VListItem class="w-100">
      <template v-slot:prepend>
        <AskAnnaAvatar
          size="x-large"
          :image="people.avatar.small"
        />
      </template>
      <VListItemTitle class="font-medium">{{ people.name || people.email }}</VListItemTitle>
      <VListItemTitle class="first-letter:capitalize lowercase">{{ people.role.name }}</VListItemTitle>

      <template v-slot:append>
        <div class="justify-end">
          <AskAnnaIcon
            v-if="statusColor"
            :color="statusColor"
            icon="mdi-email-arrow-right-outline"
          />
        </div>
      </template>
    </VListItem>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const props = defineProps({
  people: {
    type: Object,
    default: function () {
      return {
        suuid: '',
        name: '',
        role: '',
        status: '',
        created_at: '',
        modified_at: '',
        job_title: '',
        last_active: ''
      }
    }
  },
  hover: {
    type: Boolean,
    default: false
  },
})

const statusColor = computed(() => props.people.status === 'invited' && 'accent')
</script>