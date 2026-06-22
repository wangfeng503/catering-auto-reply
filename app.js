App({
  globalData: {
    userInfo: null,
    apiBaseUrl: 'https://your-server-domain.com/api',
    freeDailyLimit: 5,
    memberPrice: 9.9
  },

  onLaunch() {
    // 检查本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
    
    // 初始化今日使用次数
    this.initDailyCount()
  },

  // 初始化每日计数
  initDailyCount() {
    const today = new Date().toDateString()
    const storedDate = wx.getStorageSync('countDate')
    
    if (storedDate !== today) {
      wx.setStorageSync('countDate', today)
      wx.setStorageSync('todayCount', 0)
    }
  },

  // 获取今日剩余次数
  getRemainingCount() {
    const todayCount = wx.getStorageSync('todayCount') || 0
    return Math.max(0, this.globalData.freeDailyLimit - todayCount)
  },

  // 增加使用次数
  incrementCount() {
    const todayCount = wx.getStorageSync('todayCount') || 0
    wx.setStorageSync('todayCount', todayCount + 1)
  },

  // 检查是否是会员
  isMember() {
    const memberExpiry = wx.getStorageSync('memberExpiry')
    if (!memberExpiry) return false
    return new Date(memberExpiry) > new Date()
  }
})
