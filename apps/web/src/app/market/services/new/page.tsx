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

const categories = [
  { value: 'AI_DEVELOPMENT', label: 'AI开发' },
  { value: 'DESIGN', label: '设计' },
  { value: 'COPYWRITING', label: '文案' },
  { value: 'CONSULTING', label: '咨询' },
  { value: 'MARKETING', label: '营销' },
  { value: 'TRANSLATION', label: '翻译' },
  { value: 'OTHER', label: '其他' },
]

export default function NewServicePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/skills/services', data)
      return res.data
    },
    onSuccess: () => {
      alert('服务发布成功！')
      router.push('/market')
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
    if (!title || !category || !description || !price || !deliveryTime) {
      alert('请填写完整信息')
      return
    }
    createMutation.mutate({
      title,
      category,
      description,
      price: { type: 'fixed', fixed: Number(price), currency: 'CNY' },
      deliveryTime,
      tags,
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <Link href="/market">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回市场
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>发布服务</CardTitle>
            <p className="text-sm text-gray-500">展示你的技能，吸引客户</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  服务标题 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="例如：品牌VI设计全套"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  服务分类 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`rounded-full px-4 py-1.5 text-sm ${
                        category === cat.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  服务描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                  placeholder="详细描述你的服务内容、流程和交付物..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    价格（元） <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    交付周期 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="例如：7-10天"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
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
                发布服务
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
