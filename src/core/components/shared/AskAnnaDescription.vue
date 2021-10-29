<template>
  <form @focusout="handleOnBlurWrapper" @focusin="handleOnClickWrapper">
    <v-card class="ask-anna--editor" :class="{ 'border--primary ': isFocused && outlined }" flat :outlined="outlined">
      <label
        v-if="title"
        class="ask-anna-descriptio--title v-label theme--light px-1"
        :class="{ 'v-label--active': isFocused }"
        >{{ title }}</label
      >
      <div class="" v-if="editor && editable">
        <v-toolbar
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
                class="btn--hover btn--without-text mr-3"
                :class="{ 'is-active': editor.isActive('codeBlock') }"
                @click="editor.chain().focus().toggleCodeBlock().run()"
                :color="editor.isActive('codeBlock') ? 'primary' : 'secondary'"
              >
                <v-icon>mdi-code-braces</v-icon>
              </v-btn>
            </template>
            <span>Code block</span>
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
                class="btn--hover btn--without-text mr-1"
                @click="editor.chain().focus().redo().run()"
              >
                <v-icon>mdi-redo</v-icon>
              </v-btn>
            </template>
            <span>Redo</span>
          </v-tooltip>
          <v-spacer />
          <a class="ask-anna-link body-2" target="_blank" href="https://docs.askanna.io/shortcuts-editor/" @click.stop>
            Markdown supported
          </a>
        </v-toolbar>
      </div>
      <v-divider v-show="editable" class="" />

      <editor-content class="ma-2 overflow-y-auto" :editor="editor" :style="scrollerStyles" spellcheck="false" />

      <v-card-actions v-if="!onLiveMode">
        <v-btn v-if="editable" small outlined color="secondary" @click="handleSave">
          <v-icon left small dark>mdi-content-save</v-icon>Save
        </v-btn>
        <v-btn v-if="editable && cleared" small outlined color="secondary" @click="handleClear">
          <v-icon left small dark>mdi-delete-forever-outline</v-icon>Clear
        </v-btn>
        <v-btn v-if="editable" small outlined color="secondary" class="mr-1 btn--hover" @click="handleCancel">
          <v-icon color="secondary" small left>mdi-close</v-icon>Cancel
        </v-btn>
        <v-btn v-if="!editable" class="my-2 btn--hover" small outlined color="secondary" @click="handleEdit">
          <v-icon color="secondary" left small class="mr-2">mdi-pencil</v-icon>Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </form>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import HardBreak from '@tiptap/extension-hard-break'
import AskAnnaCodeBlock from './description/AskAnnaCodeBlock.vue'
import AskAnnaColorPicker from './description/AskAnnaColorPicker.vue'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-2'

import lowlight from 'lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'

import { useWindowSize } from '@u3u/vue-hooks'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaDescription',

  props: {
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
    onLiveMode: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: () => ''
    },
    description: {
      type: String,
      default: ''
    },
    headerHeight: {
      type: Number,
      default: 235
    }
  },

  components: {
    EditorContent,
    AskAnnaColorPicker
  },

  setup(props) {
    const { height } = useWindowSize()
    const maxHeight = computed(() => height.value - props.headerHeight)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })

    return { scrollerStyles }
  },
  data() {
    return {
      sticked: false,
      editor: new Editor({
        autofocus: false,
        editable: true,
        extensions: [
          Underline,
          StarterKit,
          TaskList,
          TaskItem,
          Highlight.configure({ multicolor: true }),
          CodeBlockLowlight.extend({
            addNodeView() {
              return VueNodeViewRenderer(AskAnnaCodeBlock)
            }
          }).configure({ lowlight }),
          // add custom keyboard shortcad for past hard break, aslo leve code block
          HardBreak.extend({
            addKeyboardShortcuts() {
              return {
                Escape: () => this.editor.commands.setHardBreak()
              }
            }
          })
        ],
        content: this.description,
        onUpdate: ({ editor }) => this.$emit('onChange', editor.getHTML())
      }),
      editable: true,
      isFocused: false,
      currentDescriptionValue: ''
    }
  },

  mounted() {
    if (this.preview) {
      this.editable = false
    }

    if (this.readonly) {
      this.editable = false
    }
  },

  watch: {
    description(val) {
      if (this.editor.isEmpty) {
        this.editor.commands.setContent(val)
      }

      if (this.editable) {
        this.currentDescriptionValue = this.editor.getHTML()
      }
    },
    editable() {
      if (this.editable) {
        this.currentDescriptionValue = this.editor.getHTML()
      }
      this.editor.setOptions({
        editable: this.editable
      })
    }
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    handleSave() {
      this.$emit('onChangeDescription', { description: this.editor.getHTML() })
      this.$emit('onSave')
      this.editable = !this.editable
    },

    handleClear() {
      this.editor.clearContent()
    },

    handleCancel() {
      this.handleClear()

      this.editor.commands.setContent(this.currentDescriptionValue)
      this.editable = !this.editable
    },

    handleEdit() {
      this.editable = !this.editable
      this.editor.focus()
    },

    handleOnClickWrapper() {
      this.isFocused = true
    },

    handleOnBlurWrapper() {
      this.isFocused = false
      this.editor.commands.blur()
      if (this.onLiveMode) this.$emit('onChangeDescription', this.editor.getHTML())
    },

    handleOnChangeColor(color) {
      this.editor.chain().focus().toggleHighlight({ color }).run()
    },

    handleUnsetHighlight() {
      this.editor.commands.unsetHighlight()
    },

    onStick(data) {
      this.sticked = data.sticked
    }
  }
})
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
