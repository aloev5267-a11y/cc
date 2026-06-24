import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { DeliveryForm } from "@/components/delivery-form"
import { CargoSearch } from "@/components/cargo-search"
import { Careers } from "@/components/careers"
import { CTA } from "@/components/cta"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <DeliveryForm />
      <CargoSearch />
      <Careers />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}
