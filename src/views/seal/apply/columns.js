export const applyColumns = [
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
    title: '申请状态',
    dataIndex: 'examineStatus',
    key: 'examineStatus',
    align: 'center',
    slots: { customRender: 'examineStatus' }
  },
  {
    title: '用印状态',
    dataIndex: 'sealStatus',
    key: 'sealStatus',
    align: 'center',
    slots: { customRender: 'sealStatus' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: { customRender: 'action' }
  }
]
