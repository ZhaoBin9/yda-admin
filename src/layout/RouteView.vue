<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
    <!-- <component :is="Component" v-if="!$route.meta.keepAlive" /> -->
  </router-view>
</template>

<script>
export default {
  name: 'RouteView',
  setup() {}
}
</script>
