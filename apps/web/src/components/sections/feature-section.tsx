'use client'

import { FileText, Briefcase, Users, GraduationCap, LucideIcon } from 'lucide-react'

interface Feature {
  name: string
  description: string
  icon: LucideIcon
  color: string
}

const features: Feature[] = [
  {
    name: 'AI政策引擎',
    description: '智能匹配龙华OPC扶持政策，AI助手可代劳查询，一键获取个性化政策报告。',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    name: '能力市场',
    description: '发布技能接单赚钱，或发布需求找专家。AI时代的新型人才交易平台。',
    icon: Briefcase,
    color: 'bg-green-500',
  },
  {
    name: '创业者社区',
    description: '与万名OPC创业者交流，分享经验、求助答疑、资源对接。',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    name: '成长学院',
    description: 'AI工具、商业模式、个人品牌等实战课程，助你成为超级个体。',
    icon: GraduationCap,
    color: 'bg-orange-500',
  },
]

export function FeatureSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            三大核心能力
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            从政策到交易，从学习到成长，全方位赋能独立创业者
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.name}
                className="relative rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex rounded-lg ${feature.color} p-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
