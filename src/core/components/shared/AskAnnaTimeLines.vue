<template>
  <v-container>
    <div class="d-flex justify-center">
      <div>
        <h3>
          <span class="grey--text text--darken-2">Today</span>
        </h3>
      </div>
    </div>
    <v-timeline clipped>
      <v-timeline-item class="mb-4" color="grey" icon-color="grey lighten-2" small>
        <v-row justify="space-between" no-gutters>
          <v-col cols="12"
            >dAAp
            <v-divider></v-divider>
          </v-col>
          <v-col>
            <v-list three-line>
              <template v-for="(item, index) in items">
                <v-subheader v-if="item.header" :key="item.header" v-text="item.header"></v-subheader>

                <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

                <v-list-item v-else :key="item.title">
                  <v-list-item-action-text v-text="'1:45pm'"></v-list-item-action-text>
                  <v-list-item-avatar class="mx-3">
                    <v-img :src="item.avatar"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <div class="secondary--text" v-html="item.description"></div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4" color="grey" icon-color="grey lighten-2" small>
        <v-row justify="space-between" no-gutters>
          <v-col cols="12"
            >AskAnna HQ
            <v-divider></v-divider>
          </v-col>
          <v-col>
            <v-list three-line>
              <template v-for="(item, index) in items2">
                <v-subheader v-if="item.header" :key="item.header" v-text="item.header" />
                <v-divider v-else-if="item.divider" :key="index" :inset="item.inset" />
                <v-list-item v-else :key="item.title">
                  <v-list-item-action-text v-text="'1:45pm'"></v-list-item-action-text>
                  <v-list-item-avatar class="mx-3">
                    <v-img :src="item.avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <div class="secondary--text" v-html="item.description"></div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4" small>
        <v-row justify="space-between">
          <v-col cols="7">
            <v-chip class="white--text ml-0" color="purple" label small>
              Project 1
            </v-chip>
            All jobs were fulfilled .
          </v-col>
          <v-col class="text-right" cols="5">12:25 EDT</v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4" color="grey" small>
        <v-row justify="space-between">
          <v-col class="text-left" cols="3">13:25 EDT</v-col>
          <v-col cols="3" class="text-left">
            AskAnna Bot
          </v-col>
          <v-col cols="6">
            Report email was sent to Robbert (robbert@askanna.io).
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item class="mb-4" hide-dot>
        <v-btn class="mx-0" color="white">
          Resend Email
        </v-btn>
      </v-timeline-item>
    </v-timeline>
    <div class="d-flex justify-center">
      <div>
        <h3>
          <span class="grey--text text--darken-2">Yesterday</span>
        </h3>
      </div>
    </div>
    <v-timeline clipped>
      <v-timeline-item class="mb-4" color="grey" icon-color="grey lighten-2" small>
        <v-row justify="space-between" no-gutters>
          <v-col cols="12"
            >AskAnna HQ
            <v-divider></v-divider>
          </v-col>
          <v-col>
            <v-list three-line>
              <template v-for="(item, index) in items3">
                <v-subheader v-if="item.header" :key="item.header" v-text="item.header"></v-subheader>

                <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

                <v-list-item v-else :key="item.title">
                  <v-list-item-action-text v-text="'1:45pm'"></v-list-item-action-text>
                  <v-list-item-avatar class="mx-3">
                    <v-img :src="item.avatar"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <div class="secondary--text" v-html="item.description"></div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AskAnnaTimeLines extends Vue {
  @Prop({ required: true })
  public text!: string

  get items() {
    const items = [
      {
        avatar: 'content/avatars/robert.gif',
        title: `<h4 class="activity-item__what">
      Robbert commented on
      <a class="decorated" href="/4281589/buckets/14710304/todos/2412190293#__recording_2412196691">Add onboarding story to AskAnna Global</a>
    </h4>`,
        description: `
        
  Started the morning with bugfixing the database of mvizet, adding the missing sequences
- Management on MR mvizet and shotgun
- basic setup of docker-compose for scenario 2 (test build of front-end) with resolving to domain names locally (web.askanna.localhost and api.askanna.localhost) ! Works i...


      `
      },
      { divider: true, inset: true },
      {
        avatar: 'content/avatars/robert.gif',
        title: `<h4 class="activity-item__what">
      Andrii S. answered:
      <a class="decorated" href="/4281589/buckets/13602999/question_answers/2409478225">What did you work on today?</a>
    </h4>`,
        description: `
       
  • refactored the Login page, combine Sign in and sign in&nbsp; via Google in one section, delete useless text
• create a google icon component
• started work on the workspace view

[Peek 2020-02-12 17-51.mp4]
[askanna-frontend-workspace1.png]

    
      `
      }
    ]

    return items
  }

  get items2() {
    const items = [
      {
        avatar: 'content/avatars/antonis.gif',
        title: `<h4 class="activity-item__what">
      Robbert commented on
      <a class="decorated" href="/4281589/buckets/14710304/todos/2412190293#__recording_2412196691">Add onboarding story to AskAnna Global</a>
    </h4>`,
        description: `
        I have added an initial story for the onboarding of a new user. It describes a potential flow and some ideas I have. Andrii Anthony Antonis, please check it out, add feedback, share ideas, etc.

      If you agree, please add an approval so we can merge it. If the merge request is already merged, you c...
      `
      },
      { divider: true, inset: true },
      {
        avatar: 'content/avatars/robert.gif',
        title: `<h4 class="activity-item__what">
      Robbert commented on
      <a class="decorated" href="/4281589/buckets/13602999/question_answers/2409478225#__recording_2411741763">Andrii S.’s answer to “What did you work on today?”</a>
    </h4>`,
        description: `
       Good improvement regarding the login page. Also great to see that you started with the workspace view. If you want feedback, please let me know!
      `
      }
    ]

    return items
  }

  get items3() {
    const items = [
      {
        avatar: 'content/avatars/anthony.gif',
        title: `<h4 class="activity-item__what">
      Robbert commented on
      <a class="decorated" href="/4281589/buckets/14710304/todos/2412190293#__recording_2412196691">Add onboarding story to AskAnna Global</a>
    </h4>`,
        description: `
        I have added an initial story for the onboarding of a new user. It describes a potential flow and some ideas I have. Andrii Anthony Antonis, please check it out, add feedback, share ideas, etc.

      If you agree, please add an approval so we can merge it. If the merge request is already merged, you c...
      `
      },
      { divider: true, inset: true },
      {
        avatar: 'content/avatars/andrii.gif',
        title: `<h4 class="activity-item__what">
      Robbert commented on
      <a class="decorated" href="/4281589/buckets/13602999/question_answers/2409478225#__recording_2411741763">Andrii S.’s answer to “What did you work on today?”</a>
    </h4>`,
        description: `
       Good improvement regarding the login page. Also great to see that you started with the workspace view. If you want feedback, please let me know!
      `
      }
    ]

    return items
  }
}
</script>
