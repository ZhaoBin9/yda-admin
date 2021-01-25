<template>
  <a-modal class="video-info" :visible="visible" title="详细内容" @cancel="handleVisible" :footer="false" width="780px">
    <div class="title">{{ info?.title }}</div>
    <video v-if="visible" class="video" :src="info?.fullVideo" controls></video>
    <div class="summary">{{ info?.summary }}</div>
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
.video-info {
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    letter-spacing: 1px;
  }
  .video {
    margin-top: 20px;
    width: 100%;
  }
  .summary {
    margin-top: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 25px;
  }
}
</style>
