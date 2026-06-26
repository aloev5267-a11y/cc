"use client"

import { motion } from "framer-motion"
import { siteUrl } from "@/lib/config"
import { IconCheck, IconChart, IconBriefcase, IconClock } from "@/components/icons"

// Памятка по настройке рекламы в Яндекс.Директе для менеджеров.
// Чисто справочная вкладка в админке: как запускать кампании, что такое фид,
// товарные кампании и как не сливать бюджет на скликивание.

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </div>
  )
}

export function MarketingGuide() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">Гайд по Яндекс.Директу</h1>
          <p className="text-sm text-muted-foreground">
            Как запускать кампании на этот сайт, на что делать упор и как не сливать бюджет.
            Памятка для ознакомления — не инструкция «в один клик».
          </p>
        </header>

        <Section title="С чего начать и какие цели использовать" icon={IconChart}>
          <p>
            Весь сайт настроен на одну цель в Яндекс.Метрике (счётчик уже стоит). В Метрике
            создаётся одна цель типа <b>«JavaScript-событие»</b> с идентификатором{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">LEAD</code>. На неё
            засчитываются все обращения: клики по Telegram/WhatsApp/Max, открытие онлайн-чата и
            отправка формы.
          </p>
          <Bullet>
            В кампаниях выбирайте стратегию <b>«Оплата за конверсии»</b> по цели{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">LEAD</code> — так вы
            платите за обращения, а не за клики.
          </Bullet>
          <Bullet>
            Каналы и источники различаются параметрами цели (<code className="text-foreground">channel</code>:
            telegram/whatsapp/chat/form и <code className="text-foreground">source</code>:
            hero-quick, promo-wheel и т.д.) — отдельные цели создавать не нужно.
          </Bullet>
          <Bullet>
            Включите автоматическую разметку ссылок (yclid) — на сайте уже ловятся метки yclid и
            UTM, они прикрепляются к каждой заявке.
          </Bullet>
        </Section>

        <Section title="На что делать упор (офферы и посадочные)" icon={IconBriefcase}>
          <Bullet>
            Ведите трафик на конкретные страницы: <b>главная</b> (квиз-анкета) и{" "}
            <b>страницы вакансий</b> <code className="text-foreground">/vacancies/...</code> — они
            заточены под отклик и индексируются.
          </Bullet>
          <Bullet>
            Промо-страница <code className="text-foreground">/promo</code> (колесо бонусов) — для
            «горячих» кампаний и ретаргетинга. Она закрыта от индексации, в объявлениях ведите на
            неё аккуратно: в тексте объявления — нейтральный оффер («Работа курьером, выплаты каждый
            день»), а бонусы человек видит уже на странице.
          </Bullet>
          <Bullet>
            Главный упор офферов: <b>выплаты каждый день</b>, <b>оформление за 1 день</b>,{" "}
            <b>работа рядом с домом</b>, <b>без опыта</b>. Это то, что реально конвертит на массовых
            профессиях.
          </Bullet>
          <Bullet>
            Не обещайте в объявлениях точных сумм, которые не гарантированы каждому. Используйте
            формулировку <b>«бонусы до …»</b> — так безопаснее при модерации.
          </Bullet>
        </Section>

        <Section title="Фид и товарные кампании (для динамики и смарт-баннеров)" icon={IconClock}>
          <p>
            На сайте есть готовый фид со всеми вакансиями — он отдаётся по адресу{" "}
            <a
              href={`${siteUrl}/feed.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
            >
              {siteUrl}/feed.xml
            </a>
            . Это XML-фид в формате YML (как у товарных магазинов), где каждая вакансия — отдельный
            «товар» с названием, городом, зарплатой и ссылкой.
          </p>
          <Bullet>
            <b>Динамические объявления / Товарная кампания:</b> в Директе создайте кампанию с
            источником данных «Фид» и укажите ссылку на <code className="text-foreground">/feed.xml</code>.
            Директ сам сгенерирует объявления под каждую вакансию.
          </Bullet>
          <Bullet>
            <b>Смарт-баннеры и ретаргетинг по фиду:</b> тот же фид подходит для смарт-баннеров —
            человек, посмотревший вакансию, увидит её снова в РСЯ.
          </Bullet>
          <Bullet>
            Фид обновляется автоматически (кэш ~1 час). Список вакансий меняется в коде сайта — в
            фид они попадают без ручной выгрузки.
          </Bullet>
          <Bullet>
            После добавления фида проверьте его в Директе на ошибки валидации — если вакансий нет в
            наличии, объявления по ним показываться не будут.
          </Bullet>
        </Section>

        <Section title="Как не платить за скликивание (антифрод)" icon={IconCheck}>
          <p>
            Яндекс <b>не списывает</b> деньги за недействительные клики: его система антифрода
            автоматически отсеивает ботов, повторные и подозрительные клики, а уже списанные
            недействительные клики возвращаются на баланс. Отдельно платить за «накрутку» не нужно —
            но настройки кампании сильно влияют на чистоту трафика.
          </p>
          <Bullet>
            Стратегия <b>«Оплата за конверсии» по цели LEAD</b> — самый надёжный способ: деньги
            уходят только за реальные обращения, а не за клики (скликивание почти не вредит бюджету).
          </Bullet>
          <Bullet>
            Включите <b>«Запрет показов по IP»</b> для подозрительных адресов и ограничьте показы на
            площадках РСЯ с плохим качеством (отключайте площадки с высоким показателем отказов).
          </Bullet>
          <Bullet>
            Поставьте <b>дневной лимит бюджета</b> и корректировки по времени/региону — это не даёт
            слить бюджет за час при всплеске нецелевых кликов.
          </Bullet>
          <Bullet>
            Следите за отчётом по конверсиям и показателю отказов в Метрике (Вебвизор уже включён).
            Резкий рост отказов с одной площадки/региона — повод её отключить.
          </Bullet>
          <Bullet>
            Если подозреваете массовое скликивание конкурентами — соберите данные (даты, объёмы) и
            напишите в поддержку Директа; недействительные клики компенсируют.
          </Bullet>
        </Section>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Короткий чек-лист запуска</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Создать в Метрике цель «JavaScript-событие» с идентификатором LEAD.</li>
            <li>Кампания со стратегией «Оплата за конверсии» по цели LEAD.</li>
            <li>Поиск + РСЯ раздельно; нейтральные офферы (выплаты каждый день, без опыта).</li>
            <li>Товарная кампания на фид /feed.xml для всех вакансий.</li>
            <li>Дневной лимит бюджета, разметка yclid, контроль площадок и отказов.</li>
          </ol>
        </div>
      </div>
    </motion.div>
  )
}
