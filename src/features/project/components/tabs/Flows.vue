<template>
  <v-container class="grey lighten-5" fluid>
    <v-row v-for="flow in flows" :key="flow.id" no-gutters justify="center">
      <v-col cols="5"><Flow :flow="flow"/></v-col></v-row
  ></v-container>
</template>

<script>
import Flow from '../flow/Flow'
export default {
  name: 'Flows',

  components: { Flow },

  data() {
    return {
      flows: [
        {
          id: 0,
          name: 'Flow 1',
          expanded: true,
          status: {
            running: true
          },
          jobs: [
            {
              id: 0,
              name: 'Test',
              status: true,
              inputThroughput: '12'
            },
            {
              id: 1,
              name: 'Build',
              inputQueue: 0,
              status: false,
              inputThroughput: '14'
            },
            {
              id: 2,
              name: 'Job 1',
              inputQueue: 0,
              status: true,
              inputThroughput: '150'
            },
            {
              id: 3,
              name: 'Job 3',
              inputQueue: 1,
              status: true,
              inputThroughput: '500'
            }
          ]
        },
        {
          id: 2,
          name: 'Flow 2',
          expanded: false,
          status: {
            running: false
          },
          jobs: [
            {
              id: 0,
              name: 'Test',
              status: true,
              inputThroughput: '12'
            },
            {
              id: 1,
              name: 'Build',
              inputQueue: 0,
              status: false,
              inputThroughput: '14'
            },
            {
              id: 2,
              name: 'Job 1',
              inputQueue: 0,
              status: true,
              inputThroughput: '150'
            },
            {
              id: 3,
              name: 'Job 3',
              inputQueue: 1,
              status: true,
              inputThroughput: '500'
            }
          ]
        }
      ]
    }
  }
}
</script>
