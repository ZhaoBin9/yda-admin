<template>
  <div class="page moving-activitys">
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
      <template #top="{ record: { top } }">
        {{ +top === 1 ? '是' : '否' }}
      </template>
      <template #time="{ record: { startTime, endTime } }"> {{ startTime }} - {{ endTime }} </template>
      <template #online="{record: { online }}">
        {{ +online === 1 ? '上架' : '下架' }}
      </template>
      <template #tag="{ record: { tag } }">
        <a-tag v-for="(item, index) in tag.split(',')" :key="index">{{ item }}</a-tag>
      </template>
      <template #actions="{ record: { id } }">
        <a-space size="small">
          <a-button size="small" class="sort btn" @click="handleInfo(id)">详细</a-button>
          <a-button type="primary" size="small" class="sort btn" @click="handleEdit(id)">编辑</a-button>
          <a-button type="danger" size="small" class="delete btn" @click="handleDelete(id)">删除</a-button>
        </a-space>
      </template>
    </a-table>
    <!-- 详细组件 -->
    <info :visible="infoModal.show" :handle-visible="handleInfoVisible" :info="infoModal.data"></info>
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
import info from './info'
import edit from './edit'
import { getActivityList, deleteActivityData, getActivityInfo } from '@/apis/moving'
import { Notification, Modal } from 'ant-design-vue'
import moment from 'moment'

const columns = [
  {
    title: '排序',
    dataIndex: 'sortIndex',
    ellipsis: true,
    width: 100,
    align: 'center'
  },
  {
    title: '活动名称',
    dataIndex: 'name',
    width: 180,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '简介',
    dataIndex: 'summary',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '活动时间',
    slots: { customRender: 'time' },
    align: 'center'
  },
  {
    title: '标签',
    slots: { customRender: 'tag' },
    dataIndex: 'tag',
    align: 'center'
  },
  {
    title: '置顶',
    slots: { customRender: 'top' },
    dataIndex: 'top',
    width: 100,
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

export default {
  name: '',
  data() {
    return {
      classId: 16,
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
      },
      current: 1,
      pageSize: 10,
      total: 0
    }
  },
  components: {
    operation,
    info,
    edit
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getActivityList({
        classId: this.classId,
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
    handleAdd() {
      this.editModal.data = this.infoInit(null)
      this.editModal.title = '新增'
      this.editModal.show = true
    },
    infoInit(data) {
      const { id, imageId, fullImage, content, name, top, online, tag, sortIndex, startTime, endTime, summary } =
        data || {}
      const form = {
        content: content || '',
        name: name || '',
        imageId: imageId ? `${imageId}` : '',
        fullImage: fullImage || null,
        fileList: imageId
          ? [
              {
                uid: imageId,
                name: 'image',
                status: 'done',
                url: fullImage
              }
            ]
          : [],
        top: Boolean(top) || false,
        online: online ?? 1,
        tag: tag || '',
        summary: summary || '',
        startTime: startTime ? moment(startTime, 'YYYY-MM-DD') : null,
        endTime: endTime ? moment(endTime, 'YYYY-MM-DD') : null,
        sortIndex: sortIndex || 1
      }
      if (startTime && endTime) {
        form.dateTime = [form.startTime, form.endTime]
      }
      if (data) form.id = id
      return form
    },
    async handleInfo(id) {
      const res = await getActivityInfo({ id })
      if (res.code === 0) {
        this.infoModal.data = this.infoInit(res.data)
        this.infoModal.show = true
      }
    },
    async handleEdit(id) {
      const res = await getActivityInfo({ id })
      if (res.code === 0) {
        this.editModal.data = this.infoInit(res.data)
        this.editModal.title = '编辑'
        this.editModal.show = true
      }
    },
    handleDelete(id) {
      Modal.confirm({
        title: '提示',
        content: '确定删除此条数据吗？',
        onOk: () => this.deleteData(id)
      })
    },
    deleteData(id) {
      deleteActivityData({ id }).then(res => {
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
    handleInfoVisible() {
      this.infoModal.show = false
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
.moving-activitys {
  .ant-table-wrapper {
    margin-top: 30px;
  }
}
</style>
