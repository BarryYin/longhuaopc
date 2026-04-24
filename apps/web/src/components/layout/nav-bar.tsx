'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Zap, User, LogOut } from 'lucide-react'

const navItems = [
  { label: '政策中心', href: '/policies' },
  { label: '能力市场', href: '/market' },
  { label: '社区', href: '/community' },
  { label: '成长学院', href: '/academy' },
]

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsLoggedIn(!!token)
    // 尝试从localStorage获取用户信息
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setNickname(user.nickname || '')
      }
    } catch {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-bold">龙华OPC</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                  <User className="h-4 w-4" />
                </div>
                <span>{nickname || '用户'}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="h-4 w-4" />
                退出
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <Button variant="outline" className="w-full gap-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  退出登录
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">登录</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full">注册</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
