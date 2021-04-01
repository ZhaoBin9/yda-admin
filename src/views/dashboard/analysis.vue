<template>
  <section class="chapter-total">
    <div class="total-item" v-for="(item, index) of chapterArr" :key="index" :style="`background: ${item.color}`">
      <img :src="require('@/assets/images/home-icon' + (index + 1) + '.png')" class="item-icon" />
      <section class="item-infor">
        <p class="item-name">{{ item.name }}</p>
        <p class="item-count">{{ item.count }}</p>
      </section>
      <img class="item-arrow" src="@/assets/images/home-arrow.png" />
    </div>
  </section>
</template>

<script>
import { companyTotal } from '@/apis/dashboard'
import { onMounted, ref } from 'vue'
export default {
  setup() {
    const chapterArr = ref([
      {
        name: '待审批',
        count: 0,
        color: '#4e4bac',
        index: 'notExamineSum',
        href: ''
      },
      {
        name: '用印记录总数',
        count: 0,
        color: '#7d80bb',
        index: 'recordSum'
      },
      {
        name: '盖印总数',
        count: 0,
        color: '#e56a74',
        index: 'imprintSum'
      },
      {
        name: '用印申请总数',
        count: 0,
        color: '#75c0ce',
        index: 'applySum'
      },
      {
        name: '已归档总数',
        count: 0,
        color: '#ff9d76',
        index: 'archiveSum'
      },
      {
        name: '指纹盖印总数',
        count: 0,
        color: '#515bd4',
        index: 'fingerprintSum'
      }
    ])
    onMounted(async () => {
      const res = await companyTotal()
      chapterArr.value.forEach(item => {
        item.count = res.data[item.index]
      })
    })
    return {
      chapterArr
    }
  }
}
</script>

<style lang="scss" scoped>
.chapter-total {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 80px;
  .total-item {
    padding: 48px 32px;
    width: 31%;
    height: 200px;
    opacity: 1;
    border-radius: 20px;
    margin-bottom: 40px;
    // cursor: pointer;
    .item-icon {
      width: 104px;
      height: 104px;
      float: left;
    }
    .item-infor {
      margin-left: 136px;
      .item-name {
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        line-height: 33px;
        margin-bottom: 15px;
      }
      .item-count {
        font-size: 40px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        line-height: 56px;
      }
    }
    .item-arrow {
      width: 32px;
      height: 14px;
      float: right;
      transform: translateY(-30px);
    }
  }
}
</style>
