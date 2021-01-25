<template>
  <div class="page tradition-course">
    <operation>
      <a-button class="add-btn" type="primary" @click="handleAdd">新增</a-button>
    </operation>
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
          <a-button type="primary" size="small" class="sort btn" @click="handleEdit(id)">编辑</a-button>
          <a-button type="danger" size="small" class="delete btn" @click="handleDelete(id)">删除</a-button>
        </a-space>
      </template>
    </a-table>
    <!-- 详细组件 -->
    <edit
      :visible="editModal.show"
      :title="editModal.title"
      :handle-visible="handleEditVisible"
      :handle-submit="handleSubmit"
      :class-id="classId"
      :info="editModal.data"
    ></edit>
  </div>
</template>

<script>
import operation from '@/components/Operation/index'
import edit from './edit'
import { getList, deleteData } from '@/apis/scenic'
import { Notification, Modal } from 'ant-design-vue'
import moment from 'moment'

const columns = [
  {
    title: '时间',
    dataIndex: 'yearsMonths',
    width: 120,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '事件',
    dataIndex: 'course',
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
      classId: 7,
      columns,
      listData: [],
      editModal: {
        title: '',
        show: false,
        data: null
      },
      current: 1,
      pageSize: 10,
      total: 0
    }
  },
  components: {
    operation,
    edit
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getList({
        classId: this.classId,
        isPagination: true,
        orderByYearsByMonths: false,
        pageSize: this.pageSize,
        pageIndex: this.current
      }).then(res => {
        const { data, code, totalItem } = res
        if (code === 0) {
          this.listData = data.map(item => {
            item.yearsMonths = `${item.years}-${item.months.toString().padStart(2, '0')}`
            return item
          })
          this.total = totalItem
        }
      })
    },
    onChange(pager) {
      this.current = pager.current
      this.getData()
    },
    handleAdd() {
      this.editModal.data = this.infoInit(null)
      this.editModal.title = '新增'
      this.editModal.show = true
    },
    infoInit(data) {
      const { id, course, yearsMonths } = data || {}
      const form = {
        course: course || '',
        yearsMonths: yearsMonths ? moment(yearsMonths, 'YYYY-MM') : null
      }
      if (data) form.id = id
      return form
    },
    handleEdit(id) {
      const data = this.listData.find(item => item.id === id)
      this.editModal.data = this.infoInit(data)
      this.editModal.title = '编辑'
      this.editModal.show = true
    },
    handleDelete(id) {
      Modal.confirm({
        title: '提示',
        content: '确定删除此条数据吗？',
        onOk: () => this.deleteData(id)
      })
    },
    deleteData(id) {
      deleteData({ id }).then(res => {
        const { code } = res
        if (code === 0) {
          Notification.open({
            message: '提示',
            description: '删除成功'
          })
          if (this.listData.length === 1) this.current = 1
          this.getData()
        }
      })
    },
    handleEditVisible() {
      this.editModal.show = false
    },
    handleSubmit() {
      this.handleEditVisible()
      this.current = 1
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.tradition-course {
  .ant-table-wrapper {
    margin-top: 30px;
  }
}
</style>
