import { AbstractApiService } from './AbstractApiService'
import type { Attachment } from '@/types/Attachment'

class AttachmentApiService extends AbstractApiService {
  public constructor() {
    super()
  }

  public upload(attachment: FormData): Promise<Attachment> {
    return this.http
      .post('/attachments/upload', attachment, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }
}

export const attachmentApiService: AttachmentApiService = new AttachmentApiService()
