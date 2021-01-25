import BasicLayout from '@/layout/BasicLayout'
const viewComponents = {
  basicLayout: {
    type: 0,
    component: BasicLayout
  },
  // 上金渊源
  traditionOrigin: {
    type: 2,
    component: () => import(/* webpackChunkName: "traditionOrigin" */ '@/views/Tradition/Origin/index')
  },
  // 首页
  home: {
    type: 1,
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index')
  },
  // 上金名人
  traditionCelebrity: {
    type: 2,
    component: () => import(/* webpackChunkName: "traditionCelebrity" */ '@/views/Tradition/Celebrity/index')
  },
  // 上金民俗
  traditionCustom: {
    type: 2,
    component: () => import(/* webpackChunkName: "traditionCustom" */ '@/views/Tradition/Custom/index')
  },
  // 上金文化
  traditionCulture: {
    type: 2,
    component: () => import(/* webpackChunkName: "traditionCulture" */ '@/views/Tradition/Culture/index')
  },
  // 景区历程
  scenicCourse: {
    type: 2,
    component: () => import(/* webpackChunkName: "scenicCourse" */ '@/views/Scenic/Course/index')
  },
  // 传奇故事
  scenicStory: {
    type: 2,
    component: () => import(/* webpackChunkName: "scenicStory" */ '@/views/Scenic/Story/index')
  },
  // 景区景点
  holidaySpot: {
    type: 2,
    component: () => import(/* webpackChunkName: "holidaySpot" */ '@/views/Holiday/Spot/index')
  },
  // 住宿
  holidayHotel: {
    type: 2,
    component: () => import(/* webpackChunkName: "holidayHotel" */ '@/views/Holiday/Hotel/index')
  },
  // 美食
  holidayDining: {
    type: 2,
    component: () => import(/* webpackChunkName: "holidayDining" */ '@/views/Holiday/Dining/index')
  },
  // 休闲娱乐
  holidayPlay: {
    type: 2,
    component: () => import(/* webpackChunkName: "holidayPlay" */ '@/views/Holiday/Play/index')
  },
  // 商业街
  holidayStreet: {
    type: 2,
    component: () => import(/* webpackChunkName: "holidayStreet" */ '@/views/Holiday/Street/index')
  },
  // 伴手礼
  holidayGift: {
    type: 2,
    component: () => import(/* webpackChunkName: "holidayGift" */ '@/views/Holiday/Gift/index')
  },
  // 景区活动
  movingActivitys: {
    type: 2,
    component: () => import(/* webpackChunkName: "movingActivitys" */ '@/views/Moving/Activitys/index')
  },
  // 新闻动态
  movingNews: {
    type: 2,
    component: () => import(/* webpackChunkName: "scenicNews" */ '@/views/Moving/News/index')
  },
  // 景区公告
  movingAnnouncement: {
    type: 2,
    component: () => import(/* webpackChunkName: "scenicAnnouncement" */ '@/views/Moving/Announcement/index')
  },
  // 影集
  interactiveVideos: {
    type: 2,
    component: () => import(/* webpackChunkName: "interactiveVideo" */ '@/views/Interactive/Videos/index')
  },
  // 图集
  interactivePPT: {
    type: 2,
    component: () => import(/* webpackChunkName: "interactivePPT" */ '@/views/Interactive/PPT/index')
  },
  // 游记攻略
  travelRaiders: {
    type: 2,
    component: () => import(/* webpackChunkName: "travelRaiders" */ '@/views/Travel/Raiders/index')
  },
  // 问卷调查
  QA: {
    type: 1,
    component: () => import(/* webpackChunkName: "QA" */ '@/views/Q&A/index')
  },
  // 宾客意见
  suggest: {
    type: 1,
    component: () => import(/* webpackChunkName: "suggest" */ '@/views/Suggest/index')
  },
  // 栏目管理
  class: {
    type: 1,
    component: () => import(/* webpackChunkName: "Class" */ '@/views/Class/index')
  }
}
const asyncRouter = () => {
  return new Promise(resolve => {
    const navMenus = [
      {
        id: '9',
        hidden: false,
        title: '首页',
        path: '/home',
        children: []
      },
      {
        id: '1',
        hidden: false,
        title: '传统上金',
        children: [
          {
            id: '1-1',
            hidden: false,
            title: '上金渊源',
            path: '/tradition/origin',
            children: []
          },
          {
            id: '1-2',
            hidden: false,
            title: '上金名人',
            path: '/tradition/celebrity',
            children: []
          },
          {
            id: '1-3',
            hidden: false,
            title: '上金民俗',
            path: '/tradition/custom',
            children: []
          },
          {
            id: '1-4',
            hidden: false,
            title: '上金文化',
            path: '/tradition/culture',
            children: []
          }
        ]
      },
      {
        id: '2',
        hidden: false,
        title: '景区概览',
        children: [
          {
            id: '2-1',
            hidden: false,
            title: '景区历程',
            path: '/scenic/course',
            children: []
          },
          {
            id: '2-2',
            hidden: false,
            title: '传奇故事',
            path: '/scenic/story',
            children: []
          }
        ]
      },
      {
        id: '3',
        hidden: false,
        title: '度假上金',
        children: [
          {
            id: '3-1',
            hidden: false,
            title: '景区景点',
            path: '/holiday/spot',
            children: []
          },
          {
            id: '3-2',
            hidden: false,
            title: '住宿',
            path: '/holiday/hotel',
            children: []
          },
          {
            id: '3-3',
            hidden: false,
            title: '美食',
            path: '/holiday/dining',
            children: []
          },
          {
            id: '3-4',
            hidden: false,
            title: '休闲娱乐',
            path: '/holiday/play',
            children: []
          },
          {
            id: '3-5',
            hidden: false,
            title: '商业街',
            path: '/holiday/street',
            children: []
          },
          {
            id: '3-6',
            hidden: false,
            title: '伴手礼',
            path: '/holiday/Gift',
            children: []
          }
        ]
      },
      {
        id: '4',
        hidden: false,
        title: '景区动态',
        children: [
          {
            id: '4-1',
            hidden: false,
            title: '景区活动',
            path: '/moving/activitys',
            children: []
          },
          {
            id: '4-2',
            hidden: false,
            title: '新闻动态',
            path: '/moving/news',
            children: []
          },
          {
            id: '4-3',
            hidden: false,
            title: '景区公告',
            path: '/moving/announcement',
            children: []
          }
        ]
      },
      {
        id: '5',
        hidden: false,
        title: '互动体验',
        children: [
          {
            id: '5-1',
            hidden: false,
            title: '影集',
            path: '/interactive/videos',
            children: []
          },
          {
            id: '5-2',
            hidden: false,
            title: '图集',
            path: '/interactive/ppt',
            children: []
          }
        ]
      },
      {
        id: '6',
        hidden: false,
        title: '出行锦囊',
        children: [
          {
            id: '6-1',
            hidden: false,
            title: '游记攻略',
            path: '/travel/raiders',
            children: []
          }
        ]
      },
      {
        id: '7',
        hidden: false,
        title: '问卷调查',
        path: '/QA',
        children: []
      },
      {
        id: '8',
        hidden: false,
        title: '宾客意见',
        path: '/suggest',
        children: []
      },
      {
        id: '10',
        hidden: false,
        title: '栏目管理',
        path: '/class',
        children: []
      }
    ]
    const routers = [
      {
        path: '/',
        component: viewComponents.basicLayout.component,
        children: [
          {
            path: 'home',
            meta: {
              id: '9',
              title: '首页',
              pids: ['9']
            },
            component: viewComponents.home.component
          },
          {
            path: 'tradition/origin',
            meta: {
              id: '1-1',
              title: '上金渊源',
              pids: ['1', '1-1']
            },
            component: viewComponents.traditionOrigin.component
          },
          {
            path: 'tradition/celebrity',
            meta: {
              id: '1-2',
              title: '上金名人',
              pids: ['1', '1-2']
            },
            component: viewComponents.traditionCelebrity.component
          },
          {
            path: 'tradition/custom',
            meta: {
              id: '1-3',
              title: '上金民俗',
              pids: ['1', '1-3']
            },
            component: viewComponents.traditionCustom.component
          },
          {
            path: 'tradition/culture',
            meta: {
              id: '1-4',
              title: '上金文化',
              pids: ['1', '1-4']
            },
            component: viewComponents.traditionCulture.component
          },
          {
            path: 'scenic/course',
            meta: {
              id: '2-1',
              title: '景区历程',
              pids: ['2', '2-1']
            },
            component: viewComponents.scenicCourse.component
          },
          {
            path: 'scenic/story',
            meta: {
              id: '2-2',
              title: '传奇故事',
              pids: ['2', '2-2']
            },
            component: viewComponents.scenicStory.component
          },
          {
            path: 'holiday/spot',
            meta: {
              id: '3-1',
              title: '景区景点',
              pids: ['3', '3-1']
            },
            component: viewComponents.holidaySpot.component
          },
          {
            path: 'holiday/hotel',
            meta: {
              id: '3-2',
              title: '住宿',
              pids: ['3', '3-2']
            },
            component: viewComponents.holidayHotel.component
          },
          {
            path: 'holiday/dining',
            meta: {
              id: '3-3',
              title: '美食',
              pids: ['3', '3-3']
            },
            component: viewComponents.holidayDining.component
          },
          {
            path: 'holiday/play',
            meta: {
              id: '3-4',
              title: '休闲娱乐',
              pids: ['3', '3-4']
            },
            component: viewComponents.holidayPlay.component
          },
          {
            path: 'holiday/street',
            meta: {
              id: '3-5',
              title: '商业街',
              pids: ['3', '3-5']
            },
            component: viewComponents.holidayStreet.component
          },
          {
            path: 'holiday/gift',
            meta: {
              id: '3-6',
              title: '伴手礼',
              pids: ['3', '3-6']
            },
            component: viewComponents.holidayGift.component
          },
          {
            path: 'moving/activitys',
            meta: {
              id: '4-1',
              title: '景区活动',
              pids: ['4', '4-1']
            },
            component: viewComponents.movingActivitys.component
          },
          {
            path: 'moving/news',
            meta: {
              id: '4-2',
              title: '新闻动态',
              pids: ['4', '4-2']
            },
            component: viewComponents.movingNews.component
          },
          {
            path: 'moving/announcement',
            meta: {
              id: '4-3',
              title: '新闻动态',
              pids: ['4', '4-3']
            },
            component: viewComponents.movingAnnouncement.component
          },
          {
            path: 'interactive/videos',
            meta: {
              id: '5-1',
              title: '影集',
              pids: ['5', '5-1']
            },
            component: viewComponents.interactiveVideos.component
          },
          {
            path: 'interactive/ppt',
            meta: {
              id: '5-2',
              title: '图集',
              pids: ['5', '5-2']
            },
            component: viewComponents.interactivePPT.component
          },
          {
            path: 'travel/raiders',
            meta: {
              id: '6-1',
              title: '游记攻略',
              pids: ['6', '6-1']
            },
            component: viewComponents.travelRaiders.component
          },
          {
            path: 'QA',
            meta: {
              id: '7',
              title: '问卷调查',
              pids: ['7']
            },
            component: viewComponents.QA.component
          },
          {
            path: 'suggest',
            meta: {
              id: '8',
              title: '宾客意见',
              pids: ['8']
            },
            component: viewComponents.suggest.component
          },
          {
            path: 'class',
            meta: {
              id: '10',
              title: '栏目管理',
              pids: ['10']
            },
            component: viewComponents.class.component
          }
        ]
      }
    ]
    resolve({ navMenus, routers })
  })
}
export default asyncRouter
