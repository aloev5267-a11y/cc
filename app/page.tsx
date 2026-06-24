import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Advantages } from "@/components/advantages"
import { JobCategories } from "@/components/job-categories"
import { HowItWorks } from "@/components/how-it-works"
import { FindWork } from "@/components/careers"
import { ForEmployers } from "@/components/for-employers"
import { CTA } from "@/components/cta"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Advantages />
      <JobCategories />
      <HowItWorks />
      <FindWork />
      <ForEmployers />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}
