export const notApprovalColumns = [
  {
    title: '序号',
    dataIndex: 'documentId',
    key: 'documentId',
    align: 'center'
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
    align: 'center'
  },
  {
    title: '印章名称',
    dataIndex: 'sealNames',
    key: 'sealNames',
    align: 'center'
  },
  {
    title: '申请人',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '审批类型',
    dataIndex: 'examineType',
    key: 'examineType',
    align: 'center',
    slots: { customRender: 'sealNames' }
  },
  {
    title: '提交申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: { customRender: 'action' }
  }
]

export const apprpvedColumns = [
  {
    title: '序号',
    dataIndex: 'documentId',
    key: 'documentId',
    align: 'center'
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
    align: 'center'
  },
  {
    title: '印章名称',
    dataIndex: 'sealNames',
    key: 'sealNames',
    align: 'center',
    slots: { customRender: 'examineType' }
  },
  {
    title: '申请人',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '审批类型',
    dataIndex: 'examineType',
    key: 'examineType',
    align: 'center',
    slots: { customRender: 'examineType' }
  },
  {
    title: '审批状态',
    dataIndex: 'examineStatus',
    key: 'examineStatus',
    align: 'center',
    slots: { customRender: 'examineStatus' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: { customRender: 'action' }
  }
]
