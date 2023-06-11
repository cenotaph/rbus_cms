<template lang="pug">
section.section
  h2.title Edit page:
  .loading(v-if="loading")
    img(src="@/assets/images/loading.gif")
  div(v-else)
    .tabs
      ul
        li(:class="activeLocale === 'en' ? 'is-active' : ''")
          a(@click="activeLocale = 'en'") English 
        li(:class="activeLocale === 'fi' ? 'is-active' : ''")
          a(@click="activeLocale = 'fi'") Suomi 
    div(v-show="activeLocale === 'en'")
      .field
        label.label Title in English (required):
        input.input(v-model='page.title_en')
      .field
        label.label Short description in English (required):
        editor(v-bind='$attrs' v-model:content='page.description_en')
      .field
        label.label Ful page text in English (required):
        editor(v-bind='$attrs' v-model:content='page.content_en')
    div(v-show="activeLocale === 'fi'")
      .field
        label.label Title in Finnish (optional):
        input.input(v-model='page.title_fi')
      .field
        label.label Content in Finnish (optional):
        editor(v-bind='$attrs' v-model:content='page.description_fi')
      .field
        label.label Ful page text in Finnish (optional):
        editor(v-bind='$attrs' v-model:content='page.content_fi')
    div(v-if='errors')
      fieldset.errors
        legend Errors:
        p.error
          | {{ errors }}
    .field
      .control.buttons.is-grouped
        img(v-if='submitting' src='@/assets/images/loading.gif')
        button.button.is-link(v-else @click="submitPage")
          span(v-if="page.id") Update 
          span(v-else) Create
        a.button.is-secondary(href="/pages") Cancel
  
</template>

<script lang="ts">
//@ts-nocheck
import { attachmentApiService } from '@/services/AttachmentDataService'
import { pageApiService } from '@/services/PageDataService'
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Editor from '../shared/Editor.vue'
import type { Page } from '@/types/Page'
import type { AxiosError } from 'axios'
import { useAuth } from '@websanova/vue-auth/src/v3.js'

export default defineComponent({
  components: {
    Editor
  },
  setup() {
    const auth = useAuth()
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      page: {
        description_en: '',
        description_fi: '',
        content_en: '',
        content_fi: ''
      } as Page,
      activeLocale: 'en',
      loading: true,
      submitting: false,
      errors: undefined
    })

    const submitPage = async () => {
      state.errors = undefined
      state.submitting = true
      try {
        if (route.params.id) {
          await pageApiService.updatePage(route.params.id, state.page)
        } else {
          await pageApiService.postPage(state.page)
        }
        state.submitting = false
        router.push({ name: 'pages-list' })
      } catch (error) {
        const err = error as AxiosError<any>
        state.errors = err.response?.data.message
        state.submitting = false
      }
    }

    const retrievePage = (id) => {
      pageApiService.getPage(id).then((response) => {
        state.page = response
        state.loading = false
      })
    }

    onMounted(async () => {
      if (route.params.id) {
        retrievePage(route.params.id)
      } else {
        state.loading = false
      }
    })

    return {
      ...toRefs(state),
      submitPage
    }
  }
})
</script>
