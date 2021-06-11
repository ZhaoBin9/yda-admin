<template>
  <div style="height: 10px"></div>
  <a-timeline-item color="red">
    <template #dot>
      <div class="time-progess">{{ item.index + 1 }}</div>
    </template>
    <section class="time-sec">
      <div class="time-info">
        <img
          class="time-avatar"
          :src="item.avatarId ? item.fullAvatar : require('@/assets/images/default-avatar.png')"
        />
        <p class="time-name">{{ item.name || item.userName }}</p>
      </div>
      <svg class="remove-arrow" v-if="isRemove" @click="deleteApprovalFn(item)">
        <use xlink:href="#iconshanchu"></use>
      </svg>
    </section>
  </a-timeline-item>
</template>

<script>
export default {
  name: 'approval-list-item',
  props: ['item', 'deleteApprovalFn', 'isRemove']
}
</script>

<style lang="less" scoped>
:v-deep .ant-timeline-item-content {
  margin-left: 20px;
}
.time-progess {
  min-width: 20px;
  height: 20px;
  background: #c3161c;
  border-radius: 50%;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
}
.time-sec {
  padding-left: 24px;
  margin-bottom: 10px;
  transform: translateY(-8px);
  display: flex;
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .remove-arrow {
    width: 20px;
    height: 20px;
    // margin-top: 7px;
    transform: translateY(23px);
    cursor: pointer;
    display: block;
  }
  .time-info {
    .time-avatar {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: cover;
      margin: 0 auto;
    }
  }
  .time-name {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    // line-height: 32px;
    transform: translateY(5px);
    width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}
</style>
