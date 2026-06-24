// Единая точка входа в воронку (квиз LeadHero на главной).
// Любая секция «Работа по направлениям» и кнопки «Подобрать вакансию»
// прокручивают к квизу и при желании заранее выбирают сферу работы.

export type LeadField = "courier" | "warehouse" | "driver" | "sales" | "service" | "other"

export const LEAD_ANCHOR_ID = "lead"
export const LEAD_PREFILL_EVENT = "lead:prefill"

export type LeadPrefillDetail = { field?: LeadField }

// Прокрутить к квизу и (опционально) предвыбрать сферу работы.
export function startLead(field?: LeadField): void {
  if (typeof window === "undefined") return

  if (field) {
    window.dispatchEvent(
      new CustomEvent<LeadPrefillDetail>(LEAD_PREFILL_EVENT, { detail: { field } }),
    )
  }

  const el = document.getElementById(LEAD_ANCHOR_ID)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  } else {
    // Если квиза нет на текущей странице — уводим на главную к якорю.
    window.location.href = `/#${LEAD_ANCHOR_ID}`
  }
}
