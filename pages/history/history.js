const app = getApp()

Page({
  data: {
    filterType: 'all',
    searchKeyword: '',
    historyList: [],
    filteredList: []
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('generateHistory') || []
    const styleMap = {
      warm: '热情感谢',
      professional: '专业简洁',
      humor: '幽默风趣',
      apology: '诚恳道歉',
      marketing: '营销引导'
    }
    const typeMap = { good: '好评', medium: '中评', bad: '差评' }

    const formattedList = history.map(item => ({
      ...item,
      ratingTypeText: typeMap[item.ratingType] || '好评',
      styleText: styleMap[item.style] || '热情感谢',
      createTime: this.formatTime(item.createTime)
    }))

    this.setData({
      historyList: formattedList,
      filteredList: formattedList
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
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  },

  // 设置筛选
  setFilter(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ filterType: type })
    this.applyFilter()
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
    this.applyFilter()
  },

  // 应用筛选
  applyFilter() {
    let list = this.data.historyList

    // 按类型筛选
    if (this.data.filterType !== 'all') {
      list = list.filter(item => item.ratingType === this.data.filterType)
    }

    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase()
      list = list.filter(item => 
        item.reviewContent.toLowerCase().includes(keyword) ||
        item.replyContent.toLowerCase().includes(keyword)
      )
    }

    this.setData({ filteredList: list })
  },

  // 复制回复
  copyReply(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.filteredList[index]

    wx.setClipboardData({
      data: item.replyContent,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.filteredList[index]

    wx.navigateTo({
      url: `/pages/generate/generate?id=${item.id}`
    })
  },

  // 删除记录
  deleteItem(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.filteredList[index]

    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      success: (res) => {
        if (res.confirm) {
          let history = wx.getStorageSync('generateHistory') || []
          history = history.filter(h => h.id !== item.id)
          wx.setStorageSync('generateHistory', history)
          this.loadHistory()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 去生成页
  goToGenerate() {
    wx.switchTab({ url: '/pages/generate/generate' })
  }
})
