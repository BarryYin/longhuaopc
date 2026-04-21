'use client'

import { useQuery } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Users, Star, Clock, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function AcademyPage() {
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await api.get('/training/courses')
      return res.data
    },
  })

  const { data: mentorsData, isLoading: mentorsLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const res = await api.get('/training/mentors')
      return res.data
    },
  })

  const courses = coursesData?.data || []
  const mentors = mentorsData?.data || []

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-primary-600 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            成长学院
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            AI工具、商业模式、个人品牌等实战课程，助你成为超级个体
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">
              <BookOpen className="mr-2 h-4 w-4" />
              课程
            </TabsTrigger>
            <TabsTrigger value="mentors">
              <Users className="mr-2 h-4 w-4" />
              导师
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            {coursesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: any) => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary-400" />
                      </div>

                      <div className="mt-4">
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                          {course.instructorName?.[0]}
                        </div>
                        <span className="text-sm text-gray-700">
                          {course.instructorName}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.studentCount}人学习
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                          ¥{course.price}
                        </span>
                        <Button>立即报名</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mentors">
            {mentorsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor: any) => (
                  <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
                        {mentor.name?.[0]}
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-gray-500">{mentor.title}</p>

                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {mentor.bio}
                      </p>

                      <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {mentor.expertise?.slice(0, 3).map((exp: string) => (
                          <Badge key={exp} variant="outline">
                            {exp}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {mentor.rating || '暂无'}
                        </span>
                        <span>{mentor.consultCount}次咨询</span>
                      </div>

                      <Button className="mt-4 w-full">预约咨询</Button>
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
