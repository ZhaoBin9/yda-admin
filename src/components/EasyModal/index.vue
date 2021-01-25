<template>
  <div class="easy-modal">
    <a-modal
      :title="state.title || '提示'"
      :dialogClass="state.class || ''"
      :width="state.width || '520px'"
      v-model:visible="state.visible"
      @ok="ok"
      @cancel="cancel"
      :cancel-text="state.cancelText || '取消'"
      :ok-text="state.confirmText || '确定'"
      :ok-type="state.okType || 'default'"
    >
      <slot></slot>
    </a-modal>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
export default {
  name: 'EasyModal',
  props: {
    visible: Boolean,
    class: String,
    okText: String,
    cancelText: String,
    okType: String,
    title: String,
    width: String,
    handleOk: Function,
    handleCancel: Function
  },
  components: {},
  setup(props) {
    const state = reactive({
      visible: computed(() => props.visible),
      title: computed(() => props.title),
      width: computed(() => props.width),
      cancelText: computed(() => props.cancelText),
      okText: computed(() => props.okText),
      okType: computed(() => props.okType),
      class: computed(() => props.class)
    })
    const ok = () => {
      props.handleOk()
    }
    const cancel = () => {
      props.handleCancel()
    }
    onMounted(() => {})
    return {
      state,
      ok,
      cancel
    }
  }
}
</script>
<style lang="scss"></style>
