<route>
{
  meta: {
    order: 2,
    requiresAuth: false,
    title: 'Colors'
  }
}
</route>

<script setup>
import AskAnnaExample from '../../components/AskAnnaExample.vue'
</script>
# Colors
AskAnna has configured theme colors in both the Vuetify and Tailwind CSS. If you need to update these theme colors, you can make changes to the relevant configuration files, which are:

- `/tailwind.config.js`: in this file, you can define the theme colors by extending the default Tailwind CSS configuration. You can modify the color values here to update the theme colors.
 - `/src/plugins/vuetify.ts`: in this file, you can configure the Vuetify theme by using the theme property. You can update the theme colors in the Vuetify by modifying the color values in this file.


## Main colors in theme
<AskAnnaExample file="colors/ExampleColors" />
