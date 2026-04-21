import Link from 'next/link'

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { label: '政策中心', href: '/policies' },
      { label: '能力市场', href: '/market' },
      { label: '创业者社区', href: '/community' },
      { label: '成长学院', href: '/academy' },
    ],
  },
  support: {
    title: '支持',
    links: [
      { label: '开发者文档', href: '/developers' },
      { label: 'API接入', href: '/developers/api' },
      { label: '帮助中心', href: '/help' },
      { label: '联系我们', href: '/contact' },
    ],
  },
  about: {
    title: '关于',
    links: [
      { label: '关于我们', href: '/about' },
      { label: '用户协议', href: '/terms' },
      { label: '隐私政策', href: '/privacy' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              龙华OPC
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              为AI时代独立创业者提供政策查询、技能交易、社区成长的一站式服务平台
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 龙华OPC社区. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
