'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function ServiceDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await api.get(`/skills/services/${id}`)
      return res.data
    },
  })

  const service = data

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

  if (!service) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-gray-500">服务不存在</p>
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
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                {service.provider?.nickname?.[0] || '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{service.provider?.nickname}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating || '暂无评分'}</span>
                  <span>({service.reviewCount} 评价)</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Badge>{service.category}</Badge>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">{service.title}</h1>
              <p className="mt-4 text-gray-600 whitespace-pre-line">{service.description}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {service.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <div className="mt-8 rounded-lg bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">价格</p>
                  <p className="text-3xl font-bold text-primary-600">
                    ¥{service.price?.fixed || service.price?.min || '面议'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">交付周期</p>
                  <p className="text-lg font-medium">{service.deliveryTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">浏览量</p>
                  <p className="text-lg font-medium">{service.viewCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" className="w-full" onClick={() => alert('下单功能开发中')}>
                立即咨询
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
