'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Briefcase, Calendar, User } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function DemandDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['demand', id],
    queryFn: async () => {
      const res = await api.get(`/skills/demands/${id}`)
      return res.data
    },
  })

  const demand = data

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!demand) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-gray-500">需求不存在</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Link href="/market">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回市场
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{demand.category}</Badge>
              <span className="text-sm text-gray-500">
                {new Date(demand.createdAt).toLocaleDateString()} 发布
              </span>
            </div>
            <CardTitle className="text-2xl mt-2">{demand.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">需求描述</h3>
              <p className="text-gray-600 whitespace-pre-line">{demand.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Briefcase className="h-4 w-4" />
                  预算范围
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  ¥{demand.budget?.min || 0} - ¥{demand.budget?.max || '不限'}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  期望交付
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {demand.deadline
                    ? new Date(demand.deadline).toLocaleDateString()
                    : '待定'}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <User className="h-4 w-4" />
                  发布者
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {demand.publisher?.nickname || '匿名用户'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => alert('接单功能开发中')}>立即接单</Button>
              <Button variant="outline" onClick={() => alert('私信功能开发中')}>
                私信沟通
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
