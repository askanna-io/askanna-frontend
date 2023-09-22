<template>
    <v-defaults-provider scoped>
        <v-sheet
            border
            class="mb-9 overflow-hidden"
            rounded
        >
            <v-lazy
                v-if="!preview"
                v-model="hasRendered"
                min-height="44"
            >
                <VToolbar
                    :color="isDark ? '#1F1F1F' : 'grey-lighten-4'"
                    border="b"
                    class="px-1"
                    flat
                    height="44"
                >
                    {{ title }}
                    <v-fade-transition>
                        <div v-if="showCode">
                            <v-btn
                                v-for="(section, i) of sections"
                                :key="section.name"
                                :active="template === i"
                                class="m-1 text-none"
                                variant="text"
                                size="small"
                                @click="template = i"
                            >
                                <span :class="template === i ? 'text-high-emphasis' : 'text-medium-emphasis'">
                                    {{ upperFirst(section.name) }}
                                </span>
                            </v-btn>
                        </div>
                    </v-fade-transition>

                    <v-spacer />

                    <v-tooltip
                        v-for="({ path, ...action }, i) of actions"
                        :key="i"
                        location="top"
                    >
                        <template #activator="{ props: tooltip }">
                            <v-btn
                                class="ms-2 text-medium-emphasis"
                                density="comfortable"
                                variant="text"
                                v-bind="mergeProps(action as any, tooltip)"
                            />
                        </template>

                        <span>{{ path }}</span>
                    </v-tooltip>

                </VToolbar>
            </v-lazy>

            <div class="flex flex-col ">
                <v-expand-transition v-if="hasRendered">
                    <div v-if="showCode">
                        <v-window
                            v-model="template"
                            class="not-prose"
                        >
                            <v-window-item
                                v-for="section of sections"
                                :key="section.name"
                            >
                                <v-theme-provider :theme="theme">
                                    <TheHighlight
                                        readonly
                                        :languageName="'js'"
                                        :value="section.content"
                                    />
                                </v-theme-provider>
                            </v-window-item>
                        </v-window>
                    </div>
                </v-expand-transition>

                <v-theme-provider
                    :class="showCode && 'border-t'"
                    :theme="theme"
                    class="p-4 rounded-b"
                    with-background
                >
                    <component
                        :is="ExampleComponent"
                        v-if="isLoaded"
                        :file="file"
                    />
                </v-theme-provider>
            </div>
        </v-sheet>
    </v-defaults-provider>
</template>

<script setup lang="ts">
import { mergeProps } from 'vue'
import { useTheme } from 'vuetify'
import { upperFirst } from 'lodash'
import { getExample } from 'virtual:examples'
import AskAnnaExampleMissing from './AskAnnaExampleMissing.vue'

const props = defineProps({
    inline: Boolean,
    hideInvert: {
        type: Boolean,
        default: true
    },
    file: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: '',
        required: false,
    },
    open: Boolean,
    preview: Boolean,
})

function parseTemplate(target: string, template: string) {
    const string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`
    const regex = new RegExp(string, 'g')
    const parsed = regex.exec(template) || []

    return parsed[1] || ''
}

const isLoaded = ref(false)
const isError = ref(false)
const showCode = ref(props.inline || props.open)
const template = ref(0)
const hasRendered = ref(false)

const component = shallowRef()
const code = ref<string>()
const sections = ref<{ name: string, content: string, language: string }[]>([])
const ExampleComponent = computed(() => {
    return isError.value ? AskAnnaExampleMissing : isLoaded.value ? component.value : null
})

onMounted(importExample)

async function importExample() {
    try {
        const {
            source: _code,
            component: _component,
        } = await getExample(props.file)

        component.value = _component
        code.value = _code
        sections.value = [
            {
                name: 'template',
                language: 'html',
                content: parseTemplate('template', _code),
            },
            {
                name: 'script',
                language: 'javascript',
                content: parseTemplate('script', _code),
            },
            {
                name: 'style',
                language: 'css',
                content: parseTemplate('style', _code),
            },
        ].filter(v => v.content)
        isLoaded.value = true
        isError.value = false
    } catch (e) {
        console.error(e)
        isLoaded.value = true
        isError.value = true
    }
}
const parentTheme = useTheme()
const _theme = ref<null | string>(null)
const theme = computed({
    get: () => _theme.value ?? parentTheme.name.value,
    set: val => _theme.value = val,
})
const toggleTheme = () => theme.value = theme.value === 'light' ? 'dark' : 'light'

const isDark = computed(() => {
    return parentTheme.current.value.dark
})

const actions = computed(() => {
    const array = []

    if (!props.hideInvert) {
        array.push({
            icon: 'mdi-theme-light-dark',
            path: 'invert-example-colors',
            onClick: toggleTheme,
        })
    }

    return [
        ...array,
        {
            icon: !showCode.value ? 'mdi-code-tags' : 'mdi-chevron-up',
            path: !showCode.value ? 'view-source' : 'hide-source',
            onClick: () => {
                showCode.value = !showCode.value
            },
        },
    ]
})
</script>