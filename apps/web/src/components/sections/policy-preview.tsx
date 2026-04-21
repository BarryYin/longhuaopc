'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Building2, Cpu, Wallet, LucideIcon } from 'lucide-react'

interface Policy {
  title: string
  amount: string
  tag: string
  icon: LucideIcon
  color: string
}

const policies: Policy[] = [
  {
    title: '漕河泾开发区算力补贴',
    amount: '最高30万元',
    tag: '算力补贴',
    icon: Cpu,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: '龙华超级个体288行动',
    amount: '3年零租金',
    tag: '场地支持',
    icon: Building2,
    color: 'text-green-600 bg-green-50',
  },
  {
    title: '徐汇区税收优惠',
    amount: '企业所得税5%',
    tag: '税收优惠',
    icon: Wallet,
    color: 'text-orange-600 bg-orange-50',
  },
]

export function PolicyPreview() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              热门政策
            </h2>
            <p className="mt-2 text-gray-600">龙华OPC创业者专属扶持政策</p>
          </div>
          <Link href="/policies">
            <Button variant="outline" className="gap-2">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {policies.map((policy) => {
            const IconComponent = policy.icon
            return (
              <div
                key={policy.title}
                className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`inline-flex rounded-lg p-3 ${policy.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {policy.tag}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  {policy.title}
                </h3>
                <p className="mt-2 text-2xl font-bold text-primary-600">
                  {policy.amount}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-16 rounded-2xl bg-primary-600 px-8 py-12 text-center">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-white">1600万+</div>
              <div className="mt-1 text-primary-100">全国一人公司</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">47%</div>
              <div className="mt-1 text-primary-100">年增长率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">30万</div>
              <div className="mt-1 text-primary-100">算力补贴</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">3年</div>
              <div className="mt-1 text-primary-100">零租金办公</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
