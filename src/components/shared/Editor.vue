<template>
  <QuillEditor
    theme="snow"
    contentType="html"
    :modules="modules"
    :toolbar="quillToolbar"
    :options="quillConfig"
  />
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent, reactive, toRefs } from 'vue'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import htmlEditButton from 'quill-html-edit-button'
import ImageUploader from 'quill-image-uploader'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import http from '@/http'

export default defineComponent({
  components: {
    QuillEditor
  },
  name: 'Editor',
  setup() {
    const Parchment = Quill.import('parchment')
    let config = {
      scope: Parchment.Scope.INLINE
    }
    let blockConfig = {
      scope: Parchment.Scope.BLOCK
    }

    let Link = Quill.import('formats/link')
    class MyLink extends Link {
      static create(value) {
        const node = super.create(value)
        node.removeAttribute('target')
        return node
      }
    }
    Quill.register(MyLink, true)

    let MClass = new Parchment.Attributor.Class('caps', 'small-caps', config)
    let WIClass = new Parchment.Attributor.Class('caps', 'wide-image', blockConfig)
    Quill.register(MClass, true)
    Quill.register(WIClass, true)
    Quill.register({ 'modules/htmlEditButton': htmlEditButton })

    const state = reactive({
      quillToolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'],
        ['image', 'video', 'link'],
        ['wide-image']
      ],
      modules: [
        {
          name: 'htmlEditButton',
          module: htmlEditButton,
          options: {
            debug: false
          }
        },
        {
          name: 'imageUploader',
          module: ImageUploader,
          options: {
            upload: (file: Blob) => {
              return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('file', file)
                const config: any = {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
                http
                  .post('/attachments/upload', formData, config)
                  .then((res) => {
                    console.log(res.data)
                    resolve(`${import.meta.env.VITE_API_URL}/uploads/${res.data.key}`)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              })
            }
          }
        }
      ],
      quillConfig: {
        debug: 'error',
        placeholder: 'Compose an epic...',
        theme: 'snow'
      }
    })

    return { ...toRefs(state) }
  }
})
</script>
