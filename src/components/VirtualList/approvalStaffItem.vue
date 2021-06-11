<template>
  <a-checkbox :value="item.id" @change="onChange">
    <div style="display: inline-block; margin: 5px 0;">
      <img
        class="approval-img"
        :src="item.avatarId ? item.fullAvatar : require('@/assets/images/default-avatar.png')"
      />
      <p class="approval-name">{{ item.name }}</p>
    </div>
  </a-checkbox>
</template>

<script>
export default {
  name: 'approval-staff-item',
  props: ['item', 'onChange']
}
</script>

<style>
.ant-checkbox-group {
  display: flex;
  flex-direction: column;
}
.approval-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  transform: translateY(10px);
  margin-right: 4px;
}
.approval-name {
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  display: inline-block;
  line-height: 32px;
}
</style>
