import { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { LegalPage, type LegalSection } from "@/components/legal-page"

export const metadata: Metadata = {
  title: `Политика конфиденциальности`,
  description: `Политика обработки персональных данных ${siteConfig.name}`,
  alternates: { canonical: "/legal/privacy" },
}

const sections: LegalSection[] = [
  {
    id: "obshie-polozheniya",
    title: "Общие положения",
    body: (
      <p>
        Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей
        сайта {siteConfig.name}, которым управляет {siteConfig.company.name}. Обработка данных осуществляется в
        соответствии с законодательством Российской Федерации.
      </p>
    ),
  },
  {
    id: "sbor-dannyh",
    title: "Сбор персональных данных",
    body: (
      <p>
        Мы собираем следующие данные: имя, номер телефона, адрес электронной почты, сведения о желаемой работе или
        вакансии. Данные собираются при заполнении форм на сайте и обрабатываются исключительно с согласия пользователя.
      </p>
    ),
  },
  {
    id: "celi-obrabotki",
    title: "Цели обработки данных",
    body: (
      <p>
        Персональные данные используются для: подбора вакансий и персонала, связи с пользователями, рассмотрения заявок
        на трудоустройство, а также улучшения качества предоставляемых услуг.
      </p>
    ),
  },
  {
    id: "zashita-dannyh",
    title: "Защита данных",
    body: (
      <p>
        Мы применяем современные методы защиты данных, включая шифрование при передаче и хранении. Доступ к данным имеют
        только авторизованные сотрудники, обязанные соблюдать конфиденциальность.
      </p>
    ),
  },
  {
    id: "prava-polzovateley",
    title: "Права пользователей",
    body: (
      <p>
        Вы имеете право запросить доступ к своим данным, их исправление или удаление. Для этого свяжитесь с нами по
        адресу <a href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>.
      </p>
    ),
  },
  {
    id: "kontakty",
    title: "Контактная информация",
    body: (
      <p>
        По вопросам обработки персональных данных вы можете обратиться к нам по реквизитам, указанным ниже.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      doc="privacy"
      title="Политика конфиденциальности"
      description={`Как ${siteConfig.name} собирает, использует и защищает ваши персональные данные.`}
      updatedAt={siteConfig.company.registrationDate}
      sections={sections}
    />
  )
}
