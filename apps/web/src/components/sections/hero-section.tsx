'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5">
            <Sparkles className="mr-2 h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              AI时代，让创业更简单
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            让AI为你的创业
            <span className="text-primary-600">加速</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            政策查询 · 技能交易 · 社区成长 · AI Agent接入
            <br />
            专为AI时代独立创业者打造的一站式服务平台
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/policies">
              <Button size="lg" className="gap-2">
                开始探索
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/developers">
              <Button variant="outline" size="lg" className="gap-2">
                <Bot className="h-4 w-4" />
                AI Agent接入
              </Button>
            </Link>
          </div>

          {/* AI Example */}
          <div className="mx-auto mt-16 max-w-3xl rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Bot className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">试试对AI说：</p>
                <p className="text-gray-900">
                  "我在徐汇龙华做AI应用创业，能申请什么政策？"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
