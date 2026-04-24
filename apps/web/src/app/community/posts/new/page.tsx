'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

const boards = [
  { value: 'POLICY', label: '政策解读' },
  { value: 'TOOLS', label: 'AI工具' },
  { value: 'EXPERIENCE', label: '经验分享' },
  { value: 'SHOWCASE', label: '项目展示' },
  { value: 'HELP', label: '求助问答' },
  { value: 'RESOURCES', label: '资源分享' },
]

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [board, setBoard] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/community/posts', data)
      return res.data
    },
    onSuccess: () => {
      alert('帖子发布成功！')
      router.push('/community')
    },
    onError: (err: any) => {
      if (err.response?.status === 401) {
        alert('请先登录')
        router.push('/login')
      } else {
        alert(err.response?.data?.message || '发布失败')
      }
    },
  })

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !board || !content) {
      alert('请填写完整信息')
      return
    }
    createMutation.mutate({
      title,
      board,
      content,
      tags,
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <Link href="/community">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>发布帖子</CardTitle>
            <p className="text-sm text-gray-500">分享你的经验、提问或展示项目</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  帖子标题 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="例如：刚入驻模速空间，分享申请经验"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选择板块 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {boards.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setBoard(b.value)}
                      className={`rounded-full px-4 py-1.5 text-sm ${
                        board === b.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px]"
                  placeholder="写下你想分享的内容..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="添加标签，按回车确认"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                发布帖子
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
