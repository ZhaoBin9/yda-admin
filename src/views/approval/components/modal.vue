<template>
  <div ref="parent">
    <a-modal
      centered
      :width="786"
      :title="isApproval ? '审批' : '查看'"
      :visible="visible"
      @cancel="$emit('update:visible', false)"
      :footer="null"
      :getContainer="() => $refs.parent"
    >
      <!-- 用印审批 -->
      <section style="padding: 0 80px" v-if="current.examineType === 1">
        <label-text title="文件名称" :text="current?.fileName || '--'"> </label-text>
        <a-row v-for="(item, index) in current?.sealShow" :key="item.documentId">
          <a-col :span="12"><label-text :title="`申请印章${index + 1}`" :text="item.sealName"> </label-text></a-col>
          <a-col :span="12"
            ><label-text :title="`申请次数${index + 1}`" :text="item.applicationNumber"> </label-text
          ></a-col>
        </a-row>
        <label-text title="申请人" :text="current?.sealFlowShow[0]?.name || '--'"> </label-text>
        <label-text title="申请时间" :text="current?.sealFlowShow[0]?.examineTime || '--'"> </label-text>
        <label-text v-if="isApproval" title="申请是由" :text="current?.applyText || '无'"> </label-text>
        <label-text title="附件" :text="current.fileIds ? null : '无'">
          <template #text>
            <section class="img-collection">
              <div class="img-wrap" v-for="it in current.fileIds" :key="it">
                <img :src="it" alt="" />
              </div>
            </section>
          </template>
        </label-text>
        <div style="height: 15px"></div>
        <label-text title="审批人">
          <template #text>
            <a-timeline>
              <a-timeline-item color="red" v-for="(item, index) in current?.sealFlowShow" :key="item.userId">
                <template #dot>
                  <div class="time-progess">{{ index + 1 }}</div>
                </template>
                <section class="time-sec">
                  <p class="time-name">{{ item.name }}</p>
                  <p :class="index === 0 ? 'time-action' : 'time-action actions'">
                    {{ index === 0 ? '发起申请' : item.state === 2 ? '审批中' : '已审批' }}
                  </p>
                  <p class="time-create">{{ item.examineTime }}</p>
                </section>
              </a-timeline-item>
            </a-timeline>
          </template>
        </label-text>
      </section>

      <!-- 归档审批 -->
      <section style="padding: 0 80px" v-else>
        <label-text title="印章名称" :text="current?.fileName || '--'"> </label-text>
        <a-row v-for="(item, index) in current?.sealShow" :key="item.documentId">
          <a-col :span="12"><label-text :title="`盖印人${index + 1}`" :text="item.sealName"> </label-text></a-col>
          <a-col :span="12"
            ><label-text :title="`实际盖印次数${index + 1}`" :text="item.practicalNumber || 1"> </label-text
          ></a-col>
        </a-row>
        <!-- <label-text title="设备编号" :text="current?.seal || '--'"> </label-text> -->
        <label-text title="用印状态" :text="current.sealStatus ? null : '--'">
          <template #text>
            <p class="label-name">
              <span class="dotted" :style="{ background: sealStatusObj[current.sealStatus ?? 0].color }"></span
              >{{ sealStatusObj[current.sealStatus ?? 0].name }}
            </p>
          </template>
        </label-text>
        <label-text title="审批流程" :text="current?.archivedFlowName || '无'"> </label-text>
        <div style="height: 15px"></div>
        <label-text title="审批人">
          <template #text>
            <a-timeline>
              <a-timeline-item color="red" v-for="(item, index) in current?.archivedFlowShow" :key="item.userId">
                <template #dot>
                  <div class="time-progess">{{ index + 1 }}</div>
                </template>
                <section class="time-sec">
                  <p class="time-name">{{ item.name }}</p>
                  <p
                    :class="index === 0 ? 'time-action' : 'time-action actions'"
                    :style="{ color: approvalStatusObj[item.state]?.color || 'red' }"
                  >
                    {{ index === 0 ? '发起申请' : approvalStatusObj[item.state]?.text }}
                  </p>
                  <p class="time-create">{{ item.examineTime }}</p>
                </section>
              </a-timeline-item>
            </a-timeline>
          </template>
        </label-text>
        <label-text
          v-if="current.documentFileRelVO"
          title="用印影像"
          :text="current.documentFileRelVO.length ? null : '无'"
        >
          <template #text>
            <section class="img-collection">
              <div class="img-wrap" v-for="it in current.documentFileRelVO" :key="it">
                <img :src="it.fileId" alt="" />
              </div>
            </section>
          </template>
        </label-text>
        <label-text title="归档附件" :text="current.archivedFileIds ? null : '无'">
          <template #text>
            <section class="img-collection">
              <div class="img-wrap" v-for="it in current.archivedFileIds" :key="it">
                <img :src="it" alt="" />
              </div>
            </section>
          </template>
        </label-text>
        <label-text title="归档备注" :text="current?.archivedText || '无'"> </label-text>
      </section>
      <div style="padding-left: 80px">
        <label-text v-if="isApproval" title="审批意见">
          <template #text>
            <a-textarea
              style="width: 410px"
              v-model:value="state.mark"
              :maxlength="30"
              :autoSize="{ minRows: 5 }"
            ></a-textarea>
          </template>
        </label-text>
        <div class="action-box">
          <a-button
            v-if="isApproval && current.examineType === 1"
            class="btn close"
            @click="$emit('update:visible', false)"
            >关闭</a-button
          >
          <a-button v-if="isApproval" class="btn cancel" :loading="loading" @click="comfirmApproval(4)">{{
            current.examineType === 1 ? '拒绝' : '不通过'
          }}</a-button>
          <a-button class="btn comfirm" @click="comfirmApproval(3)" :loading="loading">{{
            isApproval ? (current.examineType === 1 ? '确定' : '通过') : '关闭'
          }}</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, computed, reactive } from 'vue'
import '@/style/jsx-label-text.scss'
const LabelText = defineComponent({
  name: 'label-text',
  props: ['text', 'title', 'classes'],
  render() {
    return (
      <div class="jsx-label-content">
        <section class={['label-text', this.classes].join(' ')}>
          <p class="label-title">{this.title}：</p>
          {this.text ? <p class="label-name">{this.text}</p> : this.$slots.text()}
        </section>
        {this.$slots.default && this.$slots.default()}
      </div>
    )
  }
})
const sealStatusObj = {
  0: {
    name: '不可用',
    color: '#C3161C'
  },
  1: {
    name: '待用印',
    color: '#FF8309'
  },
  2: {
    name: '用印中',
    color: '#5F99FF'
  },
  3: {
    name: '待归档',
    color: '#FF8309'
  },
  5: {
    name: '已归档',
    color: '#D0D0D0'
  },
  4: {
    name: '归档中',
    color: '#5F99FF'
  }
}
const approvalStatusObj = {
  1: {
    text: '暂无状态',
    color: 'gary'
  },
  2: {
    text: '审批中',
    color: '#ccc'
  },
  3: {
    text: '同意',
    color: '#43CF75'
  },
  4: {
    text: '拒绝',
    color: 'red'
  }
}
export default defineComponent({
  components: {
    LabelText
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isApproval: {
      type: Boolean,
      default: false
    },
    current: {
      type: Object,
      default: () => ({ documentFileRelVO: [], sealFlowShow: [], examineType: 1 })
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const state = reactive({
      mark: undefined
    })
    const isApproval = computed(() => props.isApproval)
    const comfirmApproval = status => {
      if (!isApproval.value) {
        emit('update:visible', false)
        return
      } else {
        emit('update:loading', true)
        emit('modalSubmit', status, state.mark)
      }
    }

    return {
      state,
      comfirmApproval,
      sealStatusObj,
      approvalStatusObj
    }
  }
})
</script>

<style lang="scss" scoped>
.dotted {
  width: 6px;
  height: 6px;
  background: greenyellow;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
}
.time-progess {
  width: 20px;
  height: 20px;
  background: #c3161c;
  border-radius: 50%;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
}
.time-sec {
  padding-left: 24px;
  margin-top: 5px;
  margin-bottom: 25px;
  transform: translateY(-8px);
  display: flex;
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .time-name {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 32px;
    margin-right: 10px;
    transform: translateY(5px);
  }
  .time-action {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
    margin-right: 33px;
    transform: translateY(5px);
  }
  .actions {
    color: #5f99ff;
  }
  .time-create {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
    transform: translateY(5px);
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}

.action-box {
  margin: 40px 0 30px;
  display: flex;
  justify-content: center;
  // text-indent: 80px;
  transform: translateX(-40px);
  .btn {
    width: 100px;
    height: 38px;
    opacity: 1;
    background: #ffffff;
    border-radius: 5px;
    margin-right: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 38px;
  }
  .close {
    color: #999;
    border: 1px solid #dadada;
    &:hover {
      color: #999;
      border-color: #dadada;
    }
  }
  .cancel {
    color: #c3161c;
    border: 1px solid #c3161c;
  }
  .comfirm {
    background: #c3161c;
    color: #fff;
    border: 1px solid transparent;
    margin-right: 0;
    &:hover {
      border-color: transparent;
    }
  }
}
::v-deep .ant-modal-title {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 25px;
  text-indent: 24px;
}
::v-deep .reason {
  color: #ff972e;
}
</style>
