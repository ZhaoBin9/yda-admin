<template>
  <div class="page tradition-celebrity">
    <operation>
      <a-button class="add-btn" type="primary" @click="handleAdd">新增</a-button>
    </operation>
    <a-table bordered size="middle" :columns="columns" :data-source="listData" :pagination="false" rowKey="id">
      <template #top="{ record: { top } }">
        {{ +top === 1 ? '是' : '否' }}
      </template>
      <template #online="{record: { online }}">
        {{ +online === 1 ? '上架' : '下架' }}
      </template>
      <template #actions="{ record: { id } }">
        <a-space size="small">
          <a-button type="primary" size="small" class="sort btn" @click="handleEdit(id)">编辑</a-button>
          <a-button type="danger" size="small" class="delete btn" @click="handleDelete(id)">删除</a-button>
        </a-space>
      </template>
    </a-table>
    <edit
      :visible="editModal.show"
      :title="editModal.title"
      :handle-visible="handleEditVisible"
      :handle-submit="handleSubmit"
      :info="editModal.data"
    ></edit>
  </div>
</template>

<script>
import operation from '@/components/Operation/index'
import edit from './edit'
import { getList, deleteData } from '@/apis/class'
import { Notification, Modal } from 'ant-design-vue'

const columns = [
  {
    title: '排序',
    dataIndex: 'sortIndex',
    ellipsis: true,
    width: 100,
    align: 'center'
  },
  {
    title: '父级栏目',
    dataIndex: 'parentName',
    width: 180,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '栏目名称',
    dataIndex: 'name',
    width: 180,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '状态',
    slots: { customRender: 'online' },
    dataIndex: 'online',
    ellipsis: true,
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    align: 'center',
    slots: { customRender: 'actions' }
  }
]

const parentName = {
  14: '商业街',
  17: '新闻动态',
  21: '图集'
}

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
      editModal: {
        title: '',
        show: false,
        data: null
      }
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
        isPagination: true,
        orderBySortIndex: true,
        orderByTop: true,
        orderByPublishTime: false
      }).then(res => {
        const { data, code } = res
        if (code === 0) {
          const newList = []
          data.forEach(item => {
            if (+item.isSystem === 0) {
              item.parentName = parentName[item.parentId]
              newList.push(item)
            }
          })
          this.listData = newList
        }
      })
    },
    handleAdd() {
      this.editModal.data = this.infoInit(null)
      this.editModal.title = '新增'
      this.editModal.show = true
    },
    infoInit(data) {
      const { id, online, sortIndex, parentId, name } = data || {}
      const form = {
        parentId: parentId ? { value: parentId } : undefined,
        name: name || '',
        online: online ?? 1,
        sortIndex: sortIndex || 1
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
      this.getData()
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
