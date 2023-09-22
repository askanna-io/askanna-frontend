<route>
{
  meta: {
    order: 6,
    requiresAuth: false,
    title: 'AskAnna components'
  }
}
</route>
<script setup>
import AskAnnaExample from '../../components/AskAnnaExample.vue'
import TheHighlight from '/src/components/highlight/TheHighlight.vue'
import AskAnnaLoadingProgress from '/src/components/AskAnnaLoadingProgress.vue?raw'
</script>

# Logo
<AskAnnaExample file="askanna-components/ExampleLogo"  title="Default AskAnna logo, with link to '/'"/>

# Loading

For showing load state we make AskAnnaLoadingProgress сomponent.
<div class="not-prose  pb-10">
<AskAnnaExample file="askanna-components/ExampleLoading"  title="Default state"/>
<AskAnnaExample file="askanna-components/ExampleLoadingTitle"  title="Custom title"/>
</div>

# Card
<AskAnnaExample file="askanna-components/ExampleCard"  title="Simple with title and text"/>
<AskAnnaExample file="askanna-components/ExampleCardFlat"  title="Simple with title and text and flat style"/>
<AskAnnaExample file="askanna-components/ExampleCardWithButtons"  title="Title, text and buttons"/>



