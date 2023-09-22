<route>
{
  meta: {
    order: 3,
    requiresAuth: false,
    title: 'Text and Typography'
  }
}
</route>

<script setup>
import AskAnnaExample from '../../components/AskAnnaExample.vue'
</script>
# Text and typography
## Typography
In AskAnna frontend app we use only three type of sizes:
 - **text-sm**: 14px (font-size: 0.875rem;) -  for text and content inside table
 - **text-base**: 16px (font-size: 1rem;) -  for all text, descriptions, paragraphs
 - **text-xl**: 20px (font-size: 1.25rem;) -  for title

<AskAnnaExample file="text/ExampleText" />