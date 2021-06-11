<script>
import Tree from 'ant-design-vue/es/tree'
const { TreeNode } = Tree
export default {
  name: 'depart-show-item',
  props: ['item'],
  setup() {
    console.log('render')
    const slots = {
      switcherIcon: () => <img src="@/assets/svg/depart-tree-arrow.svg" />
    }
    const renderTree = item => {
      if (item.children) {
        return (
          <TreeNode key={item.value} title={item.label} v-slots={slots}>
            {item.children.map(it => renderTree(it))}
          </TreeNode>
        )
      }
      return <TreeNode key={item.value} title={item.label} />
    }

    return {
      renderTree
    }
  },
  render() {
    console.log(this)
    return this.renderTree(this.props.item)
  }
}
</script>

<style lang="less" scoped>
::v-deep .ant-tree-title {
  display: inline-block;
  width: 100px;
  height: 35px;
  background: #ffffff;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #333333;
  line-height: 35px;
}
::v-deep .ant-tree-switcher {
  width: 36px !important;
  height: 36px !important;
  transition: 0.3s;
  transform: rotateZ(-90deg);
}
::v-deep .ant-tree-switcher_open {
  transform: rotateZ(0deg);
}
::v-deep .ant-tree-node-content-wrapper {
  height: 38px !important;
  padding: 0 !important;
  border-radius: 6px !important;
  border: 1px solid transparent;
}
::v-deep .ant-tree-node-selected {
  background: transparent !important;
  border: 1px solid #c3161c;
}
</style>
