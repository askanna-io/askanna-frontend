<template>
  <FullScreen :title="title" :value="isFullScreen" @onSave="handleOnSave" @onExitFullScreen="handleExitFullScreen">
    <form
      @focusout="handleOnBlurWrapper"
      @focusin="handleOnClickWrapper"
      @click="handleOnClickWrapper"
      :class="{ 'mt-5 pt-6': isFullScreen }">
      <AskAnnaCard
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
        }">
        <label
          v-if="title && !isFullScreen"
          class="ask-anna-description--title v-label theme--light px-1"
          :class="{ 'v-label--active': isFocused }">{{ title }}</label>
        <div
          v-if="editor && editable"
          :class="{
            'toolbar-full-screen': isFullScreen,
            'is-active': isFocused && !$vuetify.breakpoint.xsOnly && isFullScreen
          }">
          <Component
            v-bind:is="$vuetify.breakpoint.xsOnly ? 'div' : 'v-toolbar'"
            flat
            dense
            height="30px"
            class="mx-1 mt-2">
            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('bold')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('bold') }"
                  @click="editor.chain().focus().toggleBold().run()"
                  :color="editor.isActive('bold') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-bold</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Bold</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('italic')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('italic') }"
                  @click="editor.chain().focus().toggleItalic().run()"
                  :color="editor.isActive('italic') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-italic</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Italic</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('underline')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('underline') }"
                  @click="editor.chain().focus().toggleUnderline().run()"
                  :color="editor.isActive('underline') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-underline</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Underline</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-1"
                  :text="!editor.isActive('strike')"
                  :class="{ 'is-active': editor.isActive('strike') }"
                  @click="editor.chain().focus().toggleStrike().run()"
                  :color="editor.isActive('strike') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-strikethrough</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Strikethrough</span>
            </AskAnnaTooltip>

            <AskAnnaColorPicker @onUnsetColor="handleUnsetHighlight" @onChangeColor="handleOnChangeColor" />

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('paragraph')"
                  class="btn--hover btn--without-text mr-1"
                  @click="editor.chain().focus().setParagraph().run()"
                  :class="{ 'is-active': editor.isActive('paragraph') }"
                  :color="editor.isActive('paragraph') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-paragraph</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Paragraph</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-1"
                  :text="!editor.isActive('heading', { level: 1 })"
                  :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                  @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                  :color="editor.isActive('heading', { level: 1 }) ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-header-1</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Header 1</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-1"
                  :text="!editor.isActive('heading', { level: 2 })"
                  :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  :color="editor.isActive('heading', { level: 2 }) ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-header-2</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Header 2</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  class="btn--hover btn--without-text mr-3"
                  :text="!editor.isActive('heading', { level: 3 })"
                  :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                  @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                  :color="editor.isActive('heading', { level: 3 }) ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-header-3</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Header 3</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('bulletList')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('bulletList') }"
                  @click="editor.chain().focus().toggleBulletList().run()"
                  :color="editor.isActive('bulletList') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-list-bulleted</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Bulleted list</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('orderedList')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('orderedList') }"
                  @click="editor.chain().focus().toggleOrderedList().run()"
                  :color="editor.isActive('orderedList') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-list-numbered</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Numeric list</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('taskList')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('taskList') }"
                  @click="editor.chain().focus().toggleTaskList().run()"
                  :color="editor.isActive('taskList') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-list-checks</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Task list</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text mr-3"
                  @click="editor.chain().focus().setHorizontalRule().run()">
                  <AskAnnaIcon>mdi-minus</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Horizontal divider</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('blockquote')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('blockquote') }"
                  @click="editor.chain().focus().toggleBlockquote().run()"
                  :color="editor.isActive('blockquote') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-format-quote-close</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Quote</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('code')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('code') }"
                  @click="editor.chain().focus().toggleCode().run()"
                  :color="editor.isActive('code') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-code-tags</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Code</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  x-small
                  :text="!editor.isActive('codeBlock')"
                  class="btn--hover btn--without-text mr-1"
                  :class="{ 'is-active': editor.isActive('codeBlock') }"
                  @click="editor.chain().focus().toggleCodeBlock().run()"
                  :color="editor.isActive('codeBlock') ? 'primary' : 'secondary'">
                  <AskAnnaIcon>mdi-code-braces</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Code block</span>
            </AskAnnaTooltip>

            <AskAnnaLinkMenu
              :open="isSetLinkOpen"
              :isActive="editor.isActive('link')"
              @onSetLink="handleSetLink"
              @onOpen="handleOpenSetLink" />
            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text mr-1"
                  @click="editor.chain().focus().undo().run()">
                  <AskAnnaIcon>mdi-undo</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Undo</span>
            </AskAnnaTooltip>

            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text mr-3"
                  @click="editor.chain().focus().redo().run()">
                  <AskAnnaIcon>mdi-redo</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>Redo</span>
            </AskAnnaTooltip>

            <AskAnnaSpacer v-if="!$vuetify.breakpoint.xsOnly" />
            <a
              class="ask-anna-link body-2"
              target="_blank"
              href="https://docs.askanna.io/shortcuts-editor/"
              @click.stop>
              Markdown supported
            </a>
            <AskAnnaTooltip top>
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  v-on="on"
                  dark
                  icon
                  text
                  x-small
                  color="secondary"
                  class="btn--hover btn--without-text ml-2"
                  @click="handleFullScreen">
                  <AskAnnaIcon>{{ isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</AskAnnaIcon>
                </AskAnnaButton>
              </template>
              <span>{{ isFullScreen ? 'Exit full screen' : 'Full screen' }}</span>
            </AskAnnaTooltip>
          </Component>
        </div>
        <AskAnnaDivider v-show="editable" class="" />

        <editor-content
          :editor="editor"
          :style="scrollerStyles"
          class="my-2 overflow-y-auto"
          :class="{
            'editable-mode': editable,
            'full-screen': isFullScreen,
            'mx-2': $vuetify.breakpoint.xsOnly,
            'mx-4 ': !$vuetify.breakpoint.xsOnly
          }"
          @click="handleOnClickWrapper"
          spellcheck="false" />
      </AskAnnaCard>
    </form>
  </FullScreen>
</template>

<script setup lang="ts">
import { lowlight } from 'lowlight'
import Link from '@tiptap/extension-link'
import Code from '@tiptap/extension-code'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import { markInputRule } from '@tiptap/core'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Document from '@tiptap/extension-document'
import TaskList from '@tiptap/extension-task-list'
import ListItem from '@tiptap/extension-list-item'
import TaskItem from '@tiptap/extension-task-item'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import HardBreak from '@tiptap/extension-hard-break'
import Dropcursor from '@tiptap/extension-dropcursor'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import Typography from '@tiptap/extension-typography'
import OrderedList from '@tiptap/extension-ordered-list'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-2'
import AskAnnaCodeBlock from '@/components/description/AskAnnaCodeBlock.vue'

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
  },
  isClearContent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onChange', 'onSave', 'onChangeDescription'])

const editorStore = useEditorStore()

const editor = ref<Editor>()
const editable = ref(true)
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

const linkInputRegex = /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/g

const lazyLoadCodeBlock = ({ editor }: { editor: Editor }) => {
  const json = editor.getJSON()
  json.content?.forEach(async node => {
    if (node.type !== 'codeBlock') {
      return
    }

    const language = node.attrs?.language
    if (!language) {
      return
    }

    if (lowlight.registered(language)) {
      return
    }

    try {
      const hljs = await import(`../../../node_modules/highlight.js/es/languages/${language}.js`) // change me
      lowlight.registerLanguage(language, hljs.default)
    } catch (error) {
      const logger = useLogger()

      logger.error('error on load highlight module language style', error)
    }
  })
}

onBeforeMount(() => {
  editor.value = new Editor({
    autofocus: false,
    editable: true,
    extensions: [
      Text,
      Bold,
      Italic,
      Strike,
      Heading,
      History,
      Document,
      TaskList,
      TaskItem,
      ListItem,
      HardBreak,
      Underline,
      Paragraph,
      Dropcursor,
      Gapcursor,
      Typography,
      BulletList,
      OrderedList,
      HorizontalRule,
      Code,
      Blockquote.extend({
        addKeyboardShortcuts() {
          return {
            Escape: () => {
              if (!editor.value.isActive('blockquote')) return

              editor.value.commands.enter()
              editor.value.commands.lift('blockquote')
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
              editor.value.isActive('codeBlock') && editor.value.commands.exitCode()
            },
            'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
            // remove code block when at start of document or code block is empty
            Backspace: () => {
              const { empty, $anchor } = this.editor.state.selection
              const isAtStart = $anchor.pos === 1
              if (!empty || $anchor.parent.type.name !== this.name) {
                return false
              }
              if (isAtStart || !$anchor.parent.textContent.length) {
                return this.editor.commands.clearNodes()
              }
              return false
            },
            // exit node on triple enter
            Enter: ({ editor }) => {
              if (!this.options.exitOnTripleEnter) {
                return false
              }
              const { state } = editor
              const { selection } = state
              const { $from, empty } = selection
              if (!empty || $from.parent.type !== this.type) {
                return false
              }
              const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
              const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')
              if (!isAtEnd || !endsWithDoubleNewline) {
                return false
              }
              return editor
                .chain()
                .command(({ tr }) => {
                  tr.delete($from.pos - 2, $from.pos)
                  return true
                })
                .exitCode()
                .run()
            },
            // exit node on arrow down
            ArrowDown: ({ editor }) => {
              if (!this.options.exitOnArrowDown) {
                return false
              }
              const { state } = editor
              const { selection, doc } = state
              const { $from, empty } = selection
              if (!empty || $from.parent.type !== this.type) {
                return false
              }
              const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
              if (!isAtEnd) {
                return false
              }
              const after = $from.after()
              if (after === undefined) {
                return false
              }
              const nodeAfter = doc.nodeAt(after)
              if (nodeAfter) {
                return false
              }
              return editor.commands.exitCode()
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
              setTimeout(() => {
                const linkInput = window.document.getElementById('link-input')
                linkInput?.setSelectionRange(0, 0)
              }, 500)
            },
            Escape: () => {
              if (!editor.value.isActive('link')) return

              editorStore.url = ''
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
        autolink: false,
        openOnClick: !editable.value,
        protocols: ['http', 'https', 'ftp', 'mailto']
      })
    ],

    content: props.description,
    onUpdate: ({ editor }) => emit('onChange', editor.getHTML())
  })
  editor.value.on('beforeCreate', lazyLoadCodeBlock)
  editor.value.on('update', lazyLoadCodeBlock)
})

onMounted(() => {
  if (props.preview) {
    editable.value = false
  }

  if (props.readonly) {
    editable.value = false
  }
})

watch(descriptionComputed, async val => {
  if (!isInitialValueSet.value) {
    isInitialValueSet.value = true

    await lazyLoadCodeBlock({ editor: editor.value })

    editor.value.commands.setContent(val)
  }

  if (editable.value) {
    currentDescriptionValue.value = editor.value.getHTML()
  }

  if (!val && props.isClearContent) {
    editor.value.commands.clearContent()
  }
})

watch(editable, val => {
  if (val) {
    currentDescriptionValue.value = editor.value.getHTML()
  }
  editor.value.setOptions({
    editable: val
  })
})

onBeforeUnmount(() => editor.value.destroy())

const handleOnClickWrapper = (event: MouseEvent) => {
  const element = event?.target as HTMLElement

  if (!isFocused.value && element.tagName === 'DIV') {
    editor.value.commands.focus()
    isFocused.value = true
  }
}

const handleOnBlurWrapper = () => {
  isFocused.value = false
  editor.value.commands.blur()
  emit('onChangeDescription', editor.value.getHTML())
}

const handleOnChangeColor = (color: string) => {
  editor.value.chain().focus().toggleHighlight({ color }).run()
}

const handleUnsetHighlight = () => {
  editor.value.chain().focus().unsetHighlight().run()
}

const handleOpenSetLink = () => {
  editorStore.url = editor.value.getAttributes('link').href
}

const handleSetLink = () => {
  // unset link
  if (editorStore.url === null || editorStore.url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()

    return
  }

  // update link
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: editorStore.url }).run()
  editorStore.url = ''
}

const handleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  editor.value.commands.focus()
}

const handleExitFullScreen = () => {
  isFullScreen.value = false
  editor.value.commands.focus()
}

const handleOnSave = () => {
  isFullScreen.value = false
  emit('onSave')
}
</script>
<style lang="scss">
.mobile-view {
  .toolbar-full-screen {
    width: auto;
  }

  .editable-mode {
    &.full-screen {
      padding-top: 55px !important;
    }
  }
}

.toolbar-full-screen {
  position: fixed;
  width: 900px;
  background-color: white;
  z-index: 10;
  opacity: 1;
  margin-left: -1px;
  border-radius: 4px 4px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-left: 1px solid rgba(0, 0, 0, 0.12);

  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.12);

  &.is-active {
    border-top: 1px solid #5d3eb2;
    border-right: 1px solid #5d3eb2;
    border-left: 1px solid #5d3eb2;
  }
}

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

    >label {
      flex: 0 0 auto;
      margin-right: 0.5rem;

      input[type='checkbox'] {
        accent-color: #5d3eb2 !important;
      }
    }

    >div {
      flex: 1 1 auto;
    }
  }
}

.ask-anna--editor:focus {
  outline: none;
}

.ask-anna--editor .v-btn.is-active {
  opacity: 0.9;
}

.ask-anna--editor pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #282c34 !important;
  color: #fff;
  font-size: 0.8rem;
  overflow-x: auto;
}

.ask-anna-description--title {
  position: absolute;
  top: -9px;
  z-index: 3;
  left: 9px;
  padding: 1px;
  font-size: 12px !important;
  background-color: white;
}

.ask-anna-description--title.v-label--active {
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
    overflow: hidden;
    overflow-y: scroll;
    width: 900px;
    margin: 0 auto;
    border-radius: 2px !important;
  }

  .editable-mode {
    &.full-screen {
      padding-top: 40px;
    }

    a {
      cursor: text;
    }
  }

  .ProseMirror:focus {
    outline: none;
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
