const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// AI 服务配置
const AI_CONFIG = {
  // DeepSeek API
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY
  },
  // 硅基流动 API
  siliconflow: {
    url: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-V3',
    apiKey: process.env.SILICONFLOW_API_KEY
  }
}

// 默认使用硅基流动（免费额度充足）
const DEFAULT_PROVIDER = 'siliconflow'

/**
 * 生成回复 API
 * POST /api/generate
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, style, ratingType } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const provider = AI_CONFIG[DEFAULT_PROVIDER]

    const response = await axios.post(
      provider.url,
      {
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: '你是一位资深的餐饮运营专家，擅长为各类餐饮店铺撰写评价回复。请根据提供的信息生成 3 条不同的回复备选，每条 50-100 字。直接输出 3 条回复，用数字编号，不要加其他说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    // 解析 AI 返回的内容
    const content = response.data.choices[0].message.content
    const replies = parseReplies(content)

    res.json({
      success: true,
      replies: replies,
      style: style,
      ratingType: ratingType
    })

  } catch (error) {
    console.error('AI API Error:', error.message)
    res.status(500).json({
      error: '生成失败',
      message: error.message
    })
  }
})

/**
 * 解析 AI 返回的回复内容
 */
function parseReplies(content) {
  // 尝试按数字编号分割
  const regex = /(?:\d+[\.、\.]\s*|回复\s*\d+[:：]\s*)/g
  const parts = content.split(regex).filter(p => p.trim())

  if (parts.length >= 3) {
    return parts.slice(0, 3).map(p => p.trim())
  }

  // 如果无法按编号分割，按换行分割
  const lines = content.split('\n').filter(line => line.trim().length > 10)
  if (lines.length >= 3) {
    return lines.slice(0, 3).map(l => l.trim())
  }

  // 兜底：返回整个内容
  return [content.trim()]
}

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API Base URL: http://localhost:${PORT}/api`)
})
