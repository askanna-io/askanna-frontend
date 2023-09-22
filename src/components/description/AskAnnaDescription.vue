<template>
  <FullScreen
    :title="title"
    :value="isFullScreen"
    @onSave="handleOnSave"
    @onExitFullScreen="handleExitFullScreen"
  >
    <form
      @click="handleOnClickWrapper"
      @focusout="handleOnBlurWrapper"
      @focusin="handleOnClickWrapper"
      :class="{ 'mt-5 pt-6': isFullScreen }"
    >
      <VHover>
        <template v-slot:default="{ isHovering, props }">
          <div
            v-bind="props"
            class="askanna--editor pr-0 cursor-text relative overflow-visible"
            :class="{
              'mt-3 mb-4 full-screen-mode': isFullScreen,
              'opacity-87': !isHovering && !isFocused && !readonly,
              'v-field--variant-outlined': (outlined && $vuetify.display.xs && !isFullScreen) || (outlined && !$vuetify.display.xs),
              'v-field--active':
                (isFocused && outlined && !$vuetify.display.xs) ||
                (isFocused && outlined && $vuetify.display.xs && !isFullScreen)
            }"
          >
            <div class="v-field__outline">
              <div
                class="v-field__outline__start rounded-s hover:opacity-100"
                :class="{ 'opacity-100   border-primary border-l-2 border-b-2 border-t-2': isFocused }"
              ></div>
              <div
                class="v-field__outline__notch hover:opacity-100"
                :class="{ 'opacity-100 border-primary border-2': isFocused }"
              ></div>
              <div
                class="v-field__outline__end rounded-e  hover:opacity-100"
                :class="{ 'opacity-100 border-primary border-y-2 border-r-2': isFocused }"
              ></div>
            </div>
            <label
              v-if="title && !isFullScreen"
              class="askanna-description--title px-1"
              :class="{ 'v-label--active': isFocused }"
            ><span :class="{ 'opacity-60': !isFocused }">{{ title }}</span></label>
            <div
              v-if="editor && editable"
              :class="{

                'is-active': isFocused && !$vuetify.display.xs && isFullScreen
              }"
            >
              <div
                role="tablist"
                :class="{
                  'fixed w-full bg-white z-10 fixed-toolbar': isFullScreen
                }"
                class="mx-1 pt-1 pb-1 flex flex-wrap items-center sm:justify-between"
              >
                <div class="">
                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    icon="mdi-format-bold"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().toggleBold().run()"
                    :colorIcon="editor.isActive('bold') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Bold</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    icon="mdi-format-italic"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().toggleItalic().run()"
                    :colorIcon="editor.isActive('italic') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Italic</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-underline"
                    @click="editor.chain().focus().toggleUnderline().run()"
                    :colorIcon="editor.isActive('underline') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Underline</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-strikethrough"
                    @click="editor.chain().focus().toggleStrike().run()"
                    :colorIcon="editor.isActive('strike') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Strikethrough</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaColorPicker
                    @onUnsetColor="handleUnsetHighlight"
                    @onChangeColor="handleOnChangeColor"
                  />

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-paragraph"
                    @click="editor.chain().focus().setParagraph().run()"
                    :colorIcon="editor.isActive('paragraph') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Paragraph</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-header-1"
                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :colorIcon="editor.isActive('heading', { level: 1 }) ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Header 1</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-header-2"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :colorIcon="editor.isActive('heading', { level: 2 }) ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Header 2</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="mr-4 opacity-100 z-10"
                    icon="mdi-format-header-3"
                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :colorIcon="editor.isActive('heading', { level: 3 }) ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Header 3</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-list-bulleted"
                    @click="editor.chain().focus().toggleBulletList().run()"
                    :color="editor.isActive('bulletList') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Bulleted list</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-list-numbered"
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    :color="editor.isActive('orderedList') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Numeric list</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    icon="mdi-format-list-checks"
                    @click="editor.chain().focus().toggleTaskList().run()"
                    :color="editor.isActive('taskList') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Task list</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    icon="mdi-minus"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().setHorizontalRule().run()"
                  >
                    <AskAnnaTooltip>Horizontal divider</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="mr-4 opacity-100 z-10"
                    icon="mdi-format-quote-close"
                    @click="editor.chain().focus().toggleBlockquote().run()"
                    :color="editor.isActive('blockquote') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Quote</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    icon="mdi-code-tags"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().toggleCode().run()"
                    :color="editor.isActive('code') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Code</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    icon="mdi-code-braces"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().toggleCodeBlock().run()"
                    :color="editor.isActive('codeBlock') ? 'primary' : 'secondary'"
                  >
                    <AskAnnaTooltip>Code block</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaLinkMenu
                    :open="isSetLinkOpen"
                    :isActive="editor.isActive('link')"
                    @onSetLink="handleSetLink"
                    @onOpen="handleOpenSetLink"
                  />

                  <AskAnnaButton
                    variant="plain"
                    icon="mdi-undo"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().undo().run()"
                  >
                    <AskAnnaTooltip>Undo</AskAnnaTooltip>
                  </AskAnnaButton>

                  <AskAnnaButton
                    variant="plain"
                    icon="mdi-redo"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    @click="editor.chain().focus().redo().run()"
                  >
                    <AskAnnaTooltip>Redo</AskAnnaTooltip>
                  </AskAnnaButton>
                </div>
                <div>
                  <a
                    @click.stop
                    target="_blank"
                    class="no-underline"
                    href="https://docs.askanna.io/shortcuts-editor/"
                  >
                    Markdown supported
                  </a>

                  <AskAnnaButton
                    variant="plain"
                    density="compact"
                    class="opacity-100 z-10 mr-2"
                    :icon="isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
                    @click="handleFullScreen"
                  >
                    <AskAnnaTooltip>{{ isFullScreen ? 'Exit full screen' : 'Full screen' }}</AskAnnaTooltip>
                  </AskAnnaButton>
                </div>
              </div>
            </div>
            <AskAnnaDivider v-show="editable" />

            <EditorContent
              :editor="editor"
              :style="scrollerStyles"
              class="my-2 overflow-y-auto"
              :class="{
                'editable-mode': editable,
                'full-screen': isFullScreen,
                'mx-2': $vuetify.display.xs && !isCodeBlcok,
                'mx-4 ': !$vuetify.display.xs && !isCodeBlcok
              }"
              @click="handleOnClickWrapper"
              spellcheck="false"
            />
          </div>
        </template>
      </VHover>
    </form>
  </FullScreen>
</template>

<script setup lang="ts">
import { common, createLowlight } from 'lowlight'
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
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import AskAnnaCodeBlock from '@/components/description/AskAnnaCodeBlock.vue'

const props = defineProps({
  cleared: {
    type: Boolean,
    default: false
  },
  isCodeBlcok: {
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
const lowlight = createLowlight(common)

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
      const hljs = await import(`../../../node_modules/highlight.js/es/languages/${language}`) // change me
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
      TaskItem.configure({
        nested: true,
      }),
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
  if (props.preview || props.readonly) {
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
  //editor.value.commands.blur()
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

.fixed-toolbar {
  max-width: 890px !important;
  top: 58px;
}

.v-application .askanna--editor p {
  margin-bottom: 0px;

  code {
    color: white;
    background-color: theme('colors.primary') !important;
    border-color: theme('colors.primary') !important;
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

    >label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      margin-left: 0.5rem;

      input[type='checkbox'] {
        accent-color: theme('colors.primary') !important;
        border-color: #5d3eb2;
        appearance: auto;

        &:focus {
          --tw-ring-shadow: none;
        }


        &:checked {
          background-color: theme('colors.primary') !important;
        }
      }
    }

    >div {
      flex: 1 1 auto;
    }
  }
}

.askanna--editor:focus {
  outline: none;
}

.askanna--editor .v-btn.is-active {
  opacity: 0.9;
}

.askanna--editor pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #282c34 !important;
  color: #fff;
  font-size: 0.8rem;
  overflow-x: auto;
}

.askanna-description--title {
  position: absolute;
  top: -9px;
  z-index: 5;
  left: 9px;
  padding: 1px;
  font-size: 12px !important;
  background-color: white;
}

.askanna-description--title.v-label--active {
  color: theme('colors.primary') !important;
}

.askanna--editor p code {
  font-size: 16px;
  padding: 0px 3px 2px 3px;
  border-radius: 5px;
  font-family: Roboto, sans-serif !important;
  font-weight: normal !important;
  background: none !important;
  color: #ffffff !important;
  font-size: 16px !important;
}

.askanna--editor {
  ul {
    list-style: disc;
  }

  &.full-screen-mode {
    overflow: hidden;
    overflow-y: scroll;
    width: 900px;
    margin: 0 auto;
    border-radius: 2px !important;
  }

  .editable-mode {
    a {
      cursor: text;
    }
  }

  .ProseMirror:focus {
    outline: none;
  }
}

.askanna--editor blockquote {
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  padding-left: 0.8rem;
  font-style: italic;
}

.v-application .askanna--editor {
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
