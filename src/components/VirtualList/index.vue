<template>
  <div
    class="virtual-list show-scrollbar"
    @scroll="handleListScroll"
    ref="virtualListRef"
    :style="noHeight ? { 'max-height': remain * size + 'px', height: 'auto' } : { height: remain * size + 'px' }"
  >
    <section class="scroll-list" ref="scrollListRef">
      <div class="scroll-container" ref="scrollContainerRef">
        <div v-for="(item, index) in renderList" :key="item.id || item.userId">
          <slot :item="item" :index="index"></slot>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watch, computed } from 'vue'
import { throttle } from '@/utils/utils'
export default {
  name: 'virtual-list',
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
    noHeight: {
      type: Boolean,
      default: false
    },
    isScrollTop: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const virtualListRef = ref(null)
    const scrollListRef = ref(null)
    const scrollContainerRef = ref(null)
    const prevCount = computed(() => Math.min(state.start, props.remain))
    const nextCount = computed(() => Math.min(props.list.length - state.start, props.remain))
    const state = reactive({
      selectList: [],
      renderList: props.list.slice(0, props.remain * 2),
      start: 0,
      end: props.remain * 2,
      prevTransVal: 0
    })

    const getStartIndex = value => {
      return parseInt(value / props.size)
    }

    const handleListScroll = throttle(() => {
      const top = virtualListRef.value.scrollTop + 5
      state.start = getStartIndex(top)
      state.renderList = props.list.slice(state.start - prevCount.value, state.start + 8 + nextCount.value)
      const transVal = ~~(top - prevCount.value * props.size)
      state.prevTransVal = transVal
      scrollContainerRef.value.style.transform = `translateY(${transVal}px)`
    }, 10)

    watch(
      () => props.list.length,
      newListLen => {
        setTimeout(() => {
          if (scrollListRef.value) {
            scrollListRef.value.style.height = newListLen * props.size + 'px'
          }
        }, 10)
      },
      { immediate: true }
    )
    watch(
      () => props.isScrollTop,
      isScrollTop => {
        if (typeof isScrollTop === 'number') {
          virtualListRef.value.scrollTop = 0
          scrollContainerRef.value.style.transform = `translateY(0px)`
          state.start = 0
          state.end = props.remain * 2
          state.renderList = props.list.slice(0, props.remain * 2)
        } else if (typeof isScrollTop === 'object') {
          virtualListRef.value.scrollTop = virtualListRef.value.scrollTop - props.size
          scrollContainerRef.value.style.transform = `translateY(${state.prevTransVal - props.size}px)`
          handleListScroll()
        } else {
          state.renderList = props.list.slice(state.start - prevCount.value, state.start + 8 + nextCount.value)
        }
      }
    )

    return {
      ...toRefs(state),
      virtualListRef,
      scrollListRef,
      scrollContainerRef,
      handleListScroll
    }
  }
}
</script>

<style lang="less" scoped>
.virtual-list {
  overflow-y: scroll;
  padding-left: 10px;
  transform: translateX(-10px);
  // padding-bottom: 5px;
}
</style>
