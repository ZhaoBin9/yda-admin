export const fingerPrintColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    slots: { customRender: 'id' }
  },
  {
    title: '印章名称',
    dataIndex: 'sealName',
    key: 'sealName',
    align: 'center'
  },
  {
    title: '设备编号',
    dataIndex: 'number',
    key: 'number',
    align: 'center'
  },
  {
    title: '盖印人',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center'
  },
  {
    title: '实际盖印次数',
    dataIndex: 'count',
    key: 'count',
    align: 'center',
    slots: { customRender: 'count' }
  },
  {
    title: '用印状态',
    dataIndex: 'sealStatus',
    key: 'sealStatus',
    align: 'center',
    slots: { customRender: 'sealStatus' }
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

export const baseColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    slots: { customRender: 'id' }
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
    align: 'center'
  },
  {
    title: '申请人',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center'
  },
  {
    title: '申请印章',
    dataIndex: 'documentSealRelVO',
    key: 'documentSealRelVO',
    align: 'center'
  },
  {
    title: '申请次数',
    dataIndex: 'sealSum',
    key: 'sealSum',
    align: 'center'
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    align: 'center'
  },
  {
    title: '用印状态',
    dataIndex: 'sealStatus',
    key: 'sealStatus',
    align: 'center',
    slots: { customRender: 'sealStatus' }
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
