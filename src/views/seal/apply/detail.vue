<template>
  <a-card style="margin: 40px">
    <a-row>
      <a-col :span="12">
        <label-text :title="$route.query.documentId ? '文件名称' : '用印名称'" :text="current.fileName ?? '--'">
        </label-text>
        <label-text title="申请人" v-if="$route.query.documentId" :text="current.userName ?? '--'"> </label-text>
        <a-row v-for="(item, index) in current.sealShow" :key="item.documentId">
          <a-col :span="12"
            ><label-text
              :title="`${$route.query.documentId ? '印章名称' : '盖印人'}${index === 0 ? '' : index + 1}`"
              :text="item.sealName"
            >
            </label-text
          ></a-col>
          <a-col :span="12"
            ><label-text
              :title="`${$route.query.documentId ? '申请次数' : '实际盖印次数'}${index === 0 ? '' : index + 1}`"
              :text="item.applicationNumber"
            >
            </label-text
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <label-text title="用印状态">
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
          <a-col :span="12">
            <label-text title="审批状态" v-if="$route.query.documentId">
              <template #text>
                <p class="label-name">
                  <span class="dotted" :style="{ background: sealStatusObj[current.sealStatus ?? 0].color }"></span
                  >{{ sealStatusObj[current.sealStatus ?? 0].name }}
                </p>
              </template>
            </label-text>
          </a-col>
        </a-row>

        <label-text title="审批流程" :text="current.sealFlowName ?? '--'"> </label-text>
        <div style="height: 15px"></div>
        <label-text title="审批人">
          <template #text>
            <a-timeline>
              <a-timeline-item v-for="(item, index) in current.sealFlowShow.slice(1)" :key="item.userId" color="red">
                <template #dot>
                  <div class="time-progess">{{ index + 1 }}</div>
                </template>
                <section :class="{ 'time-sec': true, 'time-trans': index }">
                  <p class="time-name">{{ item.name }}</p>
                  <p class="time-action" :style="{ color: approvalStatusObj[item.state]?.color || 'red' }">
                    {{ approvalStatusObj[item.state]?.text || '--' }}
                  </p>
                  <p class="time-create">{{ item.examineTime }}</p>
                </section>
              </a-timeline-item>
            </a-timeline>
          </template>
        </label-text>
        <label-text
          title="申请事由"
          v-if="$route.query.documentId"
          :text="current.applyText ? current.applyText : '无'"
        >
        </label-text>
        <label-text title="附件" v-if="$route.query.documentId" :text="current.fullDocumentFile.length ? null : '无'">
          <template #text>
            <section class="img-collection">
              <div class="img-wrap" v-for="it in current.fullDocumentFile" :key="it">
                <img :src="it" alt="" />
              </div>
            </section>
          </template>
        </label-text>
      </a-col>
      <a-col :span="12">
        <label-text title="用印记录" v-if="current.documentFileRelVO.length">
          <template #text>
            <section v-for="item in current.documentFileRelVO" :key="item.sealTime">
              <p class="label-name" v-if="$route.query.documentId">
                （印章名称：{{ current.sealShow[0].sealName }}） （盖章人：{{ current.userName }}）
              </p>
              <p class="label-name" v-if="$route.query.documentId">
                （实际盖章次数：1次） （盖章地点：{{ item.site }}）
              </p>
              <p class="label-name" v-if="$route.query.documentId">用印影像：</p>
              <section class="img-collection">
                <div class="img-wrap" v-for="it in item.fileId" :key="it">
                  <img :src="it" alt="" />
                </div>
              </section>
            </section>
          </template>
        </label-text>
        <label-text title="归档时间" :text="current.archivedTime ?? '--'"> </label-text>
        <label-text v-if="$route.query.id" title="归档备注" :text="current.archivedText ?? '--'"> </label-text>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { getApplyDetail, getApplyListDetail, getFingerprintDetail } from '@/apis/seal'
import '@/style/jsx-label-text.scss'
import { useRoute } from 'vue-router'
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
const examineStatusObj = {
  0: {
    name: '用印审批中',
    color: '#5F99FF'
  },
  1: {
    name: '用印同意',
    color: '#43CF75'
  },
  2: {
    name: '用印拒绝',
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
    color: '#5F99FF'
  },
  2: {
    name: '用印中',
    color: '#43CF75'
  },
  3: {
    name: '待归档',
    color: '#FF8309'
  },
  4: {
    name: '已归档',
    color: '#D0D0D0'
  },
  5: {
    name: '未通过',
    color: '#ccc'
  }
}
const LabelText = defineComponent({
  name: 'label-text',
  props: ['text', 'title'],
  render() {
    return (
      <div class="jsx-label-content">
        <section class="label-text">
          <p class="label-title">{this.title}：</p>
          {this.text ? <p class="label-name">{this.text}</p> : this.$slots.text()}
        </section>
        {this.$slots.default && this.$slots.default()}
      </div>
    )
  }
})

export default defineComponent({
  components: {
    'label-text': LabelText
  },
  setup() {
    const route = useRoute()
    const current = ref({ fullDocumentFile: [], documentFileRelVO: [], sealFlowShow: [] })
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
      current.value = { ...current.value, ...res.data }
      console.log(res)
    })
    return {
      current,
      approvalStatusObj,
      examineStatusObj,
      sealStatusObj
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
  transform: translateY(-6px);
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
    line-height: 20px;
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}
</style>
