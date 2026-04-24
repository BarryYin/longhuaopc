'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
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

export default function NewDemandPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [deadline, setDeadline] = useState('')

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/skills/demands', data)
      return res.data
    },
    onSuccess: () => {
      alert('需求发布成功！')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !category || !description) {
      alert('请填写完整信息')
      return
    }
    createMutation.mutate({
      title,
      category,
      description,
      budget: { type: 'range', min: Number(budgetMin) || 0, max: Number(budgetMax) || 0 },
      deadline: deadline || undefined,
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
            <CardTitle>发布需求</CardTitle>
            <p className="text-sm text-gray-500">描述你的需求，找到合适的专家</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  需求标题 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="例如：需要一个AI短视频脚本生成工具"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  需求分类 <span className="text-red-500">*</span>
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
                  需求描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                  placeholder="详细描述你的需求背景、期望成果和预算范围..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预算下限（元）
                  </label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预算上限（元）
                  </label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  期望交付日期
                </label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                发布需求
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
