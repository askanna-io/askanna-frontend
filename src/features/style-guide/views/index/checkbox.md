<route>
{
  meta: {
    order: 5,
    title: 'Checkboxes',
    requiresAuth: false,
  }
}
</route>
<script setup>
import AskAnnaExample from '../../components/AskAnnaExample.vue'
import TheHighlight from '/src/components/highlight/TheHighlight.vue'
import AskAnnaCheckbox from '/src/components/AskAnna/AskAnnaCheckbox.vue?raw'
</script>

# Checkboxes

For checkbox we use [VCheckbox](https://vuetifyjs.com/en/components/checkboxes/#checkboxes) vuetify component with predefined **props**:
 - color: primary
 - class: h-18

 Aslo we tweak the style for the detail block.

<div class="not-prose  pb-10">
<span>Code of the <strong>AskAnnaCheckbox</strong> component:</span>
  <TheHighlight
      readonly
      :languageName="'js'"
      :value="AskAnnaCheckbox"
  />
</div>
  
<AskAnnaExample file="checkboxes/ExampleCheckbox"  title="Default checkbox"/>

