<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pt-0">
      <package-list
        :items="projectPackages"
        @handleHistory="handleHistory"
        @handleClickRow="handleClickRow"
        @handleDownload="handleDownload"
    /></v-col>
  </v-row>
</template>

<script>
import usePackages from '../composition/usePackages'
import { defineComponent } from '@vue/composition-api'
import PackageList from '../components/PackageList.vue'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'ThePackages',

  components: { PackageList },

  setup(props, context) {
    const packages = usePackages(context)
    const forceFileDownload = useForceFileDownload()

    const handleClickRow = uuid =>
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid',
        params: { projectId: context.root.$route.params.projectId, packageId: uuid, versionId: '1' }
      })

    const handleDownload = async packageData => {
      const source = await packages.downloadPackage({
        projectId: packageData.project,
        packageId: packageData.uuid
      })
      forceFileDownload.trigger({ source, name: packageData.filename })
    }

    const handleHistory = ({ project_id, uuid }) => {
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-history',
        params: { projectId: project_id, packageId: uuid, versionId: '1' }
      })
    }

    return {
      ...packages,
      handleHistory,
      handleClickRow,
      handleDownload
    }
  }
})
</script>
