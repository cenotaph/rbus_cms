<template lang="pug">
section.section 
  .container
    h2.title Pages

    a.button.is-link(href="/pages/new") Create new page
    table.table 
      thead
        th id
        th Title 
        th Slug
        th &nbsp;
      tbody
        tr(v-for="page in pages")
          td {{ page.id }}
          td
            | {{ page.title_en }}
            br/
            | {{  page.title_fi }}
          td  
            | {{  page.slug }}
          td
            Router-Link.button.is-link(:to="{name: 'page-edit', params: {id: page.id}}") Edit
</template>

<script lang="ts">
import { pageApiService } from '@/services/PageDataService'
import type { Page } from '@/types/Page'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const state = reactive({
      pages: [] as Page[],
      loading: true
    })

    const retrievePages = async () => {
      state.pages = await pageApiService.getPages()
      state.loading = false
    }

    onMounted(async () => {
      await retrievePages()
    })
    return { ...toRefs(state) }
  }
})
</script>
