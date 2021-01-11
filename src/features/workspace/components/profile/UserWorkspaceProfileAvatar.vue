<template>
  <v-row dense justify="start">
    <v-col class="pt-0 pb-0" cols="12" align-self="start">
      <v-avatar rounded="21" :size="false ? 150 : 150" tile>
        <v-img v-if="false" class="img--rounded" :src="people.avatar" />
        <v-img v-else class="img--rounded" src="@/assets/icons/ask-annna-default-gravatar.png" />
      </v-avatar>
    </v-col>
    <v-col cols="1" v-if="false">
      <v-btn x-small outlined text color="secondary" class="ma-2 btn--hover" @click="handleSave">
        Change my image
      </v-btn>
      <v-btn x-small outlined text color="secondary" class="ma-2 btn--hover" @click="handleSave">
        Remove my image
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { ref, toRefs, reactive, computed, defineComponent } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'

export default defineComponent({
  name: 'UserWorkspaceProfileAvatar',

  props: {
    projectData: {
      type: Object,
      default: function () {
        return {
          name: '',
          workspace: '',
          template: ''
        }
      }
    },
    projectTemplates: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  setup(props, context) {
    const validationRules = useValidationRules()
    const isShowPassword = ref(false)

    const formData = reactive({
      name: 'Robbert',
      title: 'Super admin of Askanna'
    })

    const errorData = reactive({
      error: { name: '', title: '' }
    })

    const reset = () => loginForm.value.reset()
    const resetValidation = () => loginForm.value.resetValidation()
    const resetError = () => {
      errorData.error = { name: '', title: '' }
    }

    const handleSave = () => ''

    return {
      handleSave,
      isShowPassword,
      ...toRefs(formData),
      ...toRefs(errorData),
      RULE: validationRules.RULES
    }
  }
})
</script>
