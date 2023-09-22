<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p class="whitespace-pre-wrap sm:truncate">Do you want to make <span class="text-primary">{{ peopleName
      }}</span> a workspace {{ roleInfo.title }}?</p>
    </template>
    <template v-slot:body>
      <template v-if="roleInfo.canNoLongerTitle">
        <p v-html="roleInfo.canNoLongerTitle" />
      </template>
      <template v-if="roleInfo.canNoLongerPermissions">
        <ul>
          <li
            v-for="(item, index) in roleInfo.canNoLongerPermissions"
            :key="index"
            class="mt-0 mb-0"
          >
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-if="roleInfo.canTitle">
        <p v-html="roleInfo.canTitle" />
      </template>
      <ul v-if="roleInfo.canPermissions">
        <li
          v-for="(item, index) in roleInfo.canPermissions"
          :key="index"
          class="mt-0 mb-0"
        >
          {{ item }}
        </li>
      </ul>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>

      <AskAnnaButton
        color="error"
        @click="changeRoleConfirm"
      >
        MAKE {{ $vuetify.display.xs ? '' : peopleName }} WORKSPACE {{ roleInfo.title }}
      </AskAnnaButton>
    </template>
  </AskAnnaDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  fromRole: {
    type: String,
    default: () => ''
  },
  value: {
    type: Boolean,
    default: false
  },
  peopleName: {
    type: String,
    default: () => 'this member'
  },
  isPeopleAdmin: {
    type: Boolean,
    default: false
  },
  toRole: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onChangeRoleConfirm'])

const rolesHandler = {
  from_any_to_WA: {
    title: 'admin',
    canTitle: `You are about to make <b>${props.peopleName}</b> a workspace admin. When you grant these powers, then <b>${props.peopleName}</b> can:`,
    canPermissions: [
      'Remove the workspace',
      'Create and remove projects',
      'Invite workspace admins, members and viewers',
      'Remove workspace admins, members and viewers',
      'Grant or revoke workspace admin and member powers'
    ],
    canNoLongerTitle: '',
    canNoLongerPermissions: ''
  },
  from_WA_to_WM: {
    title: 'member',
    canTitle: `As a workspace member, <b>${props.peopleName}</b> can:`,
    canNoLongerPermissions: [
      'Remove the workspace and projects',
      'Invite workspace admins',
      'Remove workspace admins, members and viewers',
      'Grant or revoke workspace admin and member powers'
    ],
    canNoLongerTitle: `You are about to make <b>${props.peopleName}</b> a workspace member. If you continue, <b>${props.peopleName}</b> is no longer a workspace admin. As a workspace member, <b>${props.peopleName}</b> can no longer:`,
    canPermissions: ['Create projects', 'Invite workspace members and viewers']
  },
  from_WA_to_WV: {
    title: 'viewer',
    canTitle: `As a workspace viewer, <b>${props.peopleName}</b> can:`,
    canPermissions: ['View projects and people'],
    canNoLongerTitle: `You are about to make <b>${props.peopleName}</b> a workspace viewer. If you continue, <b>${props.peopleName}</b> is no longer a workspace admin. As a workspace viewer, <b>${props.peopleName}</b> can no longer:`,
    canNoLongerPermissions: [
      'Remove the workspace',
      'Create and remove projects',
      'Invite workspace admins, members and viewers',
      'Remove workspace admins, members and viewers',
      'Grant or revoke workspace admin and member powers'
    ]
  },
  from_WM_to_WV: {
    title: 'viewer',
    canNoLongerTitle: `You are about to make <b>${props.peopleName}</b> a workspace viewer. If you continue, <b>${props.peopleName}</b> is no longer a workspace member. As a workspace viewer, <b>${props.peopleName}</b> can no longer:`,
    canNoLongerPermissions: ['Create projects', 'Invite workspace members and viewers'],
    canTitle: `As a workspace viewer, <b>${props.peopleName}</b> can:`,
    canPermissions: ['View projects and people']
  },
  from_WV_to_WM: {
    title: 'member',
    canNoLongerTitle: '',
    canNoLongerPermissions: '',
    canTitle: `You are about to make <b>${props.peopleName}</b> a workspace member. When you grant these powers, then <b>${props.peopleName}</b> can:`,
    canPermissions: [
      'Create projects',
      'Invite workspace members and viewers',
      'Grant or revoke workspace member powers'
    ]
  }
}

const roleInfo = computed(() => {
  const fromRole = props.toRole === 'WA' ? 'any' : props.fromRole
  const roleFromTo = `from_${fromRole}_to_${props.toRole}`

  return rolesHandler[roleFromTo]
})

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const changeRoleConfirm = () => emit('onChangeRoleConfirm', props.toRole)
</script>
