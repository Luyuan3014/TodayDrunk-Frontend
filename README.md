# TodayDrunk（今日小酌）

现代化饮酒记录应用 - 前端项目

[![Deploy to Vercel](https://github.com/Luyuan3014/TodayDrunk-Frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/Luyuan3014/TodayDrunk-Frontend/actions/workflows/deploy.yml)
[![Code Quality](https://github.com/Luyuan3014/TodayDrunk-Frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/Luyuan3014/TodayDrunk-Frontend/actions/workflows/code-quality.yml)

## ✨ 功能特色

- 🍻 **饮酒记录** - 详细记录每次饮酒体验，包括酒类型、品牌、酒精度、容量等
- 📊 **数据分析** - 可视化统计和趋势分析，了解饮酒习惯
- 🗺️ **地图功能** - 饮酒地点标记和分享，记录美好时光
- 📚 **知识库** - 丰富的酒类知识和文章，提升品酒素养
- 🏆 **成就系统** - 解锁各种饮酒成就，增加趣味性
- 👤 **个人中心** - 用户信息和偏好设置，个性化体验
- 🎨 **现代化UI** - 毛玻璃效果、渐变背景、精致动画

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: TailwindCSS
- **状态管理**: Zustand
- **路由**: React Router DOM
- **图表**: Chart.js + react-chartjs-2
- **图标**: Lucide React
- **构建工具**: Vite
- **代码规范**: ESLint + TypeScript

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/Luyuan3014/TodayDrunk-Frontend.git

# 进入项目目录
cd TodayDrunk-Frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:5173
```

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# TypeScript类型检查
npm run type-check
```

## 📦 部署

### 自动部署

项目已配置GitHub Actions自动部署到Vercel：

- **生产环境**: [https://traegyg1cwep-7kc8y316c-tokyoos-projects-d0903ccf.vercel.app](https://traegyg1cwep-7kc8y316c-tokyoos-projects-d0903ccf.vercel.app)
- **触发条件**: 推送到`main`分支自动触发部署
- **部署状态**: 可在Actions页面查看部署进度

### 手动部署

```bash
# 构建项目
npm run build

# 部署到Vercel
npx vercel --prod
```

## 🔄 CI/CD 流程

### 代码质量检查

- ✅ ESLint代码规范检查
- ✅ TypeScript类型检查
- ✅ 构建测试
- ✅ 依赖检查

### 自动部署流程

1. 代码推送到`main`分支
2. 触发GitHub Actions工作流
3. 安装依赖并运行质量检查
4. 构建生产版本
5. 自动部署到Vercel
6. 部署完成通知

## 📁 项目结构

```
src/
├── components/          # 公共组件
│   ├── BottomNavigation.tsx
│   └── Empty.tsx
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── AddRecord.tsx   # 添加记录
│   ├── History.tsx     # 历史记录
│   ├── Analysis.tsx    # 数据分析
│   ├── Map.tsx         # 地图功能
│   ├── Knowledge.tsx   # 知识库
│   ├── ArticleDetail.tsx # 文章详情
│   └── Profile.tsx     # 个人中心
├── store/              # 状态管理
│   └── index.ts        # Zustand store
├── types/              # TypeScript类型定义
│   └── index.ts        # 全局类型
├── hooks/              # 自定义Hooks
│   └── useTheme.ts     # 主题Hook
├── lib/                # 工具函数
│   └── utils.ts        # 通用工具
├── router/             # 路由配置
│   └── index.tsx       # 路由定义
└── assets/             # 静态资源
    └── react.svg
```

## 🎨 设计特色

### 视觉设计

- **深蓝渐变背景** - 营造高端氛围
- **毛玻璃效果** - 现代化视觉体验
- **金色点缀** - 突出重要元素
- **圆角设计** - 柔和友好的界面
- **精致阴影** - 增强层次感

### 交互体验

- **流畅动画** - 悬停和点击反馈
- **响应式布局** - 完美适配各种设备
- **加载状态** - 优雅的等待体验
- **错误处理** - 友好的错误提示

## 🔧 开发指南

### 代码规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint配置的代码规范
- 组件使用函数式组件 + Hooks
- 样式使用TailwindCSS utility classes

### 提交规范

```bash
# 功能开发
git commit -m "✨ feat: 添加新功能描述"

# 问题修复
git commit -m "🐛 fix: 修复问题描述"

# 样式调整
git commit -m "💄 style: 样式调整描述"

# 重构代码
git commit -m "♻️ refactor: 重构描述"

# 文档更新
git commit -m "📝 docs: 文档更新描述"
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '✨ feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### Pull Request 要求

- 通过所有CI检查
- 包含必要的测试
- 更新相关文档
- 遵循代码规范

## 📊 项目统计

- **页面数量**: 7个核心页面
- **组件数量**: 10+个可复用组件
- **代码行数**: 2000+行
- **依赖包数**: 20+个精选依赖

## 🔮 未来规划

### 短期目标

- [ ] 添加单元测试
- [ ] 实现PWA支持
- [ ] 添加国际化支持
- [ ] 优化性能和SEO

### 长期目标

- [ ] 开发后端API
- [ ] 实现用户认证
- [ ] 添加社交功能
- [ ] 移动端App开发

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

**Luyuan3014** - [GitHub](https://github.com/Luyuan3014)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

⭐ 如果这个项目对您有帮助，请给它一个星标！