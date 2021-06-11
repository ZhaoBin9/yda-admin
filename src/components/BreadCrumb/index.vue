<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="item in breadList" :key="item">
      <span class="item">{{ item }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'bread-crumb',
  setup() {
    const $route = useRoute()
    const breadList = ref([])
    watch(
      () => $route.fullPath,
      () => {
        breadList.value = []
        if ($route.path === '/seal/applyList/detail') {
          $route.matched[2].meta.title = '用印记录,' + ($route.query.id ? '普通用印详情' : '指纹用印详情')
        }
        $route.matched.slice(1).forEach(item => {
          item.meta.title && breadList.value.push(...item.meta.title.split(','))
        })
      },
      { immediate: true }
    )
    return {
      breadList
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 60px;
  display: inline-block;
  height: 60px;
}
</style>
