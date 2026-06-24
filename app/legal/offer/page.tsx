import { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Публичная оферта`,
  description: `Публичная оферта на оказание услуг по подбору персонала и содействию в трудоустройстве ${siteConfig.name}`,
  alternates: { canonical: '/legal/offer' },
}

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          &larr; Вернуться на главную
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Публичная оферта</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Общие положения</h2>
            <p className="text-muted-foreground leading-relaxed">
              Настоящий документ является официальным предложением (публичной офертой) {siteConfig.company.name} 
              и содержит все существенные условия оказания услуг по подбору персонала и содействию в трудоустройстве.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Предмет оферты</h2>
            <p className="text-muted-foreground leading-relaxed">
              Исполнитель обязуется оказать услуги по подбору персонала и содействию в трудоустройстве, 
              а Заказчик обязуется оплатить эти услуги в порядке и на условиях, определённых настоящей офертой. 
              Для соискателей услуги по подбору работы оказываются бесплатно.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Порядок оказания услуг</h2>
            <p className="text-muted-foreground leading-relaxed">
              Заявка оформляется через сайт, мессенджеры или по телефону. 
              После обработки заявки специалист подбирает подходящие вакансии или кандидатов.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Стоимость и оплата</h2>
            <p className="text-muted-foreground leading-relaxed">
              Стоимость услуг рассчитывается на основании тарифов, действующих на момент оформления заказа. 
              Оплата производится наличными, банковской картой или безналичным переводом.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Ответственность сторон</h2>
            <p className="text-muted-foreground leading-relaxed">
              Исполнитель прилагает разумные усилия для подбора подходящих вакансий и кандидатов. 
              Заказчик несёт ответственность за достоверность предоставленной информации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Реквизиты</h2>
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
