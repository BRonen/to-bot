module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  overrides: [
    { files: ['*.vue'], rules: { 'vue/valid-v-slot': 'off' } }
  ]
}
