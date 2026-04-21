import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavBar } from '@/components/layout/nav-bar'
import { HeroSection } from '@/components/sections/hero-section'
import { FeatureSection } from '@/components/sections/feature-section'
import { PolicyPreview } from '@/components/sections/policy-preview'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <HeroSection />
      <FeatureSection />
      <PolicyPreview />
      <Footer />
    </main>
  )
}
