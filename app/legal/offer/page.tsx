import { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Публичная оферта | КурьерХаб',
  description: 'Публичная оферта на оказание курьерских услуг КурьерХаб',
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
              и содержит все существенные условия оказания курьерских услуг.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Предмет оферты</h2>
            <p className="text-muted-foreground leading-relaxed">
              Исполнитель обязуется оказать услуги по курьерской доставке грузов, 
              а Заказчик обязуется оплатить эти услуги в порядке и на условиях, определённых настоящей офертой.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Порядок оказания услуг</h2>
            <p className="text-muted-foreground leading-relaxed">
              Заказ оформляется через сайт, мессенджеры или по телефону. 
              После подтверждения заказа назначается курьер для выполнения доставки.
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
              Исполнитель несёт ответственность за сохранность груза с момента получения до момента доставки. 
              Заказчик несёт ответственность за достоверность предоставленной информации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Реквизиты</h2>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.company.name}<br />
              ОГРН: {siteConfig.company.ogrn}<br />
              ИНН: {siteConfig.company.inn}<br />
              Адрес: {siteConfig.company.address}<br />
              Телефон: {siteConfig.contact.phone}<br />
              Email: {siteConfig.contact.email}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
