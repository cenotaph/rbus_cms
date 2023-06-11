<template lang="pug">
section.section 
  .container
    h2.title Posts

    a.button.is-link(href="/posts/new") Create new post
    table.table 
      thead
        th id
        th Title 
        th Published?
        th Posted at
        th &nbsp;
      tbody
        tr(v-for="post in posts")
          td {{ post.id }}
          td {{ post.title_en }} / {{  post.title_fi }}
          td {{ post.published }}
          td {{ post.posted_at }}
          td
            Router-Link.button.is-link(:to="{name: 'post-edit', params: {id: post.id}}") Edit
</template>

<script lang="ts">
import { postApiService } from '@/services/PostDataService'
import type { Post } from '@/types/Post'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const state = reactive({
      posts: [] as Post[],
      loading: true
    })

    const retrievePosts = async () => {
      state.posts = await postApiService.getPosts()
      state.loading = false
    }

    onMounted(async () => {
      await retrievePosts()
    })
    return { ...toRefs(state) }
  }
})
</script>
