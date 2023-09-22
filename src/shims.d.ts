
declare module 'virtual:examples' {
  import type { Component } from 'vue'

  export function getExample(name: string): Promise<{
    component: Component
    source: string
  }>
}
