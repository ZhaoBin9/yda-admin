<template>
  <a-spin :spinning="loading">
    <a-card style="margin: 40px; max-height: 800px; overflow-y: scroll; padding: 40px 80px;" class="detail-page">
      <a-row v-if="$route.query.documentId || $route.query.id">
        <a-col :span="12">
          <label-text sign="1" title="文件名称" :text="current.fileName ?? '--'"> </label-text>
          <label-text sign="2" title="申请人" :text="current.userName ?? '--'"></label-text>
          <a-row sign="3" v-for="(item, index) in current.sealShow" :key="item.documentId">
            <a-col :span="12"
              ><label-text sign="4" :title="`印章名称${index === 0 ? '' : index + 1}`" :text="item.sealName">
              </label-text
            ></a-col>
            <a-col :span="12"
              ><label-text
                sign="5"
                :title="`申请次数${index === 0 ? '' : index + 1}`"
                :text="`${item.applicationNumber}（剩余${item.applicationNumber - item.practicalNumber}次）`"
              >
              </label-text
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <label-text sign="6" title="用印状态">
                <template #text>
                  <p class="label-name">
                    <span class="dotted" :style="{ background: sealStatusObj[current.sealStatus ?? 0].color }"></span
                    >{{ sealStatusObj[current.sealStatus ?? 0].name }}
                  </p>
                </template>
              </label-text>
            </a-col>
            <a-col :span="12">
              <label-text sign="7" title="审批状态">
                <template #text>
                  <p class="label-name">
                    <span
                      class="dotted"
                      :style="{ background: examineStatusObj[current.examineStatus ?? 0].color }"
                    ></span
                    >{{ examineStatusObj[current.examineStatus ?? 0].name }}
                  </p>
                </template>
              </label-text>
            </a-col>
          </a-row>

          <label-text v-if="current.type" title="用印类型">
            <template #text>
              <p class="label-name">
                <span class="dotted" :style="{ background: typesObj[current.type ?? 1].color }"></span
                >{{ typesObj[current.type ?? 1].name }}
              </p>
            </template>
          </label-text>

          <label-text sign="9" title="审批流程" :text="current.sealFlowName ?? '--'"> </label-text>
          <div style="height: 15px"></div>
          <label-text sign="10" title="审批人">
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

          <label-text sign="12" title="附件" :text="current.fullDocumentFile ? null : '无'">
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
          <label-text sign="11" title="申请事由" :text="current.applyText ? current.applyText : '无'"> </label-text>
        </a-col>

        <a-col :span="12">
          <label-text sign="13" title="用印记录" :text="current.documentFileRelVO ? null : '暂无记录'">
            <template #text>
              <section style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <section v-for="item in current.documentFileRelVO" :key="item.sealTime">
                  <p class="label-name" style="margin-bottom: 4px">（盖章人：{{ current.userName }}）</p>
                  <p class="label-name" style="margin-bottom: 4px">
                    （实际盖章次数：1次） （盖章地点：{{ item.site || '--' }} ）
                  </p>
                  <p class="label-name" style="margin-bottom: 4px">用印影像：</p>
                  <section class="img-collection">
                    <div class="img-wrap" :key="item.fullFile">
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
          <label-text sign="9" title="文件归档" :text="current.archivedFlowName ?? '--'"> </label-text>
          <label-text sign="14" title="归档人" :text="current.archivedFlowShow ? null : '无'">
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
          <label-text title="归档附件" :text="current.sealStatus !== 4 && current.fullArchivedFile ? null : '无'">
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
          <label-text
            title="归档备注"
            :text="current.sealStatus !== 4 && current.archivedText ? current.archivedText : '无'"
          ></label-text>
        </a-col>
      </a-row>

      <a-row v-else>
        <a-col :span="12">
          <label-text title="印章名称" :text="(current.fileName || current.sealName) ?? '--'"></label-text>
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
            <a-col :span="12">
              <label-text title="盖印人" :text="current.userName ?? '--'"></label-text>
            </a-col>
            <a-col :span="12" v-if="$route.query.fingerId">
              <label-text title="实际盖印次数" :text="'1次'"></label-text>
            </a-col>
          </a-row>

          <label-text title="设备编号" :text="current.number ?? '无'"></label-text>

          <label-text
            title="用印状态"
            :text="current.sealStatus ? sealStatusObj[current.sealStatus].name : '--'"
          ></label-text>

          <label-text title="审批流程" :text="current.sealFlowName ? current.sealFlowName : '无'"></label-text>

          <label-text title="审批人" :text="current.sealFlowShow ? null : '无'">
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
                    <approval-show-list-item :item="item" />
                  </template>
                </virtual-list>
              </a-timeline>
            </template>
          </label-text>
        </a-col>
        <a-col :span="12">
          <label-text title="用印记录" :text="current.fullFile || current.documentFileRelVO ? null : '暂无记录'">
            <template #text>
              <section v-if="current.fullFile" class="img-collection">
                <div class="img-wrap">
                  <img
                    :src="current.fullFile + '?uploadFile=88x88'"
                    @click="previewImg($event, current.fullFile)"
                    alt=""
                  />
                </div>
              </section>
              <section v-else style="display: flex; justify-content: space-between;">
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
          <label-text title="文件归档" :text="current.archivedFlowName ?? '无'"></label-text>
          <label-text title="归档时间" :text="current.archivedTime ?? '无'"></label-text>

          <label-text title="归档附件" :text="current.sealStatus !== 4 && current.fullArchivedFile ? null : '无'">
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

          <label-text
            title="归档备注"
            :text="current.sealStatus !== 4 && current.archivedText ? current.archivedText : '无'"
          ></label-text>
          <label-text title="归档人" :text="current.archivedFlowShow ? null : '无'">
            <template #text>
              <a-timeline>
                <a-timeline-item v-for="(item, index) in current.archivedFlowShow" :key="item.userId" color="red">
                  <template #dot>
                    <div class="time-progess">{{ index + 1 }}</div>
                  </template>
                  <section :class="{ 'time-sec': true, 'time-trans': index }">
                    <img
                      class="time-avatar"
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
                    <p class="time-create">{{ item.examineTime }}</p>
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
        </a-col>
      </a-row>
    </a-card>
  </a-spin>

  <a-modal
    centered
    title="查看图片"
    :width="800"
    :visible="previewVisible"
    @cancel="previewVisible = false"
    :footer="null"
  >
    <img :src="previewUrl" style="width: 760px" />
  </a-modal>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { getApplyDetail, getApplyListDetail, getFingerprintDetail } from '@/apis/seal'
import '@/style/jsx-label-text.scss'
import { useRoute } from 'vue-router'
import { cmsNotice } from '@/utils/utils'
import VirtualList from '@/components/VirtualList'
import ApprovalShowListItem from '@/components/VirtualList/approvalShowListItem'
import LabelText from '@/components/LabelText'
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
// 1暂无状态、2审批中、3同意、4拒绝
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
const typesObj = {
  1: {
    name: '单次用印',
    color: '#C3161C'
  },
  2: {
    name: '连续用印',
    color: '#5F99FF'
  }
}

export default defineComponent({
  components: {
    'label-text': LabelText,
    VirtualList,
    ApprovalShowListItem
  },
  setup() {
    const route = useRoute()
    const current = ref({ documentFileIds: [], sealFlowShow: [] })
    const loading = ref(true)
    const previewVisible = ref(false)
    const previewUrl = ref()
    const isVirtualListScroll = ref(0)
    const getDetail = () => {
      if (route.query.documentId) {
        return getApplyDetail({ documentId: route.query.documentId })
      } else if (route.query.fingerId) {
        return getFingerprintDetail({ documentId: route.query.fingerId, sealName: route.query.sealName })
      }
      return getApplyListDetail({ documentId: route.query.id })
    }
    onMounted(async () => {
      const res = await getDetail()
      current.value = res.data
      loading.value = false
      isVirtualListScroll.value++
      // console.log(current.value)
    })
    const previewImg = (e, src) => {
      previewUrl.value = src
      previewVisible.value = true
    }
    const reImg = (e, src) => {
      const parentNode = e.target.parentNode
      const tipsSpan = document.createElement('a')
      const tipsText = document.createTextNode('点击下载该附件查看')
      tipsSpan.appendChild(tipsText)
      // tipsSpan.src = src.replace('.com//', '.com/')
      tipsSpan.onclick = () => {
        // e.preventDefault()
        window.location.href = src.replace('.com//', '.com/') + '?upload=true'
        setTimeout(() => {
          cmsNotice('success', '正在为你下载，请耐心等待')
        }, 200)
      }
      parentNode.removeChild(e.target)
      parentNode.appendChild(tipsSpan)
    }
    return {
      current,
      loading,
      approvalStatusObj,
      examineStatusObj,
      sealStatusObj,
      archiveStatusObj,
      typesObj,
      previewUrl,
      previewVisible,
      previewImg,
      reImg,
      isVirtualListScroll
    }
  }
})
</script>

<style lang="scss" scoped>
.dotted {
  width: 6px;
  height: 6px;
  // background: greenyellow;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
  transform: translateY(-2px);
}
.approval-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  transform: translateY(5px);
  margin-right: 4px;
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
  margin-bottom: 10px;
  transform: translateY(-6px);
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
    object-fit: cover;
    margin-right: 5px;
    border-radius: 4px;
    transform: translateY(5px);
  }
  .time-name {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 32px;
    margin: 0 30px 0 0;
  }
  .time-action {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
    margin-right: 33px;
  }
  .time-create {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}
.detail-page {
  &::-webkit-scrollbar {
    display: block;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(196, 196, 196);
    border-radius: 4px;
  }
}
</style>
