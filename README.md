# 餐饮评价回复助手

基于 AI 的餐饮商家评价回复生成工具，帮助商家高效回复美团、抖音等平台的顾客评价。

## 功能特性

- **智能生成**：粘贴顾客评价，AI 自动生成 3 条回复备选
- **多种风格**：热情感谢、专业简洁、幽默风趣、诚恳道歉、营销引导
- **场景适配**：支持中餐、火锅、烧烤、奶茶等多种店铺类型
- **历史记录**：保存生成记录，支持筛选、搜索、收藏
- **会员服务**：免费版每日 5 条，会员版无限次生成

## 技术栈

### 前端
- 微信小程序原生开发
- WXML + WXSS + JavaScript

### 后端
- Node.js + Express
- 支持 DeepSeek / 硅基流动 AI API

## 项目结构

```
catering-auto-reply/
├── pages/                  # 小程序页面
│   ├── index/             # 首页
│   ├── generate/          # 生成回复页
│   ├── history/           # 历史记录页
│   ├── mine/              # 我的页面
│   └── member/            # 会员中心页
├── server/                # 后端服务
│   ├── app.js             # 主入口
│   ├── package.json       # 依赖配置
│   └── .env.example       # 环境变量示例
├── app.js                 # 小程序全局逻辑
├── app.json               # 小程序全局配置
├── app.wxss               # 小程序全局样式
└── README.md              # 项目说明
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/wangfeng503/catering-auto-reply.git
cd catering-auto-reply
```

### 2. 配置后端服务

```bash
cd server
cp .env.example .env
# 编辑 .env 文件，填入你的 AI API Key
npm install
npm start
```

### 3. 配置小程序

1. 打开微信开发者工具
2. 导入项目，选择 `catering-auto-reply` 目录
3. 在 `app.js` 中修改 `apiBaseUrl` 为你的服务器地址
4. 点击"编译"预览效果

### 4. 申请微信小程序账号

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册小程序账号（个人或企业）
3. 获取 AppID，填入 `project.config.json`
4. 配置服务器域名（需要 HTTPS）

## 配置说明

### AI API 配置

项目支持两种 AI 服务提供商：

| 提供商 | 特点 | 获取地址 |
|--------|------|----------|
| DeepSeek | 中文效果好 | https://platform.deepseek.com |
| 硅基流动 | 免费额度充足 | https://cloud.siliconflow.cn |

推荐新手使用**硅基流动**，注册即送免费额度。

### 小程序配置

在 `app.js` 中修改以下配置：

```javascript
globalData: {
  apiBaseUrl: 'https://your-server-domain.com/api',  // 你的服务器地址
  freeDailyLimit: 5,                                  // 免费用户每日限制
  memberPrice: 9.9                                    // 会员价格
}
```

## 部署说明

### 后端部署

#### 方式一：公司服务器（推荐）

```bash
# 在公司服务器上
git clone https://github.com/wangfeng503/catering-auto-reply.git
cd catering-auto-reply/server
npm install
npm start
```

#### 方式二：云服务器

推荐使用阿里云、腾讯云等云服务器，配置 Nginx 反向代理和 HTTPS。

### 小程序发布

1. 在微信开发者工具中点击"上传"
2. 登录微信公众平台，进入"版本管理"
3. 提交审核
4. 审核通过后发布

## 收费模式

| 功能 | 免费版 | 会员版（9.9元/月） |
|------|--------|-------------------|
| 每日生成次数 | 5 条 | 无限 |
| 回复风格 | 基础 3 种 | 全部 5 种 |
| 历史记录 | 最近 100 条 | 永久保存 |
| 生成速度 | 标准 | 优先 |

## 开发计划

- [x] MVP 版本（生成回复核心功能）
- [ ] 话术库功能
- [ ] 批量生成功能
- [ ] 微信支付接入
- [ ] 数据看板
- [ ] 多店管理

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系：support@example.com
