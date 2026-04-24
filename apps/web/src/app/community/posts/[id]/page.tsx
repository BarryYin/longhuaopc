'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function PostDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`/community/posts/${id}`)
      return res.data
    },
  })

  const post = data

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

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-gray-500">帖子不存在</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <Link href="/community">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                {post.author?.nickname?.[0] || '?'}
              </div>
              <div>
                <span className="font-medium text-gray-900">{post.author?.nickname}</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant="secondary">Lv.{post.author?.level}</Badge>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">{post.title}</h1>

            <div className="mt-4 flex gap-2">
              {post.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">#{tag}</Badge>
              ))}
            </div>

            <div className="mt-6 whitespace-pre-line text-gray-700 leading-relaxed">
              {post.content}
            </div>

            <div className="mt-8 flex items-center gap-6 border-t pt-6">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                {post.viewCount} 浏览
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                {post.commentCount} 评论
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <ThumbsUp className="h-4 w-4" />
                {post.likeCount} 点赞
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        {post.comments && post.comments.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">评论 ({post.comments.length})</h3>
            {post.comments.map((comment: any) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {comment.author?.nickname?.[0] || '?'}
                    </div>
                    <span className="text-sm font-medium">{comment.author?.nickname}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
