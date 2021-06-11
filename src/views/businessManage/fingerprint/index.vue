<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" allowClear :maxlength="20" v-model:value="searchVal" placeholder="请输入姓名或账号">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="fingerColumns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #id1="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #action><a @click="openModal">查看</a></template>
    </a-table>
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { fingerColumns } from './columns'
import tableHeader from '@/views/components/tableHeader'
import { getFingerList } from '@/apis/businessManage'
export default defineComponent({
  components: {
    tableHeader
  },
  setup() {
    const state = reactive({
      searchVal: undefined,
      fingerColumns,
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        'show-total': total => `总共${total}条数据`,
        index: 0
      },
      dataSource: [],
      visible: false,
      currentData: undefined,
      tableLoading: true
    })

    const getList = async () => {
      state.tableLoading = true
      const params = {
        search: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getFingerList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const openModal = () => {
      state.visible = true
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      searchList,
      openModal,
      handleTableChange
    }
  }
})
</script>

<style lang="scss" scoped></style>
