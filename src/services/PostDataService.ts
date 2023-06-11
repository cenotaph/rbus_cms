import { injectStrict } from '@/utils/injectTyped'
import { AxiosKey } from '@/symbols'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { AbstractApiService } from './AbstractApiService'
import type { Post } from '@/types/Post'

class PostApiService extends AbstractApiService {
  public constructor() {
    super()
  }
  public getPosts(): Promise<Post[]> {
    return this.http
      .get('/posts')
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public getPost(id: number): Promise<Post> {
    return this.http
      .get(`/posts/${id}`)
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public postPost(post: Post): Promise<void> {
    return this.http
      .post('/posts', post)
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }

  public updatePost(id: number, post: Post): Promise<void> {
    return this.http
      .patch(`/posts/${id}`, post)
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }
  public destroyPost(id: number): Promise<AxiosResponse> {
    return this.http.delete(`/posts/${id}`).catch(this.handleError.bind(this))
  }
}

export const postApiService: PostApiService = new PostApiService()
