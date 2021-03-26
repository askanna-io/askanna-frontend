<template>
  <form @focusout="handleOnBlurWrapper" @focusin="handleOnClickWrapper">
    <v-card class="ask-anna--editor" :class="{ 'border--primary ': isFocused && outlined }" flat :outlined="outlined">
      <label class="ask-anna-descriptio--title v-label theme--light px-1" :class="{ 'v-label--active': isFocused }">{{
        title
      }}</label>
      <editor-menu-bar class="ma-2 pt-1" v-if="editable" :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <v-btn
            x-small
            :text="!isActive.bold()"
            class="mr-1"
            :class="{ 'is-active': isActive.bold() }"
            color="primary"
            @click="commands.bold"
          >
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :text="!isActive.italic()"
            :class="{ 'is-active': isActive.italic() }"
            color="primary"
            @click="commands.italic"
          >
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
            :text="!isActive.underline()"
            color="primary"
          >
            <v-icon>mdi-format-underline</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
            :text="!isActive.strike()"
            color="primary"
          >
            <v-icon>mdi-format-strikethrough</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
            :text="!isActive.code()"
            color="primary"
          >
            <v-icon>mdi-code-tags</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
            :text="!isActive.paragraph()"
            color="primary"
          >
            <v-icon>mdi-format-paragraph</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            :text="!isActive.heading({ level: 1 })"
            color="primary"
            @click="commands.heading({ level: 1 })"
          >
            <v-icon>mdi-format-header-1</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            :text="!isActive.heading({ level: 2 })"
            color="primary"
            @click="commands.heading({ level: 2 })"
          >
            <v-icon>mdi-format-header-2</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            :text="!isActive.heading({ level: 3 })"
            color="primary"
            @click="commands.heading({ level: 3 })"
          >
            <v-icon>mdi-format-header-3</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.bullet_list() }"
            :text="!isActive.bullet_list()"
            color="primary"
            @click="commands.bullet_list"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.ordered_list() }"
            :text="!isActive.ordered_list()"
            color="primary"
            @click="commands.ordered_list"
          >
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.blockquote() }"
            :text="!isActive.blockquote()"
            color="primary"
            @click="commands.blockquote"
          >
            <v-icon>mdi-format-quote-close</v-icon>
          </v-btn>

          <v-btn
            x-small
            class="mr-1"
            :class="{ 'is-active': isActive.code_block() }"
            :text="!isActive.code_block()"
            color="primary"
            @click="commands.code_block"
          >
            <v-icon>mdi-code-braces</v-icon>
          </v-btn>

          <v-btn x-small class="mr-1" color="primary" text @click="commands.horizontal_rule">
            <v-icon>mdi-color-helper</v-icon>
          </v-btn>

          <v-btn x-small class="mr-1" text color="primary" @click="commands.undo">
            <v-icon>mdi-undo</v-icon>
          </v-btn>

          <v-btn x-small class="mr-1" text color="primary" @click="commands.redo">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
        </div>
      </editor-menu-bar>
      <v-divider v-show="editable" class="mt-2" />

      <editor-content class="ma-2" :editor="editor" spellcheck="false" />

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
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import python from 'highlight.js/lib/languages/python'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  CodeBlockHighlight
} from 'tiptap-extensions'

export default {
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
      default: '<p></p>'
    }
  },
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      editable: true,
      isFocused: false,
      currentDescriptionValue: '',
      editor: new Editor({
        autoFocus: false,
        editable: true,
        extensions: [
          new CodeBlockHighlight({
            languages: {
              javascript,
              python
            }
          }),
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        content: '<p></p>'
      })
    }
  },

  created() {
    if (this.preview) {
      this.editable = false
    }

    if (this.readonly) {
      this.editable = false
    }
  },

  watch: {
    description(val) {
      this.editor.setContent(val)
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

      this.editor.setContent(this.currentDescriptionValue)
      this.editable = !this.editable
    },

    handleEdit() {
      this.editable = !this.editable
      this.editor.focus()
    },

    handleOnClickWrapper() {
      this.isFocused = true
      this.editor.focus()
    },

    handleOnBlurWrapper() {
      this.isFocused = false
      this.editor.blur()

      if (this.onLiveMode) this.$emit('onChangeDescription', this.editor.getHTML())
    }
  }
}
</script>
<style lang="scss">
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
  z-index: 100;
  left: 9px;
  padding: 1px;
  font-size: 12px !important;
  background-color: white;
}

.ask-anna-descriptio--title.v-label--active {
  color: #5d3eb2 !important;
}

.ask-anna--editor p code {
  font-size: 14px;
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 700;
  background: #282c34 !important;
  color: rgba(0, 0, 0, 0.8);
}

.ask-anna--editor blockquote {
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  padding-left: 0.8rem;
  font-style: italic;
}

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
</style>
