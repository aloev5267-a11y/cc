import Script from 'next/script'

// ID счётчика Яндекс.Метрики. Можно переопределить через ENV без правок кода.
const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '110121319'

// Счётчик Яндекс.Метрики с Вебвизором, картой кликов и точным показателем отказов.
// Скрипт грузится стратегией afterInteractive, чтобы не блокировать рендер,
// но при этом успеть зафиксировать просмотр. <noscript>-пиксель — фолбэк без JS.
export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');
          ym(${YM_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
