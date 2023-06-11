import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import http from '@/http'

export function isAxiosError(value: any): value is AxiosError {
  return typeof value?.response === 'object'
}

export abstract class AbstractApiService {
  protected readonly http: AxiosInstance = http

  protected constructor(
    protected readonly path?: string // protected readonly baseURL: string = import.meta.env.VITE_API_URL ?? '/'
  ) {
    // this.axios = http.create({
    //   axios.baseURL,
    //   // ... further stuff, e.g. `withCredentials: true`
    // })
    // axios.defaults.headers.common['Accept'] = 'application/jsoncharset=UTF-8'
    // axios.defaults.headers.common['Content-Type'] = 'application/jsoncharset=UTF-8'
  }

  protected createParams(record: Record<string, any>): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams()
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        const value: any = record[key]
        if (value !== null && value !== undefined) {
          params.append(key, value)
        } else {
          console.debug(`Param key '${key}' was null or undefined and will be ignored`)
        }
      }
    }
    return params
  }

  protected handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data
  }

  protected handleError(error: unknown): any {
    console.log('entered protected handleError with: ')
    console.log(error)
    if (error instanceof Error) {
      if (isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
          throw error
          // return error.response.data.messages
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser
          console.log(error.request)
          throw new Error(error as any)
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('E@rror', error.message)
        throw new Error(error.message)
      }
    }
    throw new Error(error as any)
  }
}
