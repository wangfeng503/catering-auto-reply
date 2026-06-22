const app = getApp()

Page({
  data: {
    currentStep: 1,
    reviewContent: '',
    shopName: '',
    specialInfo: '',
    shopType: '中餐',
    shopTypes: ['中餐', '火锅', '烧烤', '奶茶', '快餐', '西餐', '其他'],
    ratingType: 'good',
    ratingTypes: [
      { value: 'good', label: '好评' },
      { value: 'medium', label: '中评' },
      { value: 'bad', label: '差评' }
    ],
    style: 'warm',
    styles: [
      { value: 'warm', label: '热情感谢' },
      { value: 'professional', label: '专业简洁' },
      { value: 'humor', label: '幽默风趣' },
      { value: 'apology', label: '诚恳道歉' },
      { value: 'marketing', label: '营销引导' }
    ],
    isLoading: false,
    replies: [],
    errorMsg: '',
    showLimitModal: false
  },

  onLoad(options) {
    // 如果有 id，加载历史记录
    if (options.id) {
      this.loadHistoryItem(options.id)
    }
  },

  // 输入评价
  onReviewInput(e) {
    this.setData({ reviewContent: e.detail.value })
  },

  // 输入店铺名
  onShopNameInput(e) {
    this.setData({ shopName: e.detail.value })
  },

  // 输入补充信息
  onSpecialInfoInput(e) {
    this.setData({ specialInfo: e.detail.value })
  },

  // 选择店铺类型
  selectShopType(e) {
    this.setData({ shopType: e.currentTarget.dataset.type })
  },

  // 选择评价类型
  selectRatingType(e) {
    this.setData({ ratingType: e.currentTarget.dataset.type })
  },

  // 选择风格
  selectStyle(e) {
    this.setData({ style: e.currentTarget.dataset.style })
  },

  // 去步骤 2
  goToStep2() {
    if (!this.data.reviewContent || this.data.reviewContent.length < 5) {
      wx.showToast({ title: '请输入至少 5 个字的评价', icon: 'none' })
      return
    }
    this.setData({ currentStep: 2 })
  },

  // 去步骤 1
  goToStep1() {
    this.setData({ 
      currentStep: 1,
      replies: [],
      errorMsg: ''
    })
  },

  // 生成回复
  async generateReply() {
    // 检查次数限制
    if (!app.isMember()) {
      const remaining = app.getRemainingCount()
      if (remaining <= 0) {
        this.setData({ showLimitModal: true })
        return
      }
    }

    this.setData({ 
      currentStep: 3,
      isLoading: true,
      replies: [],
      errorMsg: ''
    })

    try {
      const replies = await this.callAIAPI()
      
      // 保存到历史记录
      this.saveToHistory(replies)
      
      // 增加使用次数
      app.incrementCount()
      
      this.setData({
        isLoading: false,
        replies: replies
      })
    } catch (err) {
      this.setData({
        isLoading: false,
        errorMsg: err.message || '生成失败，请重试'
      })
    }
  },

  // 调用 AI API
  callAIAPI() {
    return new Promise((resolve, reject) => {
      const { reviewContent, shopType, ratingType, style, shopName, specialInfo } = this.data
      
      // 构建 prompt
      const styleMap = {
        warm: '热情感谢',
        professional: '专业简洁',
        humor: '幽默风趣',
        apology: '诚恳道歉',
        marketing: '营销引导'
      }
      
      const ratingMap = {
        good: '好评',
        medium: '中评',
        bad: '差评'
      }

      const prompt = `你是一位资深的餐饮运营专家，擅长为各类餐饮店铺撰写评价回复。

店铺类型：${shopType}
评价类型：${ratingMap[ratingType]}
回复风格：${styleMap[style]}
${shopName ? '店铺名称：' + shopName : ''}
${specialInfo ? '补充信息：' + specialInfo : ''}

顾客评价：${reviewContent}

请根据以上信息，生成 3 条不同的回复备选。要求：
1. 符合${ratingMap[ratingType]}的回复策略
2. 采用${styleMap[style]}的语气风格
3. 每条回复 50-100 字
4. 语言自然、有温度，避免机械感
5. 适当引导复购或表达改进意愿

请直接输出 3 条回复，用数字编号，不要加其他说明。`

      // 调用后端 API
      wx.request({
        url: `${app.globalData.apiBaseUrl}/generate`,
        method: 'POST',
        data: {
          prompt: prompt,
          style: style,
          ratingType: ratingType
        },
        timeout: 30000,
        success: (res) => {
          if (res.statusCode === 200 && res.data.replies) {
            resolve(res.data.replies)
          } else {
            reject(new Error(res.data.message || '生成失败'))
          }
        },
        fail: (err) => {
          // 如果后端不可用，使用模拟数据
          console.log('API 调用失败，使用模拟数据', err)
          resolve(this.getMockReplies())
        }
      })
    })
  },

  // 模拟回复数据（开发测试用）
  getMockReplies() {
    const { ratingType, style } = this.data
    
    const mockData = {
      good: {
        warm: [
          '非常感谢您的好评！能得到您的认可是我们最大的动力。期待您下次光临，我们准备了更多惊喜等您来发现！',
          '太开心了！感谢您对我们菜品和服务的认可。我们会继续努力，让每一位顾客都吃得开心、满意而归！',
          '感谢您的五星好评！您的满意就是我们前进的动力，欢迎常来，下次给您安排最好的位置！'
        ],
        marketing: [
          '感谢您的好评！现在关注店铺公众号可领取 8 折优惠券，下次来用餐更划算哦！',
          '太感谢您的认可了！推荐您试试我们的招牌新品，凭此回复截图可享会员价！',
          '感谢您的好评！我们每周三有会员日活动，全场 8.5 折，期待您的再次光临！'
        ]
      },
      bad: {
        apology: [
          '非常抱歉给您带来了不好的体验。我们已经认真反思，会立即改进相关问题。希望能给您一次弥补的机会。',
          '对不起，这次让您失望了。我们会严肃处理您反馈的问题，并加强员工培训。期待您能再给我们一次机会。',
          '深表歉意！您提到的问题我们已经记录，会尽快整改。如有任何需要，请随时联系我们。'
        ]
      }
    }

    // 返回默认数据
    return mockData[ratingType]?.[style] || [
      '感谢您的评价！我们会认真对待每一位顾客的反馈，持续改进服务质量。',
      '谢谢您的宝贵意见！您的反馈是我们进步的动力，期待下次为您提供更好的体验。',
      '感谢您的光临！我们会继续努力，让每一位顾客都满意而归。'
    ]
  },

  // 保存到历史记录
  saveToHistory(replies) {
    const history = wx.getStorageSync('generateHistory') || []
    const newItem = {
      id: Date.now(),
      reviewContent: this.data.reviewContent,
      replyContent: replies[0],
      shopType: this.data.shopType,
      ratingType: this.data.ratingType,
      style: this.data.style,
      replies: replies,
      createTime: Date.now()
    }
    
    history.unshift(newItem)
    // 最多保存 100 条
    if (history.length > 100) {
      history.pop()
    }
    
    wx.setStorageSync('generateHistory', history)
    
    // 更新累计生成数
    const total = wx.getStorageSync('totalGenerated') || 0
    wx.setStorageSync('totalGenerated', total + 1)
  },

  // 复制回复
  copyReply(e) {
    const index = e.currentTarget.dataset.index
    const content = this.data.replies[index]
    
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  // 收藏回复
  favoriteReply(e) {
    const index = e.currentTarget.dataset.index
    const favorites = wx.getStorageSync('favoriteReplies') || []
    
    favorites.push({
      content: this.data.replies[index],
      shopType: this.data.shopType,
      ratingType: this.data.ratingType,
      style: this.data.style,
      createTime: Date.now()
    })
    
    wx.setStorageSync('favoriteReplies', favorites)
    wx.showToast({ title: '已收藏', icon: 'success' })
  },

  // 重新生成单条
  regenerateSingle(e) {
    // 实际项目中可以调用 API 重新生成单条
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  // 重新生成全部
  regenerateAll() {
    this.generateReply()
  },

  // 加载历史记录
  loadHistoryItem(id) {
    const history = wx.getStorageSync('generateHistory') || []
    const item = history.find(h => h.id == id)
    if (item) {
      this.setData({
        reviewContent: item.reviewContent,
        shopType: item.shopType,
        ratingType: item.ratingType,
        style: item.style
      })
    }
  },

  // 去会员页
  goToMember() {
    this.setData({ showLimitModal: false })
    wx.navigateTo({ url: '/pages/member/member' })
  },

  // 关闭限制弹窗
  closeLimitModal() {
    this.setData({ showLimitModal: false })
  }
})
