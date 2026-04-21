'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Star, MapPin, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

const categories = [
  { value: '', label: '全部' },
  { value: 'AI_DEVELOPMENT', label: 'AI开发' },
  { value: 'DESIGN', label: '设计' },
  { value: 'COPYWRITING', label: '文案' },
  { value: 'CONSULTING', label: '咨询' },
]

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('services')
  const [category, setCategory] = useState('')

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', category],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      const res = await api.get(`/skills/services?${params}`)
      return res.data
    },
  })

  const { data: demandsData, isLoading: demandsLoading } = useQuery({
    queryKey: ['demands', category],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      const res = await api.get(`/skills/demands?${params}`)
      return res.data
    },
  })

  const services = servicesData?.data || []
  const demands = demandsData?.data || []

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-primary-600 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            能力市场
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            发布技能接单赚钱，或发布需求找专家
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="services">找服务</TabsTrigger>
              <TabsTrigger value="demands">找活干</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Link href="/market/services/new">
                <Button>发布服务</Button>
              </Link>
              <Link href="/market/demands/new">
                <Button variant="outline">发布需求</Button>
              </Link>
            </div>
          </div>

          {/* Filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`rounded-full px-4 py-1.5 text-sm ${
                  category === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <TabsContent value="services" className="mt-6">
            {servicesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service: any) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-600">
                          {service.provider?.nickname?.[0] || '?'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.provider?.nickname}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating || '暂无评分'}</span>
                            <span>({service.reviewCount} 评价)</span>
                          </div>
                        </div>
                      </div>

                      <h4 className="mt-4 font-semibold text-gray-900">
                        {service.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {service.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">
                            ¥{service.price?.fixed || service.price?.min || '面议'}
                          </span>
                          <span className="text-sm text-gray-500">起</span>
                        </div>
                        <Link href={`/market/services/${service.id}`}>
                          <Button size="sm">立即咨询</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="demands" className="mt-6">
            {demandsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {demands.map((demand: any) => (
                  <Card key={demand.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge>{demand.category}</Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(demand.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-gray-900">
                            {demand.title}
                          </h3>
                          <p className="mt-1 text-gray-600">{demand.description}</p>

                          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              预算：¥{demand.budget?.min || 0} - ¥
                              {demand.budget?.max || '不限'}
                            </span>
                            {demand.deadline && (
                              <span>
                                期望交付：
                                {new Date(demand.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link href={`/market/demands/${demand.id}`}>
                          <Button>查看详情</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  )
}
