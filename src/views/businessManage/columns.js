export const staffColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '账号',
    dataIndex: 'mobile',
    key: 'mobile',
    align: 'center'
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
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

export const departmentColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    align: 'center'
  },
  {
    title: '部门名称',
    dataIndex: 'departmentName',
    key: 'departmentName',
    align: 'center'
  },
  {
    title: '上级部门',
    dataIndex: 'parentDeptName',
    key: 'parentDeptName',
    align: 'center',
    slots: { customRender: 'parentDeptName' }
  },
  {
    title: '部门级别',
    dataIndex: 'level',
    key: 'level',
    align: 'center',
    slots: { customRender: 'level' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: { customRender: 'action' }
  }
]

export const processColumns = [
  {
    title: '序号',
    dataIndex: 'flowId',
    key: 'flowId',
    align: 'center'
  },
  {
    title: '流程名称',
    dataIndex: 'flowName',
    key: 'flowName',
    align: 'center'
  },
  {
    title: '创建人',
    dataIndex: 'foundName',
    key: 'foundName',
    align: 'center'
  },
  {
    title: '使用范围',
    dataIndex: 'flowScope',
    key: 'flowScope',
    align: 'center'
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    key: 'businessType',
    align: 'center',
    slots: { customRender: 'businessType' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: { customRender: 'action' }
  }
]

export const roleColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    slots: { customRender: 'name' }
  },
  {
    title: '角色说明',
    dataIndex: 'explain',
    key: 'explain',
    slots: { customRender: 'explain' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { customRender: 'action' }
  }
]
