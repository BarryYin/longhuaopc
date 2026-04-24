'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Loader2, MessageCircle } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function MentorDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['mentor', id],
    queryFn: async () => {
      const res = await api.get(`/training/mentors/${id}`)
      return res.data
    },
  })

  const mentor = data

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

  if (!mentor) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-gray-500">导师不存在</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Link href="/academy">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回学院
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-600">
                {mentor.name?.[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                <p className="text-gray-500">{mentor.title}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {mentor.expertise?.map((exp: string) => (
                    <Badge key={exp} variant="outline">{exp}</Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {mentor.rating || '暂无'} 评分
                  </span>
                  <span>{mentor.consultCount} 次咨询</span>
                  <span>{mentor.reviewCount} 条评价</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">导师简介</h3>
              <p className="text-gray-600 whitespace-pre-line">{mentor.bio}</p>
            </div>

            {mentor.services && mentor.services.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">咨询服务</h3>
                <div className="space-y-3">
                  {mentor.services.map((svc: any, idx: number) => (
                    <Card key={idx}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{svc.title}</h4>
                          <p className="text-sm text-gray-500">{svc.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary-600">¥{svc.price}</p>
                          <Button size="sm" className="mt-1" onClick={() => alert('预约功能开发中')}>
                            <MessageCircle className="mr-1 h-3 w-3" />
                            预约
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
