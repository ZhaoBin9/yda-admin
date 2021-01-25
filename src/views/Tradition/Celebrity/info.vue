<template>
  <a-modal
    class="celebrity-info"
    :visible="visible"
    title="详细内容"
    @cancel="handleVisible"
    :footer="false"
    width="780px"
  >
    <div class="title">{{ info?.title }}</div>
    <div class="image" :style="{ backgroundImage: `url(${info?.fullImage})` }"></div>
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
.celebrity-info {
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    letter-spacing: 1px;
  }
  .image {
    margin-top: 20px;
    width: 100%;
    height: 350px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #ccc;
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
