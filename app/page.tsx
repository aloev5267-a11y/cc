import { Header } from "@/components/header"
import { SearchHero } from "@/components/search-hero"
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
      <SearchHero />
      <JobCategories />
      <Advantages />
      <HowItWorks />
      <FindWork />
      <ForEmployers />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}
