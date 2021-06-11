<template>
  <a-card style="margin: 0 40px">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="指纹用印">
        <fingerprint-list :reload="fingerprintLoad" :status="sealStatus" :userId="userId" @file-modal="fileModal" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="普通用印" force-render>
        <base-apply-list :reload="baseLoad" :userId="userId" :status="sealStatus" @file-modal="fileModal" />
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
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'applyList',
  components: {
    BaseApplyList,
    FingerprintList,
    modal
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const userId = computed(() => store.state.user.userInfo.userId)
    const state = reactive({
      visible: false,
      activeKey: route.query.activeKey ? route.query.activeKey : '1',
      baseApplyList: [],
      loading: false,
      current: undefined,
      status: 'send',
      processList: [],
      fingerprintLoad: false,
      baseLoad: false,
      sealStatus: route.query.sealStatus ? ~~route.query.sealStatus : undefined
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
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/seal/applyList/detail') {
      to.matched[2].meta.title = '用印记录,' + (to.query.id ? '普通用印详情' : '指纹用印详情')
    }
    next()
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
