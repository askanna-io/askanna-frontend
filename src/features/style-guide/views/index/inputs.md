<route>
{
  meta: {
    order: 4,
    title: 'Inputs',
    requiresAuth: false,
  }
}
</route>
<script setup>
import AskAnnaExample from '../../components/AskAnnaExample.vue'
import TheHighlight from '/src/components/highlight/TheHighlight.vue'
import AskAnnaTextField from '/src/components/AskAnna/AskAnnaTextField.vue?raw'
</script>

# Inputs

For text, number and email inputs we use [VTextField](https://vuetifyjs.com/en/components/text-fields/#text-fields) vuetify component with predefined **props**:
 - color: primary
 - density: compact
 - variant: outlined

<div class="not-prose  pb-10">
<span>Code of the <strong>AskAnnaTextField</strong> component:</span>
  <TheHighlight
      readonly
      :languageName="'js'"
      :value="AskAnnaTextField"
  />
</div>
  
<AskAnnaExample file="inputs/ExampleTextnput"  title="Input normal state"/>
<AskAnnaExample file="inputs/ExampleErrorTextnput"  title="Input with error"/>
<AskAnnaExample file="inputs/ExampleValueTextnput"  title="Input with init value"/>
<AskAnnaExample file="inputs/ExampleDisableTextnput"  title="Input disabled"/>

