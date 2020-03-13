<template>
  <v-card flat class="mx-3 mt-2" outlined><the-jobs /></v-card>
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
