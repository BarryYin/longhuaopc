import { PrismaClient, PolicyCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 创建示例政策 — 基于徐汇区/龙华街道真实政策方向
  const policies = [
    {
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
      status: 'PUBLISHED' as const,
    },
    {
      title: '龙华街道文化创意与数字经济产业扶持政策',
      summary: '依托龙华历史文化风貌区和西岸艺术区，扶持文化科技融合创业项目',
      content: `## 政策概述
龙华街道地处徐汇区南部，拥有龙华古寺、龙华烈士陵园等文化地标，毗邻西岸艺术区。街道设立专项扶持资金，鼓励文化科技融合创业。

## 核心福利
- 创业补贴：首次注册OPC/个体工商户，一次性补贴5000元
- 场地支持：龙华会商圈联合办公空间，首月免租
- 活动支持：免费参加龙华创业沙龙（每月一期）
- 品牌推广：优秀项目获龙华街道官方公众号推荐

## 申请条件
1. 在龙华街道注册或实际经营
2. 从事文化创意、数字内容、AIGC等领域
3. 成立时间不超过2年

## 申请流程
1. 向龙华街道营商服务中心提交申请
2. 提供营业执照及创业计划
3. 街道审核（约5个工作日）`,
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
      status: 'PUBLISHED' as const,
    },
    {
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

优惠：按5%税率缴纳企业所得税

## 申请方式
自动享受，无需申请。在纳税申报时按规定填报。`,
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
      status: 'PUBLISHED' as const,
    },
    {
      title: '徐汇区创业担保贷款',
      summary: '最高300万元创业担保贷款，财政贴息',
      content: `## 贷款额度
- 个人创业：最高50万元
- 合伙企业：最高300万元

## 贷款期限
最长3年

## 贴息政策
财政给予部分贴息，实际利率约2%

## 申请条件
1. 在徐汇区注册创业组织
2. 申请人年龄在18-45周岁
3. 有明确的创业项目和还款来源
4. 信用记录良好

## 申请流程
1. 向徐汇区就业促进中心提交申请
2. 银行审核
3. 签订贷款合同
4. 发放贷款`,
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
      status: 'PUBLISHED' as const,
    },
  ];

  for (const policy of policies) {
    await prisma.policy.upsert({
      where: { id: policy.title },
      update: {},
      create: policy as any,
    });
  }

  console.log(`✅ Created ${policies.length} policies`);

  // 创建示例课程
  const courses = [
    {
      title: 'ChatGPT应用开发实战',
      description: '从0到1掌握OpenAI API接入，构建你的第一个AI应用',
      category: 'AI_TOOLS',
      instructorId: 'instructor-1',
      instructorName: '张师傅',
      duration: '12课时',
      price: 299,
      status: 'PUBLISHED',
    },
    {
      title: '一人公司商业模式设计',
      description: '学习如何设计可持续盈利的OPC商业模式',
      category: 'BUSINESS_MODEL',
      instructorId: 'instructor-2',
      instructorName: '李导师',
      duration: '8课时',
      price: 199,
      status: 'PUBLISHED',
    },
    {
      title: 'AI时代的个人品牌打造',
      description: '如何在社交媒体建立专业形象，吸引客户',
      category: 'PERSONAL_BRAND',
      instructorId: 'instructor-3',
      instructorName: '王大咖',
      duration: '6课时',
      price: 99,
      status: 'PUBLISHED',
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.title },
      update: {},
      create: course as any,
    });
  }

  console.log(`✅ Created ${courses.length} courses`);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
