<template lang="pug">
section.section
  h2.title Post:
  .loading(v-if='loading')
    img(src='@/assets/images/loading.gif')
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
        input.input(v-model='post.title_en')
      .field
        label.label Content in English (required):
        editor(v-bind='$attrs' v-model:content='post.body_en')
    div(v-show="activeLocale === 'fi'")
      .field
        label.label Title in Finnish (optional):
        input.input(v-model='post.title_fi')
      .field
        label.label Content in Finnish (optional):
        editor(v-bind='$attrs' v-model:content='post.body_fi')        
    section.section
      img(v-if='post.banner_image' :src='`${urlBase}/${post.banner_image.key}`' width="400")
      p
        br/
        span(v-if="post.banner_image") Replace 
        span(v-else) Attach 
        | banner image? (png/jpg/gif; no SVGs)
        
      p
        
        input(type='file' name='upload' ref='EventfileInput' @change='onFileChanged' accept='image/*')
      p
        img(v-if='previewImage' :src='previewImage' width="500")
      button.is-secondary.button(v-if="needsBanner" @click="uploadImage") Upload image
    .field
      label.checkbox
        input(type='checkbox' v-model='post.published')
        | Published?
    div(v-if='errors')
      fieldset.errors
        legend Errors:
        p.error
          | {{ errors }}
    .field
      .control.buttons.is-grouped
        img(v-if='submitting' src='@/assets/images/loading.gif')
        button.button.is-link(v-else :disabled="needsBanner" @click="submitPost")
          span(v-if="post.id") Update 
          span(v-else) Create
        a.button.is-secondary(href="/posts") Cancel

</template>

<script lang="ts">
//@ts-nocheck
import { attachmentApiService } from '@/services/AttachmentDataService'
import { postApiService } from '@/services/PostDataService'
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Editor from '../shared/Editor.vue'
import type { Post } from '@/types/Post'
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
      post: {
        body_en: '',
        body_fi: ''
      } as Post,
      bannerImage: null,
      needsBanner: false,
      activeLocale: 'en',
      progress: 0,
      urlBase: `${import.meta.env.VITE_API_URL}/uploads/`,
      loading: true,
      submitting: false,
      errors: undefined
    })

    const onFileChanged = ($event: Event) => {
      const target = $event.target as HTMLInputElement
      if (target && target.files) {
        const image = target.files[0]

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
          previewImage.value = fileReader.result
        }
        fileReader.readAsDataURL(target.files[0])
        state.bannerImage = image
        state.needsBanner = true
      }
    }

    const previewImage = ref('')
    const EventfileInput = ref(null)

    const uploadImage = async () => {
      if (state.bannerImage) {
        const formData = new FormData()
        formData.append('file', state.bannerImage)
        try {
          const uploadedAttachment = await attachmentApiService.upload(formData)
          if (uploadedAttachment.id) {
            state.post.banner_image_id = uploadedAttachment.id
            state.needsBanner = false
          }
        } catch (error) {
          const err = error as AxiosError<any>
          state.errors = err.response?.data.message

          state.needsBanner = true
        }
      }
    }
    const submitPost = async () => {
      state.errors = undefined
      state.submitting = true
      let payload = state.post
      delete payload['banner_image']
      delete payload['user']
      if (!state.published) state.published = 'false'
      try {
        if (route.params.id) {
          await postApiService.updatePost(route.params.id, payload)
        } else {
          await postApiService.postPost(payload)
        }
        state.submitting = false
        router.push({ name: 'posts-list' })
      } catch (error) {
        const err = error as AxiosError<any>
        state.errors = err.response?.data.message
        state.submitting = false
      }
    }

    const retrievePost = (id) => {
      postApiService.getPost(id).then((response) => {
        state.post = response
        state.loading = false
      })
    }

    onMounted(async () => {
      if (route.params.id) {
        retrievePost(route.params.id)
      } else {
        state.loading = false
      }
    })

    return {
      ...toRefs(state),
      previewImage,
      submitPost,
      uploadImage,
      onFileChanged
    }
  }
})
</script>
