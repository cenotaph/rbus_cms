<template lang="pug">
h2 Login
em Please sign in to the <strong>R-Bus</strong> CMS
section(class="main-content section container is-fullheight")
  .container
    .columns
      .column.is-one-third
        form(v-on:submit.prevent="login()")
            .field
              label.label Email
              input(v-model="state.form.body.email" type="text" class="input")
              .text-danger.text-sm {{ state.form.errors.email }}
            .field
                label.label Password:
                input(v-model="state.form.body.password" class="input" type="password")
                .text-danger.text-sm {{ state.form.errors.password }}
            .field
              input(v-model="state.form.remember" type="checkbox")
              label.label Remember Me
            .field
              .control
                button.button.is-success(type="submitLogin") Login
           
</template>

<script lang="ts">
//@ts-nocheck
import { reactive } from 'vue'
import { onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useAuth } from '@websanova/vue-auth/src/v3.js'

import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const auth = useAuth()
    const toast = useToast()
    const router = useRouter()
    let redirect = auth.redirect()
    const state = reactive({
      form: {
        body: {
          email: '',
          password: ''
        },
        remember: false,
        fetchUser: true,
        staySignedIn: false,
        errors: {} as any
      }
    })
    onMounted(() => {
      console.log('token is: ')
      console.log(auth.token())
    })

    function errors(res) {
      state.form.errors = Object.fromEntries(res.errors.map((item) => [item.field, item.msg]))
    }

    async function login() {
      try {
        await auth.login({
          data: state.form.body,
          fetchUser: true,
          staySignedIn: true,
          redirect: auth.redirect()
        })

        toast.success(`Welcome to the R-Bus CMS, ${auth.user().name}`, {
          timeout: 2000
        })

        if (state.form.remember) {
          auth.remember(
            JSON.stringify({
              name: auth.user().id
            })
          )
        }

        router.push('/posts')
      } catch (error) {
        if (error.code === 'ERR_BAD_REQUEST') {
          toast.error('Incorrect email or password, please try again', {
            timeout: 2000
          })
        }
      }
    }

    return {
      state,
      login
    }
  }
})
</script>
