import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import CtaSection from '@/components/cta-section'
import TokensSection from '@/components/tokens-section'
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TokensSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
