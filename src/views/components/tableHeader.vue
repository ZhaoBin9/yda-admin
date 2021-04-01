<template>
  <a-row class="coms-table-header">
    <slot></slot>
  </a-row>
</template>

<script>
export default {}
</script>

<style lang="scss">
::v-deep .ant-select-selector {
  height: 36px !important;
}
.coms-table-header {
  > .sec-input {
    width: 240px;
    height: 36px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
  }
  > .input-label {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 36px;
    display: inline-block;
    margin: 0 8px 0 20px;
  }
  > .basic-btn {
    // width: 80px;
    padding: 0 26px;
    height: 36px;
    opacity: 1;
    background: #c3161c;
    border-radius: 5px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    line-height: 36px;
    margin-left: 20px;
  }
  > .add-btn {
    width: 108px;
    height: 36px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #c3161c;
    border-radius: 5px;
    margin-left: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #c3161c;
    line-height: 36px;
  }
}
</style>
