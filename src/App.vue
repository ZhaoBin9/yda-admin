<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
<script>
import locale from 'ant-design-vue/es/locale/zh_CN.js'
export default {
  data() {
    return {
      locale
    }
  }
}
</script>
<style lang="scss"></style>
