<template>
  <v-card flat class="px-3 mt-2 br-none" outlined><the-jobs /></v-card>
</template>

<script>
import TheJobs from '@/features/jobs/views/TheJobs'

export default {
  name: 'RunsCode',

  components: {
    TheJobs
  }
}
</script>
