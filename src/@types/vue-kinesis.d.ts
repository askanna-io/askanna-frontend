declare module 'vue-kinesis' {
  import Vue, { PluginFunction, WatchOptions } from 'vue'

  class VueKinesis {
    static install: PluginFunction<never>
    static config: {
      autoSetContainer: boolean
      appendToBody: boolean
    }
  }
  export default VueKinesis
}
