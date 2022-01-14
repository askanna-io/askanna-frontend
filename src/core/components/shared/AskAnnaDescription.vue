<template>
  <FullScreen :title="title" :value="isFullScreen" @onSave="handleOnSave" @onExitFullScreen="handleExitFullScreen">
    <form
      @focusout="handleOnBlurWrapper"
      @focusin="handleOnClickWrapper"
      @click="handleOnClickWrapper"
      :class="{ 'mt-5 pt-6': isFullScreen }"
    >
      <v-card
        class="ask-anna--editor"
        flat
        :outlined="
          (outlined && $vuetify.breakpoint.xsOnly && !isFullScreen) || (outlined && !$vuetify.breakpoint.xsOnly)
        "
        :class="{
          'mt-3 mb-4 full-screen-mode': isFullScreen,
          'border--primary ':
            (isFocused && outlined && !$vuetify.breakpoint.xsOnly) ||
            (isFocused && outlined && $vuetify.breakpoint.xsOnly && !isFullScreen)
        }"
      >
        <label
          v-if="title && !isFullScreen"
          class="ask-anna-descriptio--title v-label theme--light px-1"
          :class="{ 'v-label--active': isFocused }"
          >{{ title }}</label
        >
        <div v-if="editor && editable">
          <component
            v-bind:is="$vuetify.breakpoint.xsOnly ? 'div' : 'v-toolbar'"
            dense
            height="30px"
            :flat="!sticked"
            v-sticky="false"
            on-stick="onStick"
            sticky-offset="{top: 45, bottom: 12}"
            :class="{ 'mx-1 mt-2': !sticked }"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('bold')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('bold') }"
                  @click="editor.chain().focus().toggleBold().run()"
                  :color="editor.isActive('bold') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-bold</v-icon>
                </v-btn>
              </template>
              <span>Bold</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('italic')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('italic') }"
                  @click="editor.chain().focus().toggleItalic().run()"
                  :color="editor.isActive('italic') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-italic</v-icon>
                </v-btn>
              </template>
              <span>Italic</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('underline')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('underline') }"
                  @click="editor.chain().focus().toggleUnderline().run()"
                  :color="editor.isActive('underline') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-underline</v-icon>
                </v-btn>
              </template>
              <span>Underline</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-1"
                  :text="!editor.isActive('strike')"
                  :class="{ 'is-active': editor.isActive('strike') }"
                  @click="editor.chain().focus().toggleStrike().run()"
                  :color="editor.isActive('strike') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-strikethrough</v-icon>
                </v-btn>
              </template>
              <span>Strikethrough</span>
            </v-tooltip>

            <AskAnnaColorPicker @onUnsetColor="handleUnsetHighlight" @onChangeColor="handleOnChangeColor" />

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('paragraph')"
                  class="btn--hover btn--without-text mr-1"
                  @click="editor.chain().focus().setParagraph().run()"
                  :class="{ 'is-active': editor.isActive('paragraph') }"
                  :color="editor.isActive('paragraph') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-paragraph</v-icon>
                </v-btn>
              </template>
              <span>Paragraph</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-1"
                  :text="!editor.isActive('heading', { level: 1 })"
                  :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                  @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                  :color="editor.isActive('heading', { level: 1 }) ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-header-1</v-icon>
                </v-btn>
              </template>
              <span>Header 1</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-1"
                  :text="!editor.isActive('heading', { level: 2 })"
                  :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  :color="editor.isActive('heading', { level: 2 }) ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-header-2</v-icon>
                </v-btn>
              </template>
              <span>Header 2</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-3"
                  :text="!editor.isActive('heading', { level: 3 })"
                  :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                  @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                  :color="editor.isActive('heading', { level: 3 }) ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-header-3</v-icon>
                </v-btn>
              </template>
              <span>Header 3</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('bulletList')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('bulletList') }"
                  @click="editor.chain().focus().toggleBulletList().run()"
                  :color="editor.isActive('bulletList') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-btn>
              </template>
              <span>Bulleted list</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('orderedList')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('orderedList') }"
                  @click="editor.chain().focus().toggleOrderedList().run()"
                  :color="editor.isActive('orderedList') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-list-numbered</v-icon>
                </v-btn>
              </template>
              <span>Numeric list</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('taskList')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('taskList') }"
                  @click="editor.chain().focus().toggleTaskList().run()"
                  :color="editor.isActive('taskList') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-list-checks</v-icon>
                </v-btn>
              </template>
              <span>Task list</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text mr-3"
                  @click="editor.chain().focus().setHorizontalRule().run()"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
              <span>Horizontal divider</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('blockquote')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('blockquote') }"
                  @click="editor.chain().focus().toggleBlockquote().run()"
                  :color="editor.isActive('blockquote') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-format-quote-close</v-icon>
                </v-btn>
              </template>
              <span>Quote</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('code')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('code') }"
                  @click="editor.chain().focus().toggleCode().run()"
                  :color="editor.isActive('code') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>Code</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('codeBlock')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('codeBlock') }"
                  @click="editor.chain().focus().toggleCodeBlock().run()"
                  :color="editor.isActive('codeBlock') ? 'primary' : 'secondary'"
                >
                  <v-icon>mdi-code-braces</v-icon>
                </v-btn>
              </template>
              <span>Code block</span>
            </v-tooltip>

            <AskAnnaLinkMenu
              :open="isSetLinkOpen"
              :isActive="editor.isActive('link')"
              @onSetLink="handleSetLink"
              @onOpen="handleOpenSetLink"
            />

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text mr-1"
                  @click="editor.chain().focus().undo().run()"
                >
                  <v-icon>mdi-undo</v-icon>
                </v-btn>
              </template>
              <span>Undo</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text mr-3"
                  @click="editor.chain().focus().redo().run()"
                >
                  <v-icon>mdi-redo</v-icon>
                </v-btn>
              </template>
              <span>Redo</span>
            </v-tooltip>

            <v-spacer v-if="!$vuetify.breakpoint.xsOnly" />
            <a
              class="ask-anna-link body-2"
              target="_blank"
              href="https://docs.askanna.io/shortcuts-editor/"
              @click.stop
            >
              Markdown supported
            </a>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text ml-2"
                  @click="handleFullScreen"
                >
                  <v-icon>{{ isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ isFullScreen ? 'Exit full screen' : 'Full screen' }}</span>
            </v-tooltip>
          </component>
        </div>
        <v-divider v-show="editable" class="" />

        <editor-content
          :editor="editor"
          :style="scrollerStyles"
          :class="{ 'editable-mode': editable }"
          @click="handleOnClickWrapper"
          spellcheck="false"
          class="ma-2 overflow-y-auto"
        />
      </v-card>
    </form>
  </FullScreen>
</template>

<script setup lang="ts">
import HardBreak from '@tiptap/extension-hard-break'
import FullScreen from './description/FullScreen.vue'
import AskAnnaLinkMenu from './description/AskAnnaLinkMenu.vue'
import AskAnnaCodeBlock from './description/AskAnnaCodeBlock.vue'
import AskAnnaColorPicker from './description/AskAnnaColorPicker.vue'

import lowlight from 'lowlight'
import Link from '@tiptap/extension-link'
import { markInputRule } from '@tiptap/core'
import Code from '@tiptap/extension-code'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-2'

import { useEditorStore } from '@/core/store/useEditorStore'
import { ref, watch, computed, onMounted, onBeforeUnmount } from '@vue/composition-api'

const props = defineProps({
  cleared: {
    type: Boolean,
    default: false
  },
  preview: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: () => ''
  },
  description: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['onChange', 'onSave', 'onChangeDescription'])

const editorStore = useEditorStore()

const editable = ref(true)
const sticked = ref(false)
const isFocused = ref(false)
const isFullScreen = ref(false)
const isSetLinkOpen = ref(false)
const isInitialValueSet = ref(false)
const currentDescriptionValue = ref('')

const maxHeight = computed(() => props.height)
const descriptionComputed = computed(() => props.description)
const scrollerStyles = computed(() => {
  if (!editable.value) return

  if (isFullScreen.value) {
    return { 'min-height': 'calc(100vh - 150px)', height: 'auto' }
  }

  return { 'max-height': `${maxHeight.value}px`, 'min-height': '120px', height: 'auto' }
})

const linkInputRegex = /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/

const editor = new Editor({
  autofocus: false,
  editable: true,
  extensions: [
    StarterKit,
    Code.extend({
      addKeyboardShortcuts() {
        return {
          Escape: () => {
            editor.commands.unsetCode()
          }
        }
      }
    }),

    CodeBlock.configure({
      exitOnTripleEnter: true
    }),
    TaskList,
    TaskItem,
    HardBreak,
    Underline,

    Blockquote.extend({
      addKeyboardShortcuts() {
        return {
          Escape: () => {
            if (!editor.isActive('blockquote')) return

            editor.commands.enter()
            editor.commands.lift('blockquote')
          }
        }
      }
    }),

    Highlight.configure({ multicolor: true }),

    CodeBlockLowlight.extend({
      addNodeView() {
        return VueNodeViewRenderer(AskAnnaCodeBlock)
      },
      addKeyboardShortcuts() {
        return {
          Escape: () => {
            editor.isActive('codeBlock') && editor.commands.exitCode()
          }
        }
      }
    }).configure({ lowlight, exitOnTripleEnter: true }),

    Link.extend({
      addKeyboardShortcuts() {
        return {
          'Mod-k': () => {
            handleOpenSetLink()
            editorStore.isMenuOpen = true
          },
          Escape: () => {
            if (!editor.isActive('link')) return

            editorStore.url = ''

            editor.commands.insertContent(' ')
          }
        }
      },
      addInputRules() {
        return [
          markInputRule({
            type: this.type,
            find: linkInputRegex
          })
        ]
      }
    }).configure({
      openOnClick: !editable.value
    })
  ],

  content: props.description,
  onUpdate: ({ editor }) => emit('onChange', editor.getHTML())
})

onMounted(() => {
  if (props.preview) {
    editable.value = false
  }

  if (props.readonly) {
    editable.value = false
  }
})

watch(descriptionComputed, val => {
  if (!isInitialValueSet.value) {
    isInitialValueSet.value = true
    editor.commands.setContent(val)
  }

  if (editable.value) {
    currentDescriptionValue.value = editor.getHTML()
  }
})

watch(editable, val => {
  if (val) {
    currentDescriptionValue.value = editor.getHTML()
  }
  editor.setOptions({
    editable: val
  })
})

onBeforeUnmount(() => editor.destroy())

const handleOnClickWrapper = (event: MouseEvent) => {
  const element = event?.target as HTMLElement

  if (!isFocused.value && element.tagName === 'DIV') {
    editor.commands.focus()
    isFocused.value = true
  }
}

const handleOnBlurWrapper = () => {
  isFocused.value = false
  editor.commands.blur()
  emit('onChangeDescription', editor.getHTML())
}

const handleOnChangeColor = (color: string) => {
  editor.chain().focus().toggleHighlight({ color }).run()
}

const handleUnsetHighlight = () => {
  editor.commands.unsetHighlight()
}

const onStick = data => (sticked.value = data.sticked)

const handleOpenSetLink = () => {
  editorStore.url = editor.getAttributes('link').href
}

const handleSetLink = () => {
  // unset link
  if (editorStore.url === null || editorStore.url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()

    return
  }

  // update link
  editor.chain().focus().extendMarkRange('link').setLink({ href: editorStore.url }).run()
  editorStore.url = ''
}

const handleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  editor.commands.focus()
}

const handleExitFullScreen = () => {
  isFullScreen.value = false
  editor.commands.focus()
}

const handleOnSave = () => {
  isFullScreen.value = false
  emit('onSave')
}
</script>
<style lang="scss">
.v-application .ask-anna--editor p {
  margin-bottom: 0px;
  code {
    color: white;
    background-color: var(--v-primary-base) !important;
    border-color: var(--v-primary-base) !important;
    padding: 0 3px 2px 3px;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }
}

ul[data-type='taskList'] {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;

      input[type='checkbox'] {
        accent-color: #5d3eb2 !important;
      }
    }

    > div {
      flex: 1 1 auto;
    }
  }
}

.ProseMirror:focus {
  outline: none;
}
.ask-anna--editor .v-btn.is-active {
  opacity: 0.9;
}

.ProseMirror pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #282c34 !important;
  color: #fff;
  font-size: 0.8rem;
  overflow-x: auto;
}

.ask-anna-descriptio--title {
  position: absolute;
  top: -9px;
  z-index: 3;
  left: 9px;
  padding: 1px;
  font-size: 12px !important;
  background-color: white;
}

.ask-anna-descriptio--title.v-label--active {
  color: #5d3eb2 !important;
}

.ask-anna--editor p code {
  font-size: 16px;
  padding: 0px 3px 2px 3px;
  border-radius: 5px;
  font-family: Roboto, sans-serif !important;
  font-weight: normal !important;
  background: none !important;
  color: #ffffff !important;
  font-size: 16px !important;
}

.ask-anna--editor {
  &.full-screen-mode {
    width: 900px;
    margin: 0 auto;
  }
  .editable-mode {
    a {
      cursor: text;
    }
  }
}

.ask-anna--editor blockquote {
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  padding-left: 0.8rem;
  font-style: italic;
}
.v-application .ask-anna--editor {
  pre {
    &::before {
      content: attr(data-language);
      text-transform: uppercase;
      display: block;
      text-align: right;
      font-weight: bold;
      font-size: 0.6rem;
    }
    code {
      font-size: 14px;
      .hljs-comment,
      .hljs-quote {
        color: #999999;
      }
      .hljs-variable,
      .hljs-template-variable,
      .hljs-attribute,
      .hljs-tag,
      .hljs-name,
      .hljs-regexp,
      .hljs-link,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #f2777a;
      }
      .hljs-number,
      .hljs-meta,
      .hljs-built_in,
      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params {
        color: #f99157;
      }
      .hljs-string,
      .hljs-symbol,
      .hljs-bullet {
        color: #99cc99;
      }
      .hljs-title,
      .hljs-section {
        color: #ffcc66;
      }
      .hljs-keyword,
      .hljs-selector-tag {
        color: #6699cc;
      }
      .hljs-emphasis {
        font-style: italic;
      }
      .hljs-strong {
        font-weight: 700;
      }
    }
  }
}
</style>
