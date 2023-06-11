<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuth } from '@websanova/vue-auth/dist/v3/vue-auth'

export default defineComponent({
  setup() {
    const componentKey = ref(0)
    const auth = useAuth()
    const forceRerender = (trigger: boolean) => {
      console.log('rendering new value', componentKey.value + 1)
      componentKey.value += 1
    }
    const logout = () => {
      auth.logout({
        makeRequest: false,
        redirect: { name: 'Login' }
      })
    }
    return { componentKey, forceRerender, logout }
  }
})
</script>

<template lang="pug">

nav.navbar(v-if="$auth.check()")
  .navbar-brand
    img(src="@/assets/images/logo.jpg" width="100")
  .navbar-menu
    .navbar-start
      RouterLink.navbar-item(:to="{name: 'posts-list'}") Posts
      RouterLink.navbar-item(:to="{name: 'pages-list'}") Pages
    .navbar-end
      .navbar-item
        | Signed in as {{ $auth.user().name }}
      .navbar-item(@click="logout") Log out
RouterView(:key="$route.fullPath")
</template>

<style lang="scss">
@import '@/assets/css/base.scss';
</style>
