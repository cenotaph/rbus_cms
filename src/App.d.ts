export {}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: VueAuth
  }
}
