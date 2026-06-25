import Script from "next/script"
import { siteConfig } from "@/lib/config"

// Загрузчик онлайн-чата. Подключает виджет одним скриптом — как рекомендует
// провайдер: <script async src=".../widget.js" data-support-key="lc_...">.
// Все настройки (цвет, тексты, позиция, рабочие часы, вкл/выкл) меняются в
// панели провайдера и применяются автоматически, без правок кода на сайте.
// Скрипт выставляет глобальный объект window.SupportChat (см. lib/livechat.ts),
// который используют кнопки «Онлайн-чат» по сайту.
export function SupportChat() {
  return (
    <Script
      id="support-chat-widget"
      src={siteConfig.livechat.scriptSrc}
      data-support-key={siteConfig.livechat.supportKey}
      strategy="afterInteractive"
    />
  )
}
