import { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Пользовательское соглашение`,
  description: `Условия использования сервиса ${siteConfig.name}`,
  alternates: { canonical: '/legal/terms' },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          &larr; Вернуться на главную
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Пользовательское соглашение</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground leading-relaxed">
              Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между 
              {siteConfig.company.name} (далее — Компания) и пользователем сайта {siteConfig.name} (далее — Пользователь).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Предмет соглашения</h2>
            <p className="text-muted-foreground leading-relaxed">
              Компания предоставляет Пользователю доступ к информационным услугам сайта, включая возможность 
              оставить заявку на подбор работы или подбор персонала.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Права и обязанности сторон</h2>
            <p className="text-muted-foreground leading-relaxed">
              Пользователь обязуется предоставлять достоверную информацию при заполнении форм на сайте. 
              Компания обязуется обеспечить конфиденциальность персональных данных Пользователя.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Ответственность</h2>
            <p className="text-muted-foreground leading-relaxed">
              Компания не несёт ответственности за временную недоступность сайта, вызванную техническими причинами.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Контактная информация</h2>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.company.name}<br />
              ОГРН: {siteConfig.company.ogrn}<br />
              ИНН: {siteConfig.company.inn}<br />
              КПП: {siteConfig.company.kpp}<br />
              Адрес: {siteConfig.company.address}<br />
              Email: {siteConfig.contact.email}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
