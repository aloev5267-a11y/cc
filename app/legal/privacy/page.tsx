import { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Политика конфиденциальности`,
  description: `Политика обработки персональных данных ${siteConfig.name}`,
  alternates: { canonical: '/legal/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          &larr; Вернуться на главную
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground leading-relaxed">
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
              пользователей сайта {siteConfig.name}, которым управляет {siteConfig.company.name}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Сбор персональных данных</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы собираем следующие данные: имя, номер телефона, адрес электронной почты, 
              сведения о желаемой работе или вакансии. Данные собираются при заполнении форм на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Цели обработки данных</h2>
            <p className="text-muted-foreground leading-relaxed">
              Персональные данные используются для: подбора вакансий и персонала, связи с пользователями, 
              рассмотрения заявок на трудоустройство, улучшения качества услуг.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Защита данных</h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы применяем современные методы защиты данных, включая шифрование при передаче и хранении. 
              Доступ к данным имеют только авторизованные сотрудники.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Права пользователей</h2>
            <p className="text-muted-foreground leading-relaxed">
              Вы имеете право запросить доступ к своим данным, их исправление или удаление. 
              Для этого свяжитесь с нами по email: {siteConfig.contact.email}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Контактная информация</h2>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.company.name}<br />
              ОГРН: {siteConfig.company.ogrn}<br />
              ИНН: {siteConfig.company.inn}<br />
              Адрес: {siteConfig.company.address}<br />
              Email: {siteConfig.contact.email}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
