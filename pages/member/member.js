const app = getApp()

Page({
  data: {},

  onLoad() {},

  // 购买会员
  purchaseMember() {
    wx.showModal({
      title: '确认购买',
      content: '餐饮评价回复助手会员\n9.9 元/月\n\n确认开通吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟支付成功
          this.simulatePayment()
        }
      }
    })
  },

  // 模拟支付（实际项目中需要接入微信支付）
  simulatePayment() {
    wx.showLoading({ title: '处理中...' })

    setTimeout(() => {
      wx.hideLoading()

      // 设置会员到期时间（30 天后）
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)
      wx.setStorageSync('memberExpiry', expiryDate.toISOString())

      wx.showToast({
        title: '开通成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    }, 1500)
  }
})
