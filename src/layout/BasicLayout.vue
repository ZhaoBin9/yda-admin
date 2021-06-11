<template>
  <div class="basic-layout">
    <nav-menu></nav-menu>
    <my-header></my-header>
    <div class="page-view">
      <section class="view-container">
        <div class="bread-crumb">
          <bread-crumb />
        </div>
        <router-view></router-view>
      </section>
    </div>
  </div>
</template>

<script>
import navMenu from '@/components/NavMenu/index'
import myHeader from '@/components/Header/index'
import BreadCrumb from '@/components/BreadCrumb'
export default {
  components: {
    navMenu,
    myHeader,
    BreadCrumb
  },
  setup() {}
}
</script>

<style lang="scss">
.bread-crumb {
  padding-left: 24px;
}
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
    left: 240px;
    bottom: 0;
    right: 0;
    top: 80px;
    overflow-x: scroll;
    background: #f2f3f7;
    width: calc(100% - 240px);
    &::-webkit-scrollbar {
      display: block;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgb(202, 202, 202);
      border-radius: 2px;
    }
    .page {
      padding: 0 40px;
    }
    .view-container {
      width: 100%;
      min-width: 1371px;
    }
  }
}
</style>
