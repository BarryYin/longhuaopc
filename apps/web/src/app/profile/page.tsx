'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Settings, Briefcase, ShoppingBag, FileText, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) setUser(JSON.parse(userStr))
    } catch {}
  }, [])

  const { data: myServices } = useQuery({
    queryKey: ['my-services'],
    queryFn: async () => {
      const res = await api.get('/skills/services/my')
      return res.data?.data || []
    },
    enabled: !!user,
  })

  const { data: myDemands } = useQuery({
    queryKey: ['my-demands'],
    queryFn: async () => {
      const res = await api.get('/skills/demands/my')
      return res.data?.data || []
    },
    enabled: !!user,
  })

  const { data: myPosts } = useQuery({
    queryKey: ['my-posts'],
    queryFn: async () => {
      const res = await api.get('/community/posts/my')
      return res.data?.data || []
    },
    enabled: !!user,
  })

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <User className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">请先登录</p>
          <Link href="/login">
            <Button className="mt-4">去登录</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-600">
                {user.nickname?.[0] || <User className="h-10 w-10" />}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.nickname || '未设置昵称'}
                </h1>
                <p className="text-gray-500 mt-1">{user.phone || ''}</p>
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="secondary">独立创业者</Badge>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                编辑资料
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="services">
          <TabsList className="mb-6">
            <TabsTrigger value="services">
              <Briefcase className="mr-2 h-4 w-4" />
              我的服务
            </TabsTrigger>
            <TabsTrigger value="demands">
              <ShoppingBag className="mr-2 h-4 w-4" />
              我的需求
            </TabsTrigger>
            <TabsTrigger value="posts">
              <FileText className="mr-2 h-4 w-4" />
              我的帖子
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">已发布的服务</h2>
              <Link href="/market/services/new">
                <Button size="sm">发布新服务</Button>
              </Link>
            </div>
            {myServices && myServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {myServices.map((svc: any) => (
                  <Card key={svc.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{svc.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{svc.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge>{svc.category}</Badge>
                        <span className="text-primary-600 font-semibold">
                          ¥{svc.price?.fixed || svc.price?.min}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">暂无发布的服务</p>
                <Link href="/market/services/new">
                  <Button variant="outline" className="mt-4">去发布</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="demands">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">已发布的需求</h2>
              <Link href="/market/demands/new">
                <Button size="sm">发布新需求</Button>
              </Link>
            </div>
            {myDemands && myDemands.length > 0 ? (
              <div className="space-y-4">
                {myDemands.map((demand: any) => (
                  <Card key={demand.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{demand.title}</h3>
                      <p className="text-sm text-gray-600">{demand.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <Badge>{demand.category}</Badge>
                        <span>预算：¥{demand.budget?.min || 0} - ¥{demand.budget?.max || '不限'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">暂无发布的需求</p>
                <Link href="/market/demands/new">
                  <Button variant="outline" className="mt-4">去发布</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">已发布的帖子</h2>
              <Link href="/community/posts/new">
                <Button size="sm">发布新帖子</Button>
              </Link>
            </div>
            {myPosts && myPosts.length > 0 ? (
              <div className="space-y-4">
                {myPosts.map((post: any) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">{post.board}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">暂无发布的帖子</p>
                <Link href="/community/posts/new">
                  <Button variant="outline" className="mt-4">去发布</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  )
}
