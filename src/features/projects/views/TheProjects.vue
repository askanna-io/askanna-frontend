<template>
  <v-row align="start">
    <v-subheader> <div class="title ma-2">Welcome to Projects</div> </v-subheader>

    <v-expansion-panels>
      <v-expansion-panel v-for="(message, i) in messages" :key="i" hide-actions>
        <v-expansion-panel-header>
          <v-row align="center" class="spacer" no-gutters>
            <v-col cols="4" sm="2" md="1">
              <v-avatar size="36px">
                <v-icon :color="message.color" v-text="message.icon"></v-icon>
              </v-avatar>
            </v-col>

            <v-col class="hidden-xs-only" sm="5" md="3">
              <strong v-html="message.name"></strong>
              <span v-if="message.total" class="grey--text"> &nbsp;({{ message.total }}) </span>
            </v-col>

            <v-col class="text-no-wrap" cols="5" sm="3">
              <v-chip v-if="message.new" :color="`${message.color} lighten-4`" class="ml-0" label small>
                {{ message.new }} jobs fails
              </v-chip>
              <strong v-html="message.title"></strong>
            </v-col>

            <v-col v-if="message.excerpt" class="grey--text text-truncate hidden-sm-and-down">
              &mdash;
              {{ message.excerpt }}
            </v-col>
            <v-col>
              <v-btn
                v-if="!chip1 && !chip2 && !chip3 && !chip4"
                close
                color="primary"
                dark
                @click=";(chip1 = true), (chip2 = true), (chip3 = true), (chip4 = true)"
              >
                Reset Chips
              </v-btn>

              <v-chip v-if="chip1" class="ma-2" close @click:close="chip1 = false">
                Closable
              </v-chip>

              <v-chip v-if="chip2" class="ma-2" close color="red" text-color="white" @click:close="chip2 = false">
                Remove
              </v-chip>

              <v-chip v-if="chip3" class="ma-2" close color="green" outlined @click:close="chip3 = false">
                Success
              </v-chip>

              <v-chip v-if="chip4" class="ma-2" close color="orange" label outlined @click:close="chip4 = false">
                Complete
              </v-chip>
            </v-col>
          </v-row>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-divider></v-divider>
          <v-card-text v-text="lorem"></v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
export default {
  name: 'TheDashboard',
  data: () => ({
    chip1: true,
    chip2: true,
    chip3: true,
    chip4: true,
    messages: [
      {
        avatar: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
        icon: 'far fa-folder',
        name: 'AskaAnna frontend',
        title: 'All jobs done',
        excerpt: ''
      },
      {
        color: 'red',
        icon: 'far fa-folder',
        name: 'AskaAnna backend',
        new: 1,
        total: 3,
        title: 'Build'
      },
      {
        color: 'teal',
        icon: 'far fa-folder',
        name: 'AskAnna gitLabIssueReporter',
        new: 2,
        total: 4,
        title: 'Check the issue',
        exceprt: 'New deals available, Join Today'
      }
    ],
    lorem:
      'Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.'
  })
}
</script>
