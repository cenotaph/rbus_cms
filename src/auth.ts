//@ts-nocheck
import { createAuth } from '@websanova/vue-auth/dist/v3/vue-auth'
import * as driverHttpAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x'
import * as driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x'
import router from './router'
import http from '@/http'

export default (app) => {
  app.use(
    createAuth({
      plugins: {
        http: http,
        router: router
      },
      drivers: {
        http: driverHttpAxios,
        // auth: driverAuthBearer,
        auth: {
          request: function (req, token) {
            driverHttpAxios.setHeaders.call(this, req, {
              Authorization: 'Bearer ' + token
            })
            // Set auth_refresh_token on every request
            driverHttpAxios.setHeaders.call(this, req, {
              Refresh: this.token(this.options.refreshTokenKey)
            })
          },
          response: function (res) {
            const headers = driverHttpAxios.getHeaders.call(this, res)
            let token = headers.Authorization || headers.authorization

            // Set auth_refresh_token if available
            const refresh_token = headers.Refresh || headers.refresh
            if (refresh_token) this.token(this.options.refreshTokenKey, refresh_token)

            if (token) {
              token = token.split(/Bearer:?\s?/i)
              return token[token.length > 1 ? 1 : 0].trim()
            }
          }
        },
        router: driverRouterVueRouter
      },
      options: {
        refreshTokenKey: 'auth_refresh_token',
        stores: ['localStorage', 'storage'],
        loginData: {
          url: import.meta.env.VITE_API_URL + '/authentication/login',
          method: 'POST',
          redirect: '/'
        },
        fetchData: {
          url: '/authentication/user'
        },
        parseUserData: function (data: any) {
          return data
        },
        refreshData: {
          url: '/authentication/refresh',
          method: 'POST',
          enabled: true,
          interval: 4
        },

        notFoundRedirect: { name: 'Login' }
      }
    })
  )
}
