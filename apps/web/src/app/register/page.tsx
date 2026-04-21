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
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [countdown, setCountdown] = useState(0)

  const sendCodeMutation = useMutation({
    mutationFn: async (phone: string) => {
      await api.post('/auth/sms/send', { phone })
    },
    onSuccess: () => {
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: { phone: string; code: string }) => {
      const res = await api.post('/auth/login/phone', data)
      return res.data
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      router.push('/')
    },
  })

  const handleSendCode = () => {
    if (!phone.match(/^1[3-9]\d{9}$/)) {
      alert('请输入正确的手机号')
      return
    }
    sendCodeMutation.mutate(phone)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !code) {
      alert('请填写完整信息')
      return
    }
    registerMutation.mutate({ phone, code })
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
              <label className="block text-sm font-medium text-gray-700">验证码</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={countdown > 0 || sendCodeMutation.isPending}
                  onClick={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </div>
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
