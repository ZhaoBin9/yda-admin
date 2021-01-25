<template>
  <div class="basic-layout">
    <nav-menu></nav-menu>
    <my-header></my-header>
    <div class="page-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import navMenu from '@/components/NavMenu/index'
import myHeader from '@/components/Header/index'
export default {
  components: {
    navMenu,
    myHeader
  },
  setup() {}
}
</script>

<style lang="scss">
.basic-layout {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  color: #fff;
  .page-view {
    position: absolute;
    left: 256px;
    bottom: 0;
    right: 0;
    top: 65px;
    overflow: auto;
    padding: 30px 0;
    .page {
      padding: 0 40px;
      min-width: 1336px - 256px;
    }
  }
}
</style>
