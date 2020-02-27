<template>
  <v-dialog v-model="openVmodel" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title> Job name: {{ item.name }} </v-card-title>
      <v-card-text>
        <v-simple-table height="300px" dark>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Timing</td>
                <td>{{ runTimeHours(item.created, item.finished) }}</td>
              </tr>
              <tr>
                <td>CPU time</td>
                <td>{{ item.runtime }}</td>
              </tr>
              <tr>
                <td>Memory</td>
                <td>{{ item.memory }}</td>
              </tr>
              <tr>
                <td>Variables</td>
                <td>none</td>
              </tr>
              <tr>
                <td>Result</td>
                <td>{{ item.return_payload }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="openVmodel = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import useMoment from '@/core/composition/useMoment.js'
import useJobRunResults from '../composition/useJobRunResults'

export default {
  name: 'JobRunResults',

  props: {
    item: {
      type: Object,
      default: function() {
        return {
          uuid: 'ae669cb3-b76d-43f7-9d52-3997d0592224',
          payload: {
            duration: 5
          },
          status: 'SUCCESS',
          runtime: 5.027127,
          memory: 0,
          return_payload: '"Hello John!\\nYou\'vebeen sleeping for 5!"',
          stdout: null,
          created: '2020-02-24T12:23:57.062475Z',
          finished: '2020-02-24T12:23:57.063507Z'
        }
      }
    }
  },

  setup(props, context) {
    const state = useJobRunResults()
    const moment = useMoment(context)

    return {
      ...state,
      ...moment
    }
  }
}
</script>
