<template>
  <div style="height: 10px"></div>
  <a-timeline-item>
    <template #dot>
      <div class="time-progess">{{ item.index + 1 }}</div>
    </template>
    <section :class="{ 'time-sec': true, 'time-trans': item.index }">
      <img class="time-avatar" :src="item.avatarId ? item.fullAvatar : require('@/assets/images/default-avatar.png')" />
      <p class="time-name">{{ item.name }}</p>
      <p
        :style="item.state ? { color: approvalStatusObj[item.state].color } : { color: 'red' }"
        :class="item.index === 0 ? 'time-action' : 'time-action actions'"
      >
        {{ item.index === 0 ? '发起申请' : approvalStatusObj[item.state]?.text }}
      </p>
      <p class="time-create">{{ item.examineTime }}</p>
    </section>
    <label-text v-if="item.state === 3 || item.state === 4" title="原因" :noBottom="true" :text="item.opinion || '--'">
    </label-text>
  </a-timeline-item>
</template>

<script>
import LabelText from '@/components/LabelText'
const approvalStatusObj = {
  1: {
    text: '暂无状态',
    color: 'gary'
  },
  2: {
    text: '审批中',
    color: '#ccc'
  },
  3: {
    text: '已同意',
    color: '#43CF75'
  },
  4: {
    text: '已拒绝',
    color: 'red'
  }
}
export default {
  components: {
    LabelText
  },
  name: 'approval-show-list-item',
  props: ['item', 'deleteApprovalFn', 'isRemove'],
  setup() {
    return {
      approvalStatusObj
    }
  }
}
</script>

<style lang="less" scoped>
:v-deep .ant-timeline-item-content {
  margin-left: 20px;
}
.time-progess {
  width: 20px;
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
  margin-top: 5px;
  margin-bottom: 10px;
  transform: translateY(-6px);
  display: flex;
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .time-avatar {
    width: 32px;
    height: 32px;
    object-fit: cover;
    margin-right: 5px;
    border-radius: 4px;
    transform: translateY(5px);
  }
  .time-name {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 32px;
    margin: 0 30px 0 0;
  }
  .time-action {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
    margin-right: 33px;
  }
  .time-create {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}
</style>
