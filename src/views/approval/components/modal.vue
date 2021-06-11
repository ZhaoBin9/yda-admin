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
      <a-spin :spinning="currentLoading">
        <!-- 用印审批 -->
        <section style="padding: 0 0 0 80px" v-if="current.examineType === 1">
          <label-text title="文件名称" :text="current?.fileName || '--'"> </label-text>
          <a-row v-for="(item, index) in current?.sealShow" :key="item.documentId">
            <a-col :span="12"
              ><label-text :title="`申请印章${index === 0 ? '' : index + 1}`" :text="item.sealName"> </label-text
            ></a-col>
            <a-col :span="12"
              ><label-text
                title="申请次数"
                :text="
                  `${item.applicationNumber}${'（剩余' + (item.applicationNumber - item.practicalNumber) + '次）'}`
                "
              >
              </label-text
            ></a-col>
          </a-row>
          <label-text title="申请人" :text="current?.sealFlowShow[0]?.name || '--'"> </label-text>
          <label-text title="申请时间" :text="current?.sealFlowShow[0]?.examineTime || '--'"> </label-text>
          <label-text v-if="isApproval" title="申请事由" :text="current?.applyText || '无'"> </label-text>
          <label-text title="附件" :text="current.fullDocumentFile ? null : '无'">
            <template #text>
              <section class="img-collection">
                <div class="img-wrap" v-for="it in current.fullDocumentFile" :key="it">
                  <img
                    :src="it + '?uploadFile=88x88'"
                    alt=""
                    @error="reImg($event, it)"
                    @click="previewImg($event, it)"
                  />
                </div>
              </section>
            </template>
          </label-text>
          <label-text title="用印状态" :text="typeof current.sealStatus === 'number' ? null : '--'">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: sealStatusObj[current.sealStatus ?? 0].color }"></span
                >{{ sealStatusObj[current.sealStatus ?? 0].name }}
              </p>
            </template>
          </label-text>

          <label-text v-if="current.type" title="用印类型">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: typesObj[current.type ?? 3].color }"></span
                >{{ typesObj[current.type ?? 3].name }}
              </p>
            </template>
          </label-text>

          <label-text title="审批状态" :text="typeof current.examineStatus === 'number' ? null : '--'">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: examineStatusObj[current.examineStatus ?? 0].color }"></span
                >{{ examineStatusObj[current.examineStatus ?? 0].name }}
              </p>
            </template>
          </label-text>
          <label-text title="审批流程" :text="current?.sealFlowName || '--'"> </label-text>
          <div style="height: 15px"></div>
          <label-text title="审批人">
            <template #text>
              <a-timeline>
                <virtual-list
                  :list="
                    current.sealFlowShow
                      ? current.sealFlowShow.map((item, index) => {
                          item.index = index
                          return item
                        })
                      : []
                  "
                  noHeight
                  :size="103"
                  :remain="8"
                  :isScrollTop="isVirtualListScroll"
                >
                  <template #default="{item}">
                    <approval-show-list-item :item="item" :deleteApprovalFn="deleteApprovalFn" />
                  </template>
                </virtual-list>
              </a-timeline>
            </template>
          </label-text>
        </section>

        <!-- 归档审批 -->
        <section style="padding: 0 0 0 80px" v-else>
          <label-text title="印章名称" :text="current?.fileName || '--'"> </label-text>
          <div v-if="current.status === 2">
            <a-row v-for="(item, index) in current?.sealShow" :key="item.documentId">
              <a-col :span="12"
                ><label-text :title="`申请印章${index === 0 ? '' : index + 1}`" :text="item.sealName"> </label-text
              ></a-col>
              <a-col :span="12"
                ><label-text
                  title="申请次数"
                  :text="
                    `${item.applicationNumber}${'（剩余' + (item.applicationNumber - item.practicalNumber) + '次）'}`
                  "
                >
                </label-text
              ></a-col>
            </a-row>
            <label-text
              title="申请人"
              :text="current?.archivedFlowShow[0]?.name || current?.sealFlowShow[0]?.name || '--'"
            >
            </label-text>
          </div>
          <a-row v-else>
            <a-col :span="12"><label-text :title="`盖印人`" :text="current.userName"> </label-text></a-col>
            <a-col :span="12"><label-text :title="`实际盖印次数`" :text="'1次'"> </label-text></a-col>
          </a-row>

          <label-text title="用印状态" :text="typeof current.sealStatus === 'number' ? null : '--'">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: sealStatusObj[current.sealStatus ?? 0].color }"></span
                >{{ sealStatusObj[current.sealStatus ?? 0].name }}
              </p>
            </template>
          </label-text>

          <label-text v-if="current.type" title="用印类型">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: typesObj[current.type ?? 3].color }"></span
                >{{ typesObj[current.type ?? 3].name }}
              </p>
            </template>
          </label-text>

          <label-text title="审批状态" :text="typeof current.examineStatus === 'number' ? null : '--'">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: examineStatusObj[current.examineStatus ?? 0].color }"></span
                >{{ examineStatusObj[current.examineStatus ?? 0].name }}
              </p>
            </template>
          </label-text>
          <label-text title="审批流程" :text="current?.archivedFlowName || '无'"> </label-text>
          <div style="height: 15px"></div>
          <label-text title="审批人">
            <template #text>
              <a-timeline>
                <a-timeline-item v-for="(item, index) in current.archivedFlowShow" :key="item.flowId" color="red">
                  <template #dot>
                    <div class="time-progess">{{ index + 1 }}</div>
                  </template>
                  <section :class="{ 'time-sec': true, 'time-trans': index }">
                    <img
                      class="approval-img"
                      :src="item.avatarId ? item.fullAvatar : require('@/assets/images/default-avatar.png')"
                    />
                    <p class="time-name">{{ item.name }}</p>
                    <p class="time-action" :style="{ color: archiveStatusObj[item.state]?.color || 'red' }">
                      {{
                        index === 0
                          ? current.archivedFlowShow.length === 1 && current.examineStatus === 4
                            ? '完成归档'
                            : '提交归档'
                          : archiveStatusObj[item.state]?.name || '--'
                      }}
                    </p>
                    <p class="time-create">{{ item.examineTime || '--' }}</p>
                  </section>
                  <label-text
                    v-if="item.state === 3 || item.state === 4"
                    title="审批意见"
                    :noBottom="true"
                    :text="item.opinion || '--'"
                  >
                  </label-text>
                </a-timeline-item>
              </a-timeline>
            </template>
          </label-text>
          <label-text title="用印记录" :text="current.documentFileRelVO ? null : '暂无记录'">
            <template #text>
              <section style="display: flex; justify-content: space-between; width: 565px; flex-wrap: wrap;">
                <section v-for="item in current.documentFileRelVO" :key="item.sealTime">
                  <p class="label-name" style="margin-bottom: 4px">（盖章人：{{ current.userName }}）</p>
                  <p class="label-name" style="margin-bottom: 4px">
                    （实际盖章次数：1次） （盖章地点：{{ item.site || '--' }} ）
                  </p>
                  <p class="label-name" style="margin-bottom: 4px">用印影像：</p>
                  <section class="img-collection">
                    <div class="img-wrap">
                      <img
                        :src="item.fullFile + '?uploadFile=88x88'"
                        @click="previewImg($event, item.fullFile)"
                        alt=""
                      />
                    </div>
                  </section>
                </section>
              </section>
            </template>
          </label-text>
          <label-text title="归档附件" :text="current.fullArchivedFile ? null : '无'">
            <template #text>
              <section class="img-collection">
                <div class="img-wrap" v-for="it in current.fullArchivedFile" :key="it">
                  <img
                    :src="it + '?uploadFile=88x88'"
                    alt=""
                    @error="reImg($event, it)"
                    @click="previewImg($event, it)"
                  />
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
              >取消</a-button
            >
            <a-button v-if="isApproval" class="btn cancel" :loading="loading" @click="comfirmApproval(4)">{{
              current.examineType === 1 ? '拒绝' : '不通过'
            }}</a-button>
            <a-button class="btn comfirm" @click="comfirmApproval(3)" :loading="loading">{{
              isApproval ? (current.examineType === 1 ? '同意' : '通过') : '取消'
            }}</a-button>
          </div>
        </div>
      </a-spin>
    </a-modal>
    <a-modal
      centered
      title="查看图片"
      :width="800"
      :visible="previewVisible"
      @cancel="previewVisible = false"
      :footer="null"
      ><img :src="previewUrl" style="width: 760px"
    /></a-modal>
  </div>
</template>

<script>
import { defineComponent, computed, reactive, ref, watch } from 'vue'
import '@/style/jsx-label-text.scss'
import { cmsNotice } from '@/utils/utils'
import VirtualList from '@/components/VirtualList'
import ApprovalShowListItem from '@/components/VirtualList/approvalShowListItem'
import LabelText from '@/components/LabelText'
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
const examineStatusObj = {
  0: {
    name: '审批中',
    color: '#5F99FF'
  },
  1: {
    name: '同意',
    color: '#43CF75'
  },
  2: {
    name: '拒绝',
    color: '#C3161C'
  },
  3: {
    name: '归档审批中',
    color: '#FF8309'
  },
  4: {
    name: '归档审批通过',
    color: '#D0D0D0'
  },
  5: {
    name: '归档审批未通过',
    color: '#ccc'
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
    text: '已同意',
    color: '#43CF75'
  },
  4: {
    text: '已拒绝',
    color: 'red'
  }
}
const archiveStatusObj = {
  1: {
    name: '暂无状态',
    color: '#ccc'
  },
  2: {
    name: '审批中',
    color: '#FF8309'
  },
  3: {
    name: '同意',
    color: '#43CF75'
  },
  4: {
    name: '拒绝',
    color: '#C3161C'
  }
}
const typesObj = {
  1: {
    name: '单次用印',
    color: '#C3161C'
  },
  2: {
    name: '连续用印',
    color: '#5F99FF'
  },
  3: {
    name: ' --',
    color: '#ccc'
  }
}
export default defineComponent({
  components: {
    LabelText,
    VirtualList,
    ApprovalShowListItem
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
    },
    currentLoading: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const state = reactive({
      mark: undefined
    })
    const previewVisible = ref(false)
    const previewUrl = ref()
    const isApproval = computed(() => props.isApproval)
    const isVirtualListScroll = ref(0)
    const comfirmApproval = status => {
      if (!isApproval.value) {
        emit('update:visible', false)
        return
      } else {
        emit('update:loading', true)
        emit('modalSubmit', status, state.mark)
      }
    }
    const previewImg = (e, src) => {
      previewUrl.value = src
      previewVisible.value = true
    }
    const reImg = (e, src) => {
      const parentNode = e.target.parentNode
      const tipsSpan = document.createElement('a')
      const tipsText = document.createTextNode('点击下载该附件查看')
      tipsSpan.appendChild(tipsText)
      tipsSpan.onclick = () => {
        window.location.href = src.replace('.com//', '.com/') + '?upload=true'

        setTimeout(() => {
          cmsNotice('success', '正在为你下载，请耐心等待')
        }, 200)
      }
      parentNode.removeChild(e.target)
      parentNode.appendChild(tipsSpan)
    }

    watch(
      () => props.visible,
      newVisible => {
        if (newVisible) {
          state.mark = undefined
        }
      }
    )

    watch(
      () => props.current,
      () => {
        isVirtualListScroll.value++
      }
    )

    return {
      state,
      comfirmApproval,
      sealStatusObj,
      examineStatusObj,
      approvalStatusObj,
      typesObj,
      previewUrl,
      previewVisible,
      previewImg,
      reImg,
      isVirtualListScroll,
      archiveStatusObj
    }
  }
})
</script>

<style lang="scss" scoped>
.approval-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  transform: translateY(5px);
  margin-right: 4px;
}

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
  transform: translateY(-8px);
  display: flex;
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .time-avatar {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 5px;
    object-fit: cover;
    transform: translateY(5px);
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
::v-deep .ant-modal-body {
  padding-right: 0px;
}
::v-deep .reason {
  color: #ff972e;
}
</style>
