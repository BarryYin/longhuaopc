'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Heart, ExternalLink, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function PolicyDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      const res = await api.get(`/policies/${id}`)
      return res.data
    },
  })

  const policy = data

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

  if (!policy) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-gray-500">政策不存在</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Link href="/policies">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-2">
              <Badge>{policy.category}</Badge>
              <span className="text-sm text-gray-500">
                {policy.viewCount} 次浏览
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              {policy.title}
            </h1>

            <p className="mt-4 text-lg text-gray-600">{policy.summary}</p>

            {/* Policy Overview */}
            <div className="mt-8 rounded-lg bg-gray-50 p-6">
              <h2 className="text-lg font-semibold">📊 政策概览</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-gray-500">支持额度</span>
                  <p className="text-lg font-semibold text-primary-600">
                    {policy.amount?.description || '详见内容'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">适用对象</span>
                  <p className="text-gray-900">{policy.targetAudience || '详见内容'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">有效期</span>
                  <p className="text-gray-900">
                    {new Date(policy.validFrom).toLocaleDateString()} -
                    {policy.validTo
                      ? new Date(policy.validTo).toLocaleDateString()
                      : '长期'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">来源</span>
                  <p className="text-gray-900">{policy.source}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-8 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: policy.content }} />
            </div>

            {/* Tags */}
            <div className="mt-8 flex gap-2">
              {policy.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                收藏
              </Button>
              {policy.officialUrl && (
                <Link href={policy.officialUrl} target="_blank">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    查看官方原文
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
