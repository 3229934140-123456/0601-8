export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/city/index',
    'pages/shoot/index',
    'pages/message/index',
    'pages/mine/index',
    'pages/challenge/index',
    'pages/creator/index',
    'pages/video-detail/index',
    'pages/shop-detail/index',
    'pages/user-profile/index',
    'pages/search/index',
    'pages/publish-setting/index',
    'pages/chat/index',
    'pages/booking-detail/index',
    'pages/draft-box/index',
    'pages/collection-manage/index',
    'pages/business-info/index',
    'pages/task-detail/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '探店',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F7F8FA',
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF2E63',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/city/index',
        text: '同城',
      },
      {
        pagePath: 'pages/shoot/index',
        text: '发布',
      },
      {
        pagePath: 'pages/message/index',
        text: '消息',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
  },
})
