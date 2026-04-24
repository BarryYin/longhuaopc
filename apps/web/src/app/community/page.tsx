'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, ThumbsUp, Eye, Loader2, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

const boards = [
  { value: '', label: '全部' },
  { value: 'POLICY', label: '政策解读' },
  { value: 'TOOLS', label: 'AI工具' },
  { value: 'EXPERIENCE', label: '经验分享' },
  { value: 'SHOWCASE', label: '项目展示' },
  { value: 'HELP', label: '求助问答' },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('hot')
  const [board, setBoard] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['posts', activeTab, board],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('sort', activeTab)
      if (board) params.append('board', board)
      const res = await api.get(`/community/posts?${params}`)
      return res.data
    },
  })

  const posts = data?.data || []

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-primary-600 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            创业者社区
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            与万名OPC创业者交流，分享经验、求助答疑
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Link href="/community/posts/new">
              <Button className="w-full gap-2 mb-6">
                <Plus className="h-4 w-4" />
                发布帖子
              </Button>
            </Link>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">板块</h3>
                <div className="space-y-1">
                  {boards.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setBoard(b.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        board === b.value
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="hot">热门</TabsTrigger>
                <TabsTrigger value="new">最新</TabsTrigger>
                <TabsTrigger value="top">精华</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <Link key={post.id} href={`/community/posts/${post.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                                {post.author?.nickname?.[0] || '?'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    {post.author?.nickname}
                                  </span>
                                  <Badge variant="secondary">Lv.{post.author?.level}</Badge>
                                  <span className="text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </span>
                                </div>

                                <h3 className="mt-2 text-lg font-semibold text-gray-900 hover:text-primary-600">
                                  {post.title}
                                </h3>
                                <p className="mt-1 text-gray-600 line-clamp-2">
                                  {post.content}
                                </p>

                                <div className="mt-3 flex items-center gap-4">
                                  <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <Eye className="h-4 w-4" />
                                    {post.viewCount}
                                  </span>
                                  <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <MessageSquare className="h-4 w-4" />
                                    {post.commentCount}
                                  </span>
                                  <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <ThumbsUp className="h-4 w-4" />
                                    {post.likeCount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
