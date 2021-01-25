<template>
  <div class="page holiday-hotel">
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
      <template #online="{record: { online }}">
        {{ +online === 1 ? '上架' : '下架' }}
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
import { getHotelList, deleteHotelData } from '@/apis/holiday'
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
    title: '酒店名称',
    dataIndex: 'name',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '房价',
    dataIndex: 'price',
    ellipsis: true,
    width: 150,
    align: 'center'
  },
  {
    title: '简介',
    dataIndex: 'summary',
    ellipsis: true,
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
      classId: 11,
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
      getHotelList({
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
      this.current = pager.current
      this.getData()
    },
    handleAdd() {
      this.editModal.data = this.infoInit(null)
      this.editModal.title = '新增'
      this.editModal.show = true
    },
    infoInit(data) {
      const {
        id,
        imageList,
        imageId,
        fullImage,
        fullImageList,
        name,
        top,
        online,
        summary,
        sortIndex,
        time,
        price,
        address,
        info,
        features,
        slogan,
        phone
      } = data || {}
      let startWeek = '周一',
        endWeek = '周日',
        startTime = moment('9:00', 'HH:mm'),
        endTime = moment('23:00', 'HH:mm')
      if (time) {
        const ary = time.split(' ')
        startWeek = ary[0].split('到')[0]
        endWeek = ary[0].split('到')[1]
        startTime = moment(ary[1].replace(/早||晚/g, '').split('-')[0], 'HH:mm')
        endTime = moment(ary[1].replace(/早||晚/g, '').split('-')[1], 'HH:mm')
      }
      const form = {
        name: name || '',
        imageId: imageId || '',
        imageList: imageList || '',
        coverImage: fullImage || null,
        PPTList: [],
        coverList: [],
        top: Boolean(top) || false,
        online: online ?? 1,
        summary: summary || '',
        sortIndex: sortIndex || 1,
        time: time || '周一至周日 早9:00-晚23:00',
        price: price ? +price : 1,
        address: address || '',
        info: info || '',
        features: features || '',
        slogan: slogan || '',
        phone: phone || '',
        startWeek,
        endWeek,
        startTime,
        endTime
      }
      if (imageId) {
        form.coverList.push({
          uid: imageId,
          name: 'image',
          status: 'done',
          url: fullImage
        })
      }
      if (imageList && fullImageList.length > 0) {
        const ary = imageList.split(',')
        for (const key in fullImageList) {
          if (Object.hasOwnProperty.call(fullImageList, key)) {
            form.PPTList.push({
              uid: ary[key],
              name: 'image',
              status: 'done',
              url: fullImageList[key]
            })
          }
        }
      }
      if (data) form.id = id
      return form
    },
    handleInfo(id) {
      const data = this.listData.find(item => item.id === id)
      this.infoModal.data = this.infoInit(data)
      this.infoModal.show = true
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
        onOk: () => this.deleteHotelData(id)
      })
    },
    deleteHotelData(id) {
      deleteHotelData({ id }).then(res => {
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
.tradition-celebrity {
  .ant-table-wrapper {
    margin-top: 30px;
  }
}
</style>
