import NavigationMenu from "@/components/navigation-menu"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import LiveDemoSection from "@/components/live-demo-section"
import AnalyticsSection from "@/components/analytics-section"
import TestimonialSection from "@/components/testimonial-section"
import PricingSection from "@/components/pricing-section"
import PaymentLogos from "@/components/payment-logos"
import FaqSection from "@/components/faq-section"
import CtaSection from "@/components/cta-section"
import FloatingCTA from "@/components/floating-cta"
import CountdownTimer from "@/components/countdown-timer"

export default function Home() {
  return (
    <main className="overflow-hidden">
      <NavigationMenu />
      <HeroSection />
      <CountdownTimer />
      <div id="recursos">
        <FeatureSection />
      </div>
      <div id="como-funciona">
        <LiveDemoSection />
      </div>
      <div id="analises">
        <AnalyticsSection />
      </div>
      <PaymentLogos />
      <div id="depoimentos">
        <TestimonialSection />
      </div>
      <div id="precos">
        <PricingSection />
      </div>
      <div id="faq">
        <FaqSection />
      </div>
      <CtaSection />
      <FloatingCTA />
    </main>
  )
}

