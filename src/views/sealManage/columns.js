export const managementColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    align: 'center'
  },
  {
    title: '印章名称',
    dataIndex: 'sealName',
    key: 'sealName',
    align: 'center'
  },
  {
    title: '保管人',
    dataIndex: 'custodianName',
    key: 'custodianName',
    align: 'center'
  },
  {
    title: '所在设备编号',
    dataIndex: 'custodianId',
    key: 'custodianId',
    align: 'center'
  },
  {
    title: '印章状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    slots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: { customRender: 'action' }
  }
]
