'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, FileText, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

const categories = [
  { value: '', label: '全部' },
  { value: 'TAX', label: '税收优惠' },
  { value: 'SPACE', label: '场地支持' },
  { value: 'COMPUTING', label: '算力补贴' },
  { value: 'FUND', label: '创业资金' },
  { value: 'TALENT', label: '人才政策' },
]

export default function PoliciesPage() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['policies', keyword, category],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (keyword) params.append('keyword', keyword)
      if (category) params.append('category', category)
      const res = await api.get(`/policies?${params}`)
      return res.data
    },
  })

  const policies = data?.data || []

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            龙华OPC政策中心
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            汇集徐汇区所有扶持政策，让创业者不再错过任何一个机会
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 h-12"
                placeholder="搜索政策关键词..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button size="lg">搜索</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="font-semibold">政策分类</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.value
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Match Card */}
            <Card className="mt-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold">🤖 AI政策助手</h3>
                <p className="mt-2 text-sm text-primary-100">
                  告诉我你的创业情况，为你推荐最适合的政策
                </p>
                <Link href="/policies/match">
                  <Button variant="secondary" className="mt-4 w-full">
                    智能匹配
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Policy List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {policies.map((policy: any) => (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {categories.find(c => c.value === policy.category)?.label || policy.category}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {policy.viewCount} 次浏览
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-gray-900">
                            {policy.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {policy.summary}
                          </p>
                          <div className="mt-3 flex gap-2">
                            {policy.tags?.map((tag: string) => (
                              <Badge key={tag} variant="outline">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-4">
                            <Link href={`/policies/${policy.id}`}>
                              <Button variant="outline" size="sm">
                                查看详情
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
