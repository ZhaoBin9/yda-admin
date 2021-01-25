<template>
  <a-modal
    class="holiday-hotel-info"
    :visible="visible"
    title="详细内容"
    @cancel="handleVisible"
    :footer="false"
    width="800px"
  >
    <div class="title">{{ info?.name }}</div>
    <div class="summary">
      <div class="image" :style="{ backgroundImage: `url(${info?.coverImage})` }"></div>
      <div class="list">
        <div class="span">房&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价：{{ info?.price }} 元</div>
        <div class="span">营业时间：{{ info?.time }}</div>
        <div class="span">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：{{ info?.phone }}</div>
        <div class="span">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：{{ info?.address }}</div>
      </div>
    </div>
    <div class="ppt-list">
      <a-image
        class="item"
        v-for="item in info?.PPTList"
        :src="`${item.url}?uploadFile=500x500`"
        :key="item.uid"
      ></a-image>
    </div>
    <div class="content">
      <div v-if="info && info.summary" class="line">
        <div class="h">酒店简介</div>
        <div class="text" v-html="info?.summary.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')"></div>
      </div>
      <div v-if="info && info.features" class="line">
        <div class="h">酒店特色</div>
        <div class="text" v-html="info?.features.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')"></div>
      </div>
      <div v-if="info && info.slogan" class="line">
        <div class="h">宣传语</div>
        <div class="text" v-html="info?.slogan.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')"></div>
      </div>
      <div v-if="info && info.info" class="line">
        <div class="h">交通信息</div>
        <div class="text" v-html="info?.info.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')"></div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: '',
  props: {
    visible: Boolean,
    handleVisible: Function,
    info: Object
  }
}
</script>
<style lang="scss">
.holiday-hotel-info {
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    line-height: 50px;
    letter-spacing: 1px;
  }
  .summary {
    display: flex;
    justify-content: flex-start;
    .image {
      width: 440px;
      height: 264px;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      background-color: #ccc;
    }
    .list {
      font-weight: 500;
      margin: 0 0 0 60px;
      .span {
        margin-bottom: 20px;
      }
    }
  }
  .ppt-list {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
    .item {
      cursor: pointer;
      width: 140px;
      height: 140px;
      margin-right: 10px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
    }
  }
  .content {
    margin-top: 30px;
    color: #585f65;
    line-height: 25px;
    font-size: 14px;
    .line {
      margin-top: 30px;
      .h {
        font-weight: 500;
      }
    }
  }
}
</style>
