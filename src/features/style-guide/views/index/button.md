<route>
{
  meta: {
    order: 4,
    requiresAuth: false,
    title: 'Button styles'
  }
}
</route>
<script setup>
import AskAnnaExample from '../../components/AskAnnaExample.vue'
import TheHighlight from '/src/components/highlight/TheHighlight.vue'
import AskAnnaButton from '/src/components/AskAnna/AskAnnaButton.vue?raw'
</script>

# Buttons

For button we use [VBtn](https://vuetifyjs.com/en/components/buttons/#buttons) vuetify component with predefined **props**:
 - size: small
 - variant: outlined

<div class="not-prose  pb-10">
<span>Code of the <strong>AskAnnaButton </strong> component:</span>
  <TheHighlight
      readonly
      :languageName="'js'"
      :value="AskAnnaButton"
  />
</div>
<AskAnnaExample file="buttons/ExampleButton"  title="Button default AskAnna style"/>
<AskAnnaExample file="buttons/ExampleButtonIcon"  title="Default button with icon"/>
<AskAnnaExample file="buttons/ExampleButtonText"  title="Button variant text"/>
<AskAnnaExample file="buttons/ExampleButtonDisabled"  title="Disabled button"/>
<AskAnnaExample file="buttons/ExampleButtonLoading"  title="Loading button"/>
<AskAnnaExample file="buttons/ExamplePrimaryButton"  title="Button primary color,  variant elevated"/>
<AskAnnaExample file="buttons/ExampleActivatorButton"  title="Button used in menu as activator, with only icon on mobile version"/>
