<template>
  <div class="page tradition-celebrity">
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
    </a-table>
  </div>
</template>

<script>
import { getList } from '@/apis/suggest'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    width: 110,
    align: 'center'
  },
  {
    title: '电话',
    dataIndex: 'phone',
    ellipsis: true,
    width: 120,
    align: 'center'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
    width: 200,
    align: 'center'
  },
  {
    title: '意见',
    dataIndex: 'opinion',
    ellipsis: true,
    align: 'center'
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
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getList({
        isPagination: true,
        orderBySortIndex: true,
        orderByTop: true,
        orderByPublishTime: false,
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
      console.log(pager)
      this.current = pager.current
      this.getData()
    },
    handleInfo(id) {
      const data = this.listData.find(item => item.id === id)
      this.infoModal.data = this.infoInit(data)
      this.infoModal.show = true
    },
    handleInfoVisible() {
      this.infoModal.show = false
    }
  }
}
</script>

<style lang="scss">
.tradition-celebrity {
  .ant-table-wrapper {
    margin-top: 30px;
  }
}
</style>
