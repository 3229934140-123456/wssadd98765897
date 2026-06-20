export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/tasks/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF8C69',
    navigationBarTitleText: '码字小屋',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F5'
  },
  tabBar: {
    color: '#9C9690',
    selectedColor: '#FF8C69',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '小屋'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '任务卡'
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置'
      }
    ]
  }
})
