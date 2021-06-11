<template>
  <div
    class="virtual-list show-scrollbar"
    @scroll="handleListScroll"
    ref="virtualListRef"
    :style="noHeight ? { 'max-height': remain * size + 'px', height: 'auto' } : { height: remain * size + 'px' }"
  >
    <section class="scroll-list" ref="scrollListRef">
      <div class="scroll-container" ref="scrollContainerRef">
        <a-tree
          v-if="isShow === 1"
          class="draggable-tree"
          :tree-data="renderList"
          :default-expanded-keys="[]"
          @expand="onExpand"
          @check="onCheck"
        >
          <template #switcherIcon>
            <img src="@/assets/svg/depart-tree-arrow.svg" />
          </template>
        </a-tree>
        <a-tree
          v-if="isShow === 2"
          class="draggable-tree2"
          checkable
          :checkedKeys="department"
          :tree-data="renderList"
          :expanded-keys="expandedKeys"
          :default-expanded-keys="[]"
          :auto-expand-parent="autoExpandParent"
          @expand="onExpand"
          @check="onCheck"
        >
          <template #switcherIcon>
            <img src="@/assets/svg/depart-tree-arrow.svg" />
          </template>
        </a-tree>
      </div>
    </section>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watch, computed } from 'vue'
import { throttle, flatLevelArrayProperty } from '@/utils/utils'
export default {
  name: 'tree-virtual-list',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 51
    },
    remain: {
      type: Number,
      default: 10
    },
    isShow: {
      type: Number,
      default: 1
    },
    department: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const virtualListRef = ref(null)
    const scrollListRef = ref(null)
    const scrollContainerRef = ref(null)
    const prevCount = computed(() => Math.min(state.start, props.remain))
    const nextCount = computed(() => Math.min(props.list.length - state.start, props.remain))
    const state = reactive({
      selectList: [],
      renderList: [],
      start: 0,
      end: props.remain * 2,
      prevTransVal: 0,
      departMap: new Map(),
      departRenderMap: new Map(), // 渲染的列表状态
      expandedKeys: [],
      autoExpandParent: false,
      departmentAll: props.department, // 存储所有部门，防止部门没有渲染时的报错
      department: []
    })

    const getStartIndex = value => {
      return parseInt(value / props.size)
    }

    const setRenderList = () => {
      if (props.isShow === 1) {
        state.renderList = props.list.slice(state.start - prevCount.value, state.start + 8 + nextCount.value)
      } else if (props.isShow === 2) {
        const list = props.list.slice(state.start - prevCount.value, state.start + 8 + nextCount.value)
        state.renderList = [
          {
            children: list,
            title: '全部部门',
            key: 'sss'
          }
        ]
        state.departRenderMap.clear()
        deepIteration(state.renderList)
      }
      // setTimeout(() => {
      state.department = []
      state.departRenderMap.forEach((item, key) => {
        item && state.department.push(key)
      })
      // console.log(state.department)
      // }, 10)
      function deepIteration(array) {
        array.forEach(item => {
          console.log(item.key, state.departMap.get(item.key))
          if (item.children && item.children.length) {
            deepIteration(item.children)
          }
          if (state.departMap.get(item.key)) {
            state.departRenderMap.set(item.key, true)
          }
        })
      }
    }

    const handleListScroll = throttle(() => {
      const top = virtualListRef.value.scrollTop + 5
      state.start = getStartIndex(top)
      setRenderList()
      const transVal = ~~(top - prevCount.value * props.size)
      state.prevTransVal = props.isShow === 2 ? transVal + props.size : transVal
      scrollContainerRef.value.style.transform = `translateY(${transVal}px)`
    }, 10)

    const onExpand = (e, { expanded, node }) => {
      if (expanded) {
        scrollListRef.value.style.height =
          ~~scrollListRef.value.style.height.replace('px', '') + node.children.length * props.size + 'px'
      } else {
        scrollListRef.value.style.height =
          ~~scrollListRef.value.style.height.replace('px', '') - node.children.length * props.size + 'px'
      }
      state.expandedKeys = e
      state.autoExpandParent = false
    }

    const onCheck = (checkedKeys, { checked, node }) => {
      const result = flatLevelArrayProperty(node.dataRef, 'key')
      console.log(checked, result)
      if (checked) {
        result.forEach(item => {
          state.departMap.set(item, true)
          state.departRenderMap.set(item, true)
        })
      } else {
        result.forEach(item => {
          state.departMap.set(item, false)
          state.departRenderMap.set(item, false)
        })
      }
      state.department = []
      state.departmentAll = []
      state.departMap.forEach((item, key) => {
        item && state.departmentAll.push(key)
      })
      state.departRenderMap.forEach((item, key) => {
        item && state.department.push(key)
      })
      console.log(state.department)
      state.department = [].concat(state.department)
      emit('onCheck', state.departmentAll)
      // emit('update:departmentVal', { ...props.state.departmentVal, department: state.department })
      // emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
    }

    watch(
      () => props.list.length,
      newListLen => {
        setTimeout(() => {
          if (scrollListRef.value) {
            scrollListRef.value.style.height = (props.isShow === 2 ? 1 + newListLen : newListLen) * props.size + 'px'
            virtualListRef.value.scrollTop = 0
            scrollContainerRef.value.style.transform = `translateY(0px)`
            state.start = 0
            state.end = props.remain * 2
            // state.renderList = props.list.slice(0, props.remain * 2)
            setRenderList()
          }
        }, 10)

        const isAllDepart = state.departmentAll.includes('sss')
        state.departMap.clear()
        function deepIteration(array, val) {
          array.forEach(item => {
            if (item.children && item.children.length) {
              deepIteration(item.children)
            }
            state.departMap.set(item.key, isAllDepart)
          })
        }
        deepIteration(
          props.isShow === 2
            ? [
                {
                  children: props.list,
                  title: '全部部门',
                  key: 'sss'
                }
              ]
            : props.list,
          true
        )
        console.log(props.department)
        !isAllDepart &&
          props.department.forEach(item => {
            state.departMap.set(item, true)
          })
        setTimeout(() => {
          state.expandedKeys = ['sss']
        })
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      virtualListRef,
      scrollListRef,
      scrollContainerRef,
      handleListScroll,
      onExpand,
      onCheck
    }
  }
}
</script>

<style lang="less" scoped>
.virtual-list {
  overflow-y: scroll;
  padding-left: 10px;
  transform: translateX(-10px);
  padding-bottom: 20px;
}
.draggable-tree {
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
}
.scroll-list {
  transition: 0.3s;
}
</style>
