<template>
  <a-modal
    class="moving-announcement-info"
    :visible="visible"
    title="详细内容"
    @cancel="handleVisible"
    :footer="false"
    width="780px"
  >
    <div class="title">{{ info?.title }}</div>
    <div class="content" v-html="info?.content"></div>
  </a-modal>
</template>

<script>
export default {
  name: '',
  props: {
    visible: {
      type: Boolean
    },
    handleVisible: {
      type: Function
    },
    info: {
      type: Object
    }
  }
}
</script>
<style lang="scss">
.moving-announcement-info {
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    letter-spacing: 1px;
  }
  .content {
    margin-top: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 25px;
  }
}
</style>
