'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Users, Star, Clock, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function CourseDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/training/courses/${id}`)
      return res.data
    },
  })

  const course = data

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

  if (!course) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-gray-500">课程不存在</p>
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
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <BookOpen className="h-16 w-16 text-primary-400" />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{course.category}</Badge>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-4 text-lg text-gray-600">{course.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                {course.instructorName?.[0]}
              </div>
              <div>
                <p className="font-medium">{course.instructorName}</p>
                <p className="text-sm text-gray-500">讲师</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-6">
              <div className="text-center">
                <Clock className="mx-auto h-5 w-5 text-primary-600" />
                <p className="mt-2 text-sm text-gray-500">时长</p>
                <p className="font-semibold">{course.duration}</p>
              </div>
              <div className="text-center">
                <Users className="mx-auto h-5 w-5 text-primary-600" />
                <p className="mt-2 text-sm text-gray-500">学员</p>
                <p className="font-semibold">{course.studentCount}人</p>
              </div>
              <div className="text-center">
                <Star className="mx-auto h-5 w-5 text-primary-600" />
                <p className="mt-2 text-sm text-gray-500">评分</p>
                <p className="font-semibold">{course.rating || '暂无'}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">价格</p>
                <p className="text-3xl font-bold text-primary-600">¥{course.price}</p>
              </div>
              <Button size="lg" onClick={() => alert('报名功能开发中')}>
                立即报名
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
