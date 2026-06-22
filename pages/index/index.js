const app = getApp()

Page({
  data: {
    remainingCount: 5,
    todayGenerated: 0,
    totalGenerated: 0,
    isMember: false,
    showGuide: false,
    recentList: []
  },

  onLoad() {
    this.loadData()
    this.checkFirstVisit()
  },

  onShow() {
    this.loadData()
  },

  // 加载数据
  loadData() {
    const remainingCount = app.getRemainingCount()
    const todayGenerated = wx.getStorageSync('todayCount') || 0
    const totalGenerated = wx.getStorageSync('totalGenerated') || 0
    const isMember = app.isMember()
    const recentList = this.getRecentList()

    this.setData({
      remainingCount,
      todayGenerated,
      totalGenerated,
      isMember,
      recentList
    })
  },

  // 检查是否首次访问
  checkFirstVisit() {
    const hasVisited = wx.getStorageSync('hasVisited')
    if (!hasVisited) {
      this.setData({ showGuide: true })
      wx.setStorageSync('hasVisited', true)
    }
  },

  // 关闭引导
  closeGuide() {
    this.setData({ showGuide: false })
  },

  // 获取最近生成列表
  getRecentList() {
    const history = wx.getStorageSync('generateHistory') || []
    return history.slice(0, 3).map(item => {
      const typeMap = { good: '好评', medium: '中评', bad: '差评' }
      return {
        ...item,
        ratingTypeText: typeMap[item.ratingType] || '好评',
        createTime: this.formatTime(item.createTime)
      }
    })
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return `${date.getMonth() + 1}/${date.getDate()}`
  },

  // 跳转到生成页
  goToGenerate() {
    wx.switchTab({ url: '/pages/generate/generate' })
  },

  // 跳转到历史页
  goToHistory() {
    wx.switchTab({ url: '/pages/history/history' })
  },

  // 跳转到话术库
  goToTemplates() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  // 跳转到会员页
  goToMember() {
    wx.navigateTo({ url: '/pages/member/member' })
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/generate/generate?id=${id}`
    })
  }
})
