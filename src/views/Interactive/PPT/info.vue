<template>
  <a-modal class="ppt-info" :visible="visible" title="详细内容" @cancel="handleVisible" :footer="false" width="780px">
    <div class="title">{{ info?.title }}</div>
    <div class="image" :style="{ backgroundImage: `url(${info?.fullImage}?uploadFile=500x500)` }"></div>
    <div class="summary">{{ info?.summary }}</div>
    <div class="list">
      <div v-for="item in info?.list" :key="item.imageId" class="item">
        <a-image :width="147" class="img" :src="`${item.fullImage}?uploadFile=500x500`"></a-image>
        <div class="sum">{{ item.summary }}</div>
      </div>
    </div>
    <div :class="{ mask: true, show: imageViewShow }" @click="handleHideMask"></div>
    <img :class="{ 'image-view': true, show: imageViewShow }" :src="imageViewUrl" />
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
  },
  data() {
    return {
      imageViewUrl: '',
      imageViewShow: false
    }
  },
  methods: {
    handleImageView(url) {
      this.imageViewShow = true
      this.imageViewUrl = url
    },
    handleHideMask() {
      this.imageViewShow = false
      this.imageViewUrl = ''
    }
  }
}
</script>
<style lang="scss">
.ppt-info {
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
  .summary {
    margin-top: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 25px;
  }
  .list {
    .item {
      display: flex;
      margin-top: 20px;
      .img {
        cursor: pointer;
        flex: 0 0 147px;
        height: 100px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .sum {
        min-height: 100px;
        flex: 1 1 auto;
        background-color: #eee;
        margin-left: 20px;
        padding: 10px 15px;
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    transform: scale(0);
    &.show {
      transform: scale(1);
    }
  }
  .image-view {
    position: fixed;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 50%;
    max-width: 600px;
    transform: translateY(-50%) scale(0);
    &.show {
      transform: translateY(-50%) scale(1);
    }
  }
}
</style>
