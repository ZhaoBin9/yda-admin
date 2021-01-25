<template>
  <div class="page qa">
    <a-table
      bordered
      size="middle"
      :columns="columns"
      :data-source="listData"
      :pagination="{
        total: total,
        current: current,
        pageSize: pageSize
      }"
      @change="onChange"
      rowKey="id"
    >
      <template #actions="{ record: { id } }">
        <a-space size="small">
          <a-button size="small" class="sort btn" @click="handleInfo(id)">详细</a-button>
        </a-space>
      </template>
    </a-table>
    <!-- 详细组件 -->
    <info :visible="infoModal.show" :handle-visible="handleInfoVisible" :info="infoModal.data"></info>
  </div>
</template>

<script>
import info from './info'
import { getUserList, getQAList } from '@/apis/qa'

const columns = [
  {
    title: '提交编号',
    dataIndex: 'id',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '操作',
    align: 'center',
    slots: { customRender: 'actions' }
  }
]

export default {
  name: '',
  data() {
    return {
      columns,
      listData: [],
      infoModal: {
        show: false,
        data: null
      },
      current: 1,
      pageSize: 10,
      total: 0
    }
  },
  components: {
    info
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getUserList({
        isPagination: true,
        orderByCreateTime: false,
        pageSize: this.pageSize,
        pageIndex: this.current
      }).then(res => {
        const { data, code, totalItem } = res
        if (code === 0) {
          this.listData = data
          this.total = totalItem
        }
      })
    },
    onChange(pager) {
      this.current = pager.current
      this.getData()
    },
    handleInfo(id) {
      this.infoModal.data = []
      getQAList(1, {
        answerId: id
      }).then(res => {
        this.infoModal.show = true
        const { code, data } = res
        if (code === 0) {
          this.infoModal.data = data.questionDTOS
        }
      })
    },
    handleInfoVisible() {
      this.infoModal.show = false
    }
  }
}
</script>

<style lang="scss">
.qa {
  .ant-table-wrapper {
    margin-top: 30px;
  }
}
</style>
