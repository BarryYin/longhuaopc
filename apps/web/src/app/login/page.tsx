'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: async (data: { account: string; password: string }) => {
      const res = await api.post('/auth/login', data)
      return res.data
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '登录失败')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !password) {
      alert('请填写完整信息')
      return
    }
    loginMutation.mutate({ account, password })
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
          <p className="text-sm text-gray-500 mt-2">登录龙华OPC社区</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">账号（手机号）</label>
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                maxLength={11}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              登录
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">还没有账号？</span>
            <Link href="/register" className="text-primary-600 hover:underline">
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
