<template>
  <a-card style="margin: 0 40px">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="指纹用印">
        <fingerprint-list :reload="fingerprintLoad" :userId="userId" @file-modal="fileModal" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="普通用印" force-render>
        <base-apply-list :reload="baseLoad" :userId="userId" @file-modal="fileModal" />
      </a-tab-pane>
    </a-tabs>
    <modal
      v-model:visible="visible"
      :processList="processList"
      v-model:loading="loading"
      :current="current"
      :type="status"
      @modalSubmit="modalSubmit"
    />
  </a-card>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import BaseApplyList from './components/baseApplyList'
import FingerprintList from './components/fingerprintList'
import modal from './components/modal'
import { getSealProcessList } from '@/apis/businessManage'
import { sendArchived } from '@/apis/seal'
import { cmsNotice } from '@/utils/utils'
export default defineComponent({
  components: {
    BaseApplyList,
    FingerprintList,
    modal
  },
  setup() {
    const store = useStore()
    const userId = computed(() => store.state.user.userInfo.userId)
    const state = reactive({
      visible: false,
      activeKey: '1',
      baseApplyList: [],
      loading: false,
      current: undefined,
      status: 'send',
      processList: [],
      fingerprintLoad: false,
      baseLoad: false
    })
    const getSealProcess = async () => {
      const res = await getSealProcessList()
      state.processList = res.data
    }

    const fileModal = (current, status) => {
      state.current = current
      state.status = status
      state.visible = true
    }
    const modalSubmit = async values => {
      const res = await sendArchived(JSON.stringify(values))
      if (res.success) {
        cmsNotice('success', '归档成功')
        if (state.activeKey === '1') {
          state.fingerprintLoad = !state.fingerprintLoad
        } else {
          state.baseLoad = !state.baseLoad
        }
      }
      state.visible = false
      state.loading = false
    }
    onMounted(() => {
      getSealProcess()
    })

    return {
      ...toRefs(state),
      fileModal,
      userId,
      modalSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .ant-select {
  .ant-select-selector {
    height: 36px;
    border-radius: 4px;
    line-height: 36px;
  }
  .ant-select-selection-placeholder {
    line-height: 36px;
  }
  .ant-select-selection-item {
    line-height: 36px;
  }
}
</style>
