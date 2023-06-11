import type { AxiosResponse } from 'axios'
import { AbstractApiService } from './AbstractApiService'
import type { Page } from '@/types/Page'

class PageApiService extends AbstractApiService {
  public constructor() {
    super('/pages')
  }

  public getPages(): Promise<Page[]> {
    return this.http
      .get('/pages')
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public getPage(id: number): Promise<Page> {
    return this.http
      .get(`/pages/${id}`)
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public postPage(page: Page): Promise<void> {
    return this.http
      .post('/pages', page)
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public updatePage(id: number, page: Page): Promise<void> {
    return this.http
      .patch(`/pages/${id}`, page)
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public destroyPage(id: number): Promise<AxiosResponse> {
    return this.http.delete(`/pages/${id}`).catch(this.handleError.bind(this))
  }
}

export const pageApiService: PageApiService = new PageApiService()
