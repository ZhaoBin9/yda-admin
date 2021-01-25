<template>
  <a-modal
    class="qa-info"
    :bodyStyle="{ minHeight: '400px' }"
    :visible="visible"
    title="详细内容"
    @cancel="handleVisible"
    :footer="false"
    width="780px"
  >
    <div class="qa-list">
      <div v-for="item in info" :key="item.id" class="item">
        <div class="q">{{ item.id }}、{{ item.question }}</div>
        <div class="a">
          <template v-if="item.type === 2">
            <div
              class="text"
              v-html="item.answer ? item.answer.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;') : '暂无'"
            ></div>
          </template>
          <template v-else>
            <a-checkbox v-for="child in item.optionAll" :key="child.id" :checked="child.check">
              {{ child.options }}
            </a-checkbox>
          </template>
        </div>
      </div>
    </div>
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
.qa-info {
  .qa-list {
    .item {
      margin-bottom: 25px;
      .a {
        margin-top: 5px;
      }
      .ant-checkbox-wrapper {
        margin: 0;
      }
    }
  }
}
</style>
