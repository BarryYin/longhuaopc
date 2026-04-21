'use client'

import { NavBar } from '@/components/layout/nav-bar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const codeExamples = {
  policy: `// 政策查询示例
const response = await fetch(
  'https://api.opc.com/v1/policies/match',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'sk_live_xxx'
    },
    body: JSON.stringify({
      location: '龙华',
      industry: 'AI',
      description: 'AI应用创业'
    })
  }
);

const data = await response.json();
console.log(data.matches);`,

  service: `// 服务搜索示例
const response = await fetch(
  'https://api.opc.com/v1/skills/services?keyword=AI开发',
  {
    headers: {
      'X-API-Key': 'sk_live_xxx'
    }
  }
);

const data = await response.json();
console.log(data.services);`,

  mcp: `// MCP协议配置
{
  "mcpServers": {
    "opc-platform": {
      "command": "npx",
      "args": [
        "-y",
        "@opc/mcp-server"
      ],
      "env": {
        "OPC_API_KEY": "sk_live_xxx"
      }
    }
  }
}`
}

export default function DevelopersPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (key: string) => {
    navigator.clipboard.writeText(codeExamples[key as keyof typeof codeExamples])
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            开发者接入
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            让你的AI助手为创业者提供精准服务
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="secondary">创建 API Key</Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              查看文档
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {['快速开始', '认证方式', 'API参考', 'MCP协议', '错误处理', 'Webhook'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="quickstart">
              <TabsList>
                <TabsTrigger value="quickstart">快速开始</TabsTrigger>
                <TabsTrigger value="examples">代码示例</TabsTrigger>
                <TabsTrigger value="mcp">MCP协议</TabsTrigger>
              </TabsList>

              <TabsContent value="quickstart" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold">快速开始</h2>
                    <p className="mt-2 text-gray-600">
                      只需三步，即可让你的AI助手接入龙华OPC平台：
                    </p>

                    <div className="mt-6 space-y-6">
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold">注册账号并创建 API Key</h3>
                          <p className="text-sm text-gray-600">
                            登录后进入「开发者中心」，创建 API Key
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold">阅读 API 文档</h3>
                          <p className="text-sm text-gray-600">
                            了解我们的 API 接口和参数规范
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold">接入并测试</h3>
                          <p className="text-sm text-gray-600">
                            使用 API Key 调用接口，为你的用户提供服务
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold">认证方式</h2>
                    <p className="mt-2 text-gray-600">
                      所有 API 请求需要在 Header 中携带 API Key：
                    </p>
                    <pre className="mt-4 rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                      <code>X-API-Key: sk_live_your_api_key</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">政策匹配</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode('policy')}
                      >
                        {copied === 'policy' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                      <code>{codeExamples.policy}</code>
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">服务搜索</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode('service')}
                      >
                        {copied === 'service' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                      <code>{codeExamples.service}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mcp" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold">MCP 协议支持</h2>
                    <p className="mt-2 text-gray-600">
                      我们支持 Model Context Protocol (MCP)，让 Claude 等 AI 助手可以直接调用我们的服务。
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <h3 className="font-medium">配置文件示例</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode('mcp')}
                      >
                        {copied === 'mcp' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                      <code>{codeExamples.mcp}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
