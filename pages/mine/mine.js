const app = getApp()

Page({
  data: {
    isMember: false,
    totalGenerated: 0,
    todayGenerated: 0,
    favoriteCount: 0
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  // 加载数据
  loadData() {
    const isMember = app.isMember()
    const totalGenerated = wx.getStorageSync('totalGenerated') || 0
    const todayGenerated = wx.getStorageSync('todayCount') || 0
    const favorites = wx.getStorageSync('favoriteReplies') || []

    this.setData({
      isMember,
      totalGenerated,
      todayGenerated,
      favoriteCount: favorites.length
    })
  },

  // 去会员页
  goToMember() {
    wx.navigateTo({ url: '/pages/member/member' })
  },

  // 去收藏页
  goToFavorites() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  // 去帮助页
  goToHelp() {
    wx.showModal({
      title: '使用帮助',
      content: '1. 在"生成"页面粘贴顾客评价\n2. 选择店铺类型、评价类型和回复风格\n3. 点击"生成回复"获取 AI 生成的回复\n4. 复制回复并粘贴到美团/抖音等平台\n\n免费用户每日可生成 5 条，会员无限次。',
      showCancel: false
    })
  },

  // 去反馈页
  goToFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请联系：\n邮箱：support@example.com',
      showCancel: false
    })
  },

  // 去关于页
  goToAbout() {
    wx.showModal({
      title: '关于我们',
      content: '餐饮评价回复助手\n版本：v1.0.0\n\n基于 AI 技术，帮助餐饮商家高效回复顾客评价。',
      showCancel: false
    })
  }
})
