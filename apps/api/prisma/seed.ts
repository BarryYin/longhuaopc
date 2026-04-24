import { PrismaClient, PolicyCategory, ServiceCategory, Board, CourseCategory, TransactionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ==================== 用户 ====================
  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone: '13800138001' },
      update: {},
      create: {
        phone: '13800138001',
        phoneVerified: true,
        nickname: 'AI创业者小王',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
        bio: '专注AIGC应用开发，寻找志同道合的伙伴',
        location: '上海徐汇龙华',
        industry: 'AI',
        companyStatus: 'preparing',
        level: 3,
        exp: 450,
        role: 'USER',
      },
    }),
    prisma.user.upsert({
      where: { phone: '13800138002' },
      update: {},
      create: {
        phone: '13800138002',
        phoneVerified: true,
        nickname: '设计师阿琳',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alin',
        bio: '十年UI/UX设计经验，接品牌设计、小程序设计',
        location: '上海徐汇',
        industry: 'DESIGN',
        companyStatus: 'registered',
        companyName: '阿琳设计工作室',
        level: 5,
        exp: 1200,
        role: 'PROVIDER',
        serviceCount: 2,
      },
    }),
    prisma.user.upsert({
      where: { phone: '13800138003' },
      update: {},
      create: {
        phone: '13800138003',
        phoneVerified: true,
        nickname: '全栈老李',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=laoli',
        bio: 'React/Node/Python全栈开发，接外包项目',
        location: '上海',
        industry: 'AI',
        companyStatus: 'registered',
        level: 4,
        exp: 890,
        role: 'PROVIDER',
        serviceCount: 1,
      },
    }),
    prisma.user.upsert({
      where: { phone: '13800138004' },
      update: {},
      create: {
        phone: '13800138004',
        phoneVerified: true,
        nickname: '创业导师张老师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
        bio: '前独角兽公司运营总监，现专注辅导早期创业者',
        location: '上海徐汇',
        industry: 'CONSULTING',
        level: 8,
        exp: 3500,
        role: 'MENTOR',
      },
    }),
    prisma.user.upsert({
      where: { phone: '13800138005' },
      update: {},
      create: {
        phone: '13800138005',
        phoneVerified: true,
        nickname: '龙华街道官方',
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=gov',
        bio: '徐汇区龙华街道办事处官方账号',
        location: '上海徐汇龙华',
        industry: 'GOV',
        level: 10,
        exp: 9999,
        role: 'ADMIN',
      },
    }),
  ]);

  const [userWang, userAlin, userLaoli, userTeacher, userAdmin] = users;
  console.log(`✅ Created ${users.length} users`);

  // ==================== 政策 ====================
  const policies = await Promise.all([
    prisma.policy.upsert({
      where: { id: 'policy-1' },
      update: {},
      create: {
        id: 'policy-1',
        title: '徐汇区"模速空间"大模型创新生态社区入驻政策',
        summary: '面向大模型创业团队，提供算力补贴、办公空间、投融资对接等一站式扶持',
        content: `## 政策概述
徐汇区打造"模速空间"大模型创新生态社区，位于西岸传媒港，为大模型创业团队提供全链条扶持。

## 核心福利
- 算力补贴：最高50万元免费算力额度
- 办公空间：首年租金减半，OPC工位800元/月起
- 投融资对接：对接徐汇科创基金，最高500万元股权投资
- 技术支持：接入上海AI实验室开源模型资源

## 申请条件
1. 注册地在徐汇区
2. 从事大模型研发、AI应用开发或AIGC创业
3. 团队规模不限（支持OPC/超级个体）
4. 有明确的产品方向或商业计划

## 申请材料
- 营业执照副本
- 法人身份证复印件
- 项目计划书或产品Demo
- 团队介绍

## 申请流程
1. 登录徐汇区政务服务中心在线提交申请
2. 填写模速空间入驻申请表
3. 上传相关材料
4. 等待审核（约10个工作日）
5. 审核通过后签订入驻协议`,
        category: PolicyCategory.COMPUTING,
        tags: ['AI', '算力', '模速空间', '大模型', '西岸'],
        targetAudience: '大模型/AI应用创业团队及OPC创业者',
        eligibility: '注册地在徐汇区，从事AI相关研发或应用',
        amount: { type: 'range', min: 0, max: 500000, currency: 'CNY', description: '最高50万元算力补贴+办公空间优惠' },
        materials: ['营业执照', '法人身份证', '项目计划书', '团队介绍'],
        source: '徐汇区科学技术委员会',
        officialUrl: 'https://www.xuhui.gov.cn/kjwy',
        validFrom: new Date('2024-06-01'),
        validTo: new Date('2027-05-31'),
        publishDate: new Date('2024-06-01'),
        status: 'PUBLISHED',
        viewCount: 328,
        favoriteCount: 45,
      },
    }),
    prisma.policy.upsert({
      where: { id: 'policy-2' },
      update: {},
      create: {
        id: 'policy-2',
        title: '龙华街道文化创意与数字经济产业扶持政策',
        summary: '依托龙华历史文化风貌区和西岸艺术区，扶持文化科技融合创业项目',
        content: `## 政策概述
龙华街道地处徐汇区南部，拥有龙华古寺、龙华烈士陵园等文化地标，毗邻西岸艺术区。

## 核心福利
- 创业补贴：首次注册OPC/个体工商户，一次性补贴5000元
- 场地支持：龙华会商圈联合办公空间，首月免租
- 活动支持：免费参加龙华创业沙龙（每月一期）
- 品牌推广：优秀项目获龙华街道官方公众号推荐

## 申请条件
1. 在龙华街道注册或实际经营
2. 从事文化创意、数字内容、AIGC等领域
3. 成立时间不超过2年`,
        category: PolicyCategory.FUND,
        tags: ['龙华', '文化创意', '数字经济', '补贴', 'AIGC'],
        targetAudience: '龙华街道文化科技融合创业者',
        eligibility: '在龙华街道注册或经营，成立不超过2年',
        amount: { type: 'fixed', max: 5000, currency: 'CNY', description: '一次性创业补贴5000元+场地优惠' },
        materials: ['营业执照', '创业计划书', '身份证'],
        source: '徐汇区龙华街道办事处',
        officialUrl: 'https://www.xuhui.gov.cn/longhua',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2026-12-31'),
        publishDate: new Date('2024-01-01'),
        status: 'PUBLISHED',
        viewCount: 156,
        favoriteCount: 23,
      },
    }),
    prisma.policy.upsert({
      where: { id: 'policy-3' },
      update: {},
      create: {
        id: 'policy-3',
        title: '徐汇区小微企业税收优惠',
        summary: '小规模纳税人月销售额10万元以下免征增值税，小型微利企业所得税按5%',
        content: `## 增值税优惠
- 小规模纳税人月销售额≤10万元：免征增值税
- 小规模纳税人征收率：3%减按1%

## 企业所得税优惠
小型微利企业（同时满足）：
- 从业人数≤300人
- 资产总额≤5000万元
- 年应纳税所得额≤300万元

优惠：按5%税率缴纳企业所得税`,
        category: PolicyCategory.TAX,
        tags: ['税收', '小微企业', '增值税', '所得税'],
        targetAudience: '徐汇区注册的小微企业',
        eligibility: '符合小微企业认定标准',
        amount: { type: 'unlimited', currency: 'CNY', description: '按实际纳税额减免' },
        materials: ['纳税申报表'],
        source: '国家税务总局上海市徐汇区税务局',
        officialUrl: 'https://shanghai.chinatax.gov.cn',
        validFrom: new Date('2023-01-01'),
        validTo: new Date('2027-12-31'),
        publishDate: new Date('2023-01-01'),
        status: 'PUBLISHED',
        viewCount: 512,
        favoriteCount: 89,
      },
    }),
    prisma.policy.upsert({
      where: { id: 'policy-4' },
      update: {},
      create: {
        id: 'policy-4',
        title: '徐汇区创业担保贷款',
        summary: '最高300万元创业担保贷款，财政贴息',
        content: `## 贷款额度
- 个人创业：最高50万元
- 合伙企业：最高300万元

## 贷款期限
最长3年

## 贴息政策
财政给予部分贴息，实际利率约2%`,
        category: PolicyCategory.FUND,
        tags: ['贷款', '融资', '担保', '贴息'],
        targetAudience: '徐汇区创业者',
        eligibility: '18-45周岁，信用良好',
        amount: { type: 'range', min: 100000, max: 3000000, currency: 'CNY', description: '最高300万元' },
        materials: ['身份证', '营业执照', '创业计划书', '征信报告'],
        source: '徐汇区人力资源和社会保障局',
        officialUrl: 'https://www.xuhui.gov.cn/rsj',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2025-12-31'),
        publishDate: new Date('2024-01-01'),
        status: 'PUBLISHED',
        viewCount: 234,
        favoriteCount: 56,
      },
    }),
    prisma.policy.upsert({
      where: { id: 'policy-5' },
      update: {},
      create: {
        id: 'policy-5',
        title: '徐汇区人工智能人才公寓',
        summary: 'AI领域人才可申请人才公寓，租金低于市场价30%',
        content: `## 申请对象
在徐汇区人工智能企业工作的核心技术人才、算法工程师、产品经理等。

## 公寓位置
- 漕河泾开发区人才公寓
- 西岸传媒港青年公寓

## 租金标准
低于同地段市场价30%，单人间2500元/月起`,
        category: PolicyCategory.TALENT,
        tags: ['人才', '公寓', 'AI', '住房'],
        targetAudience: '徐汇区AI企业人才',
        eligibility: '在徐汇区AI企业工作，本科及以上学历',
        amount: { type: 'unlimited', currency: 'CNY', description: '租金优惠30%' },
        materials: ['劳动合同', '学历证明', '身份证'],
        source: '徐汇区住房保障和房屋管理局',
        officialUrl: 'https://www.xuhui.gov.cn/zfbz',
        validFrom: new Date('2024-03-01'),
        validTo: new Date('2026-02-28'),
        publishDate: new Date('2024-03-01'),
        status: 'PUBLISHED',
        viewCount: 189,
        favoriteCount: 34,
      },
    }),
    prisma.policy.upsert({
      where: { id: 'policy-6' },
      update: {},
      create: {
        id: 'policy-6',
        title: '龙华街道OPC共享办公空间免费入驻计划',
        summary: '为OPC（一人公司）创业者提供3个月免费共享办公空间',
        content: `## 免费入驻期限
- 首次申请：3个月免费
- 续约优惠：第4-6个月租金5折

## 空间配置
- 独立工位
- 共享会议室（每月10小时免费）
- 高速网络
- 咖啡茶水`,
        category: PolicyCategory.SPACE,
        tags: ['龙华', 'OPC', '共享办公', '免费', '工位'],
        targetAudience: 'OPC创业者、自由职业者',
        eligibility: '在龙华街道注册或居住，从事数字内容/科技/创意工作',
        amount: { type: 'fixed', max: 0, currency: 'CNY', description: '前3个月免费' },
        materials: ['身份证', '工作证明/作品集'],
        source: '龙华街道营商服务中心',
        officialUrl: 'https://www.xuhui.gov.cn/longhua',
        validFrom: new Date('2024-07-01'),
        validTo: new Date('2025-06-30'),
        publishDate: new Date('2024-07-01'),
        status: 'PUBLISHED',
        viewCount: 445,
        favoriteCount: 112,
      },
    }),
  ]);
  console.log(`✅ Created ${policies.length} policies`);

  // ==================== 技能市场 - 服务 ====================
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: {
        id: 'service-1',
        providerId: userAlin.id,
        title: '品牌VI设计全套',
        category: ServiceCategory.DESIGN,
        description: '包含Logo设计、品牌色彩系统、字体规范、名片/信纸/信封等全套VI设计。适合初创企业快速建立专业品牌形象。提供3套初稿方案，不限修改次数直到满意。',
        price: { type: 'fixed', fixed: 5800, currency: 'CNY' },
        tags: ['品牌设计', 'VI', 'Logo', '初创企业'],
        deliveryTime: '7-10天',
        portfolio: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
        viewCount: 89,
        orderCount: 12,
        rating: 4.8,
        reviewCount: 12,
        status: 'PUBLISHED',
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: {
        id: 'service-2',
        providerId: userAlin.id,
        title: '小程序UI设计',
        category: ServiceCategory.DESIGN,
        description: '微信小程序/支付宝小程序完整UI设计，含首页、列表页、详情页、个人中心等核心页面。交付Figma源文件+切图资源。',
        price: { type: 'range', min: 3000, max: 8000, currency: 'CNY' },
        tags: ['小程序', 'UI设计', 'Figma', '移动端'],
        deliveryTime: '5-7天',
        viewCount: 67,
        orderCount: 8,
        rating: 4.9,
        reviewCount: 8,
        status: 'PUBLISHED',
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-3' },
      update: {},
      create: {
        id: 'service-3',
        providerId: userLaoli.id,
        title: 'AI应用全栈开发',
        category: ServiceCategory.AI_DEVELOPMENT,
        description: '基于OpenAI/Claude API的智能应用开发，包含前端React界面、后端Node.js服务、数据库设计、API集成。可交付聊天机器人、内容生成工具、智能客服等。',
        price: { type: 'range', min: 15000, max: 50000, currency: 'CNY' },
        tags: ['AI开发', 'React', 'Node.js', 'OpenAI', '全栈'],
        deliveryTime: '15-30天',
        viewCount: 134,
        orderCount: 5,
        rating: 5.0,
        reviewCount: 5,
        status: 'PUBLISHED',
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-4' },
      update: {},
      create: {
        id: 'service-4',
        providerId: userLaoli.id,
        title: '企业官网快速搭建',
        category: ServiceCategory.AI_DEVELOPMENT,
        description: '使用Next.js + Tailwind CSS搭建响应式企业官网，支持SEO优化、CMS内容管理、联系表单。3天交付上线。',
        price: { type: 'fixed', fixed: 3800, currency: 'CNY' },
        tags: ['官网', 'Next.js', 'SEO', '快速交付'],
        deliveryTime: '3-5天',
        viewCount: 201,
        orderCount: 18,
        rating: 4.7,
        reviewCount: 18,
        status: 'PUBLISHED',
      },
    }),
  ]);
  console.log(`✅ Created ${services.length} services`);

  // ==================== 技能市场 - 需求 ====================
  const demands = await Promise.all([
    prisma.demand.upsert({
      where: { id: 'demand-1' },
      update: {},
      create: {
        id: 'demand-1',
        requesterId: userWang.id,
        title: '求一个AIGC短视频脚本生成工具',
        description: '需要一个Web工具，输入产品信息自动生成抖音/小红书风格的短视频脚本。需要接入大模型API，前端要简洁易用。预算有限，希望找个人开发者合作。',
        category: ServiceCategory.AI_DEVELOPMENT,
        budget: { type: 'range', min: 5000, max: 12000 },
        deadline: new Date('2025-05-30'),
        status: 'OPEN',
      },
    }),
    prisma.demand.upsert({
      where: { id: 'demand-2' },
      update: {},
      create: {
        id: 'demand-2',
        requesterId: userWang.id,
        title: '创业初期品牌Logo设计',
        description: 'OPC创业，需要一个简洁现代的Logo，体现AI+创新的感觉。希望设计师能理解科技创业品牌的调性。',
        category: ServiceCategory.DESIGN,
        budget: { type: 'range', min: 2000, max: 5000 },
        deadline: new Date('2025-05-15'),
        status: 'OPEN',
      },
    }),
    prisma.demand.upsert({
      where: { id: 'demand-3' },
      update: {},
      create: {
        id: 'demand-3',
        requesterId: userTeacher.id,
        title: '寻找小红书运营合伙人',
        description: '我有一个创业培训课程，需要找一位懂小红书运营的同学合作，负责内容策划和账号运营。可以分成合作。',
        category: ServiceCategory.MARKETING,
        budget: { type: 'fixed', fixed: 0 },
        deadline: new Date('2025-06-01'),
        status: 'OPEN',
      },
    }),
  ]);
  console.log(`✅ Created ${demands.length} demands`);

  // ==================== 社区帖子 ====================
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { id: 'post-1' },
      update: {},
      create: {
        id: 'post-1',
        authorId: userWang.id,
        title: '刚入驻模速空间，分享申请经验',
        content: `上周刚通过审核入驻模速空间，来分享一下申请经验：

1. 项目计划书不需要很长，但要讲清楚技术路线和商业模式
2. 有Demo的话通过率会高很多
3. 审核周期实际用了7个工作日，比官方说的10天快
4. 入驻后算力补贴是直接打到账户的，很方便

欢迎大家交流，有问题可以问我！`,
        board: Board.EXPERIENCE,
        tags: ['模速空间', '入驻经验', '算力补贴'],
        viewCount: 234,
        commentCount: 12,
        likeCount: 45,
        status: 'PUBLISHED',
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-2' },
      update: {},
      create: {
        id: 'post-2',
        authorId: userAlin.id,
        title: '自由设计师转型OPC的经验分享',
        content: `从大公司辞职做自由设计师已经2年了，分享一些心得：

**收入变化**
- 第一年：月收入不稳定，3k-15k波动
- 第二年：建立了稳定的客户群，月均20k+

**关键转折**
1. 专注一个细分领域（我选了SaaS产品UI设计）
2. 建立作品集网站
3. 加入设计师社群获取 referrals

**给新手的建议**
不要什么单都接，越聚焦越值钱。`,
        board: Board.EXPERIENCE,
        tags: ['OPC', '自由职业', '设计', '转型'],
        viewCount: 567,
        commentCount: 34,
        likeCount: 128,
        status: 'PUBLISHED',
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-3' },
      update: {},
      create: {
        id: 'post-3',
        authorId: userLaoli.id,
        title: '推荐几个创业者必备的AI工具',
        content: `整理了我日常在用的AI工具，都是免费或低成本的：

**内容创作**
- Claude：写文案、写邮件、整理思路
- Midjourney：做配图、Logo概念稿
- ElevenLabs：语音合成

**开发提效**
- Cursor：AI编程IDE，写代码快3倍
- Vercel v0：AI生成UI组件
- Supabase：免费数据库+Auth

**运营辅助**
- Notion AI：知识管理
- Gamma：AI生成PPT

大家还有什么推荐？`,
        board: Board.TOOLS,
        tags: ['AI工具', '效率', '推荐', '创业'],
        viewCount: 890,
        commentCount: 56,
        likeCount: 234,
        status: 'PUBLISHED',
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-4' },
      update: {},
      create: {
        id: 'post-4',
        authorId: userAdmin.id,
        title: '龙华街道创业沙龙第12期报名开启',
        content: `本期主题：《AI时代一人公司的商业模式设计》

**时间**：4月26日（周六）14:00-17:00
**地点**：龙华会共享空间 3F
**嘉宾**：张导师（前独角兽运营总监）
**名额**：30人

本期会重点讨论：
1. AI如何降低创业门槛
2. OPC常见收入模式
3. 从0到1的获客策略

报名截止4月25日，请点击报名。`,
        board: Board.POLICY,
        tags: ['活动', '创业沙龙', '龙华', '报名'],
        viewCount: 123,
        commentCount: 8,
        likeCount: 23,
        isPinned: true,
        status: 'PUBLISHED',
      },
    }),
  ]);
  console.log(`✅ Created ${posts.length} posts`);

  // ==================== 评论 ====================
  const comments = await Promise.all([
    prisma.comment.upsert({
      where: { id: 'comment-1' },
      update: {},
      create: {
        id: 'comment-1',
        postId: 'post-1',
        authorId: userLaoli.id,
        content: '恭喜入驻！请问你们主要做什么方向的？我也在考虑申请。',
        likeCount: 3,
      },
    }),
    prisma.comment.upsert({
      where: { id: 'comment-2' },
      update: {},
      create: {
        id: 'comment-2',
        postId: 'post-1',
        authorId: userWang.id,
        content: '@全栈老李 我们做AIGC内容生成工具，欢迎来交流！',
        likeCount: 2,
      },
    }),
    prisma.comment.upsert({
      where: { id: 'comment-3' },
      update: {},
      create: {
        id: 'comment-3',
        postId: 'post-2',
        authorId: userTeacher.id,
        content: '写得太好了！专注确实是自由职业者最重要的策略。我在辅导的创业者中，也是那些聚焦细分领域的成功率最高。',
        likeCount: 8,
      },
    }),
  ]);
  console.log(`✅ Created ${comments.length} comments`);

  // ==================== 导师 ====================
  const mentors = await Promise.all([
    prisma.mentor.upsert({
      where: { id: 'mentor-1' },
      update: {},
      create: {
        id: 'mentor-1',
        userId: userTeacher.id,
        name: '创业导师张老师',
        avatar: userTeacher.avatar,
        title: '前独角兽运营总监 / 连续创业者',
        bio: '10年互联网运营经验，曾任某独角兽公司运营总监，后连续创业3次。现专注于辅导早期创业者，擅长商业模式设计、增长策略和团队搭建。已辅导超过50个创业团队。',
        expertise: ['商业模式', '增长策略', '团队管理', '融资对接'],
        services: [
          { title: '1v1创业咨询', price: 800, description: '60分钟深度咨询，梳理商业模式和增长策略' },
          { title: '商业计划书辅导', price: 3000, description: '协助完成投资人版本BP，含3轮修改' },
          { title: '月度陪跑', price: 5000, description: '每月4次咨询+日常微信答疑' },
        ],
        consultCount: 156,
        rating: 4.9,
        reviewCount: 45,
        status: 'APPROVED',
      },
    }),
    prisma.mentor.upsert({
      where: { id: 'mentor-2' },
      update: {},
      create: {
        id: 'mentor-2',
        userId: userLaoli.id,
        name: '全栈老李',
        avatar: userLaoli.avatar,
        title: '资深全栈工程师 / 技术顾问',
        bio: '8年全栈开发经验，服务过30+创业团队。擅长技术选型、MVP快速开发、技术团队搭建。帮助非技术背景的创业者把想法变成产品。',
        expertise: ['技术选型', 'MVP开发', '团队搭建', 'AI应用'],
        services: [
          { title: '技术咨询', price: 500, description: '技术方案评估和选型建议' },
          { title: 'MVP开发', price: 15000, description: '2-4周交付可用产品' },
          { title: '代码审查', price: 2000, description: '全面代码审查+优化建议' },
        ],
        consultCount: 89,
        rating: 4.8,
        reviewCount: 28,
        status: 'APPROVED',
      },
    }),
  ]);
  console.log(`✅ Created ${mentors.length} mentors`);

  // ==================== 课程 ====================
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'course-1' },
      update: {},
      create: {
        id: 'course-1',
        title: 'ChatGPT应用开发实战',
        description: '从0到1掌握OpenAI API接入，构建你的第一个AI应用。包含Prompt Engineering、Function Calling、RAG基础等核心技能。',
        category: CourseCategory.AI_TOOLS,
        tags: ['ChatGPT', 'OpenAI', 'API', '开发'],
        coverImage: 'https://picsum.photos/600/340?random=10',
        instructorId: userLaoli.id,
        instructorName: '全栈老李',
        instructorAvatar: userLaoli.avatar,
        duration: '12课时',
        price: 299,
        studentCount: 234,
        rating: 4.8,
        reviewCount: 56,
        status: 'PUBLISHED',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-2' },
      update: {},
      create: {
        id: 'course-2',
        title: '一人公司商业模式设计',
        description: '学习如何设计可持续盈利的OPC商业模式。包含定价策略、获客渠道、产品设计、收入增长等模块。',
        category: CourseCategory.BUSINESS_MODEL,
        tags: ['OPC', '商业模式', '定价', '增长'],
        coverImage: 'https://picsum.photos/600/340?random=11',
        instructorId: userTeacher.id,
        instructorName: '创业导师张老师',
        instructorAvatar: userTeacher.avatar,
        duration: '8课时',
        price: 199,
        studentCount: 456,
        rating: 4.9,
        reviewCount: 112,
        status: 'PUBLISHED',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-3' },
      update: {},
      create: {
        id: 'course-3',
        title: 'AI时代的个人品牌打造',
        description: '如何在社交媒体建立专业形象，吸引客户。包含内容策略、平台选择、私域运营等实战技巧。',
        category: CourseCategory.PERSONAL_BRAND,
        tags: ['个人品牌', '社交媒体', '内容', '获客'],
        coverImage: 'https://picsum.photos/600/340?random=12',
        instructorId: userAlin.id,
        instructorName: '设计师阿琳',
        instructorAvatar: userAlin.avatar,
        duration: '6课时',
        price: 99,
        studentCount: 678,
        rating: 4.7,
        reviewCount: 89,
        status: 'PUBLISHED',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-4' },
      update: {},
      create: {
        id: 'course-4',
        title: '创业者法律与财税必修课',
        description: 'OPC和初创企业必须了解的法律和财税知识。包含公司注册、股权设计、税务筹划、合同审查等。',
        category: CourseCategory.LEGAL_FINANCE,
        tags: ['法律', '财税', '股权', '合规'],
        coverImage: 'https://picsum.photos/600/340?random=13',
        instructorId: userTeacher.id,
        instructorName: '创业导师张老师',
        instructorAvatar: userTeacher.avatar,
        duration: '10课时',
        price: 399,
        studentCount: 123,
        rating: 4.6,
        reviewCount: 23,
        status: 'PUBLISHED',
      },
    }),
  ]);
  console.log(`✅ Created ${courses.length} courses`);

  // ==================== 交易 ====================
  const transactions = await Promise.all([
    prisma.transaction.upsert({
      where: { id: 'txn-1' },
      update: {},
      create: {
        id: 'txn-1',
        orderNo: 'ORD202504010001',
        buyerId: userWang.id,
        sellerId: userAlin.id,
        type: 'SERVICE',
        serviceId: 'service-2',
        title: '小程序UI设计',
        price: 5000,
        currency: 'CNY',
        status: TransactionStatus.COMPLETED,
        buyerReview: { rating: 5, content: '设计非常专业，沟通顺畅，强烈推荐！', createdAt: new Date('2025-04-10') },
        completedAt: new Date('2025-04-10'),
      },
    }),
    prisma.transaction.upsert({
      where: { id: 'txn-2' },
      update: {},
      create: {
        id: 'txn-2',
        orderNo: 'ORD202504050002',
        buyerId: userWang.id,
        sellerId: userLaoli.id,
        type: 'SERVICE',
        serviceId: 'service-4',
        title: '企业官网快速搭建',
        price: 3800,
        currency: 'CNY',
        status: TransactionStatus.IN_PROGRESS,
      },
    }),
  ]);
  console.log(`✅ Created ${transactions.length} transactions`);

  console.log('\n✨ Seeding completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Policies: ${policies.length}`);
  console.log(`   Services: ${services.length}`);
  console.log(`   Demands: ${demands.length}`);
  console.log(`   Posts: ${posts.length}`);
  console.log(`   Comments: ${comments.length}`);
  console.log(`   Mentors: ${mentors.length}`);
  console.log(`   Courses: ${courses.length}`);
  console.log(`   Transactions: ${transactions.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
