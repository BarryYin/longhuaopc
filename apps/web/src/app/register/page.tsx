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

export default function RegisterPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')

  const registerMutation = useMutation({
    mutationFn: async (data: { phone: string; password: string; nickname?: string }) => {
      const res = await api.post('/auth/register', data)
      return res.data
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '注册失败')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password || !confirmPassword) {
      alert('请填写完整信息')
      return
    }
    if (!phone.match(/^1[3-9]\d{9}$/)) {
      alert('请输入正确的手机号')
      return
    }
    if (password.length < 6 || password.length > 20) {
      alert('密码长度必须在6-20位之间')
      return
    }
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    registerMutation.mutate({ phone, password, nickname: nickname || undefined })
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">注册账号</CardTitle>
          <p className="text-sm text-gray-500 mt-2">加入龙华OPC社区</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">手机号</label>
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <Input
                type="password"
                placeholder="请输入密码（6-20位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">确认密码</label>
              <Input
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">昵称（选填）</label>
              <Input
                type="text"
                placeholder="设置你的昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              注册
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">已有账号？</span>
            <Link href="/login" className="text-primary-600 hover:underline">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
