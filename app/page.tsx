import { Header } from "@/components/header"
import { LeadHero } from "@/components/lead-hero"
import { SearchHero } from "@/components/search-hero"
import { Advantages } from "@/components/advantages"
import { JobCategories } from "@/components/job-categories"
import { FindWork } from "@/components/careers"
import { HireStaff } from "@/components/hire-staff"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <LeadHero />
      <SearchHero />
      <JobCategories />
      <Advantages />
      <FindWork />
      <HireStaff source="employer-home" />
      <CTA />
      <Footer />
    </main>
  )
}
