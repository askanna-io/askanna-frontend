<template>
  <v-dialog v-model="valueModel" max-width="650px">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar
        flat
        white--text
        color="white"
        :dense="!$vuetify.breakpoint.xsOnly"
        :height="calcHeight($vuetify.breakpoint.xsOnly)"
      >
        <v-toolbar-title class="px-0 toolbar-title" v-if="!$vuetify.breakpoint.xsOnly">
          <div class="grid-container">
            <div class="pre">
              Do you want to make
              <span class="long primary--text">{{ peopleName }}</span> a workspace
            </div>
            <div>{{ roleInfo.title }}</div>
            <div class="mark pre">?</div>
          </div>
        </v-toolbar-title>
        <div v-else class="text-body-1 font-weight-bold">
          Do you want to make <span class="primary--text">{{ peopleName }}</span> a workspace {{ roleInfo.title }}?
        </div>
        <v-spacer />
        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <template v-if="roleInfo.canNoLongerTitle">
          <span v-html="roleInfo.canNoLongerTitle" />
          <br />
          <br />
        </template>
        <template v-if="roleInfo.canNoLongerPermissions">
          <ul>
            <li v-for="(item, index) in roleInfo.canNoLongerPermissions" :key="index">
              {{ item }}
            </li>
          </ul>
          <br />
        </template>
        <template v-if="roleInfo.canTitle">
          <span v-html="roleInfo.canTitle" />
        </template>
        <br />
        <br />
        <ul v-if="roleInfo.canPermissions">
          <li v-for="(item, index) in roleInfo.canPermissions" :key="index">
            {{ item }}
          </li>
        </ul>
        <br />
      </v-card-text>
      <v-card-actions :class="{ 'px-3': $vuetify.breakpoint.xsOnly }">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text :color="colorBtn" class="mr-1 btn--hover" @click="changeRoleConfirm">
          MAKE {{ $vuetify.breakpoint.xsOnly ? '' : peopleName }} WORKSPACE {{ roleInfo.title }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    default: () => ''
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

const colorBtn = computed(() => (props.isPeopleAdmin ? 'error' : 'secondary'))

const calcHeight = isMobile => {
  let height = 50

  height = isMobile ? 50 + props.peopleName.length : 50

  return height
}

const closeDelete = () => emit('onClose')
const changeRoleConfirm = () => emit('onChangeRoleConfirm', props.toRole)
</script>
<style>
.pre {
  white-space: pre;
  display: flex;
}

.mark {
  color: rgba(0, 0, 0, 0.87);
}

.grid-container {
  display: grid;
  grid-template-columns: 0fr auto 0fr;
}

.long {
  max-width: 175px;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
}
</style>
