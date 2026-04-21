'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function PolicyMatchPage() {
  const [description, setDescription] = useState('')

  const mutation = useMutation({
    mutationFn: async (data: { description: string }) => {
      const res = await api.get(
        `/policies/match?description=${encodeURIComponent(data.description)}`
      )
      return res.data
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    mutation.mutate({ description })
  }

  const matches = mutation.data?.matches || []

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI政策助手</h1>
          <p className="mt-2 text-gray-600">
            告诉我你的创业情况，为你推荐最适合的政策
          </p>
        </div>

        {/* Input Area */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Bot className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    placeholder="例如：我在徐汇龙华做AI应用创业，公司刚注册，需要算力资源和办公场地..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !description.trim()}
                  className="gap-2"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  获取推荐
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {matches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              根据您的情况，推荐以下政策：
            </h2>

            <div className="mt-4 space-y-4">
              {matches.map((match: any, index: number) => (
                <Card
                  key={match.id}
                  className="border-l-4 border-l-primary-500"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary-100 text-primary-700">
                            <Sparkles className="mr-1 h-3 w-3" />
                            匹配度 {match.matchScore}%
                          </Badge>
                          {index === 0 && (
                            <Badge variant="destructive">最推荐</Badge>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                          {match.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {match.summary}
                        </p>
                        <p className="mt-2 text-sm text-primary-600">
                          💡 {match.reason}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/policies/${match.id}`}>
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
