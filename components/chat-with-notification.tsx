"use client"

import { useCallback, useState } from "react"
import { NotificationPrompt } from "./notification-prompt"
import {
  canUseChat,
  getChatPermissionState,
  requestChatPermission,
  type ChatPermissionState,
} from "@/lib/chat-permission"

// Обёртка, которая открывает онлайн-чат ТОЛЬКО после того, как пользователь
// разрешил уведомления. Жёсткий режим: без разрешения чат не откроется.
//
// Использование (render-prop): сам триггер (кнопка) рендерит потребитель,
// получая готовую функцию open и флаг загрузки.
//
//   <ChatWithNotification onOpenChat={openLiveChat}>
//     {({ open, opening }) => <button onClick={open} aria-busy={opening}>Чат</button>}
//   </ChatWithNotification>

type ChatWithNotificationProps = {
  // Реальное открытие чата (например, openLiveChat). Должно вернуть true,
  // если виджет удалось открыть. Вызывается только при наличии разрешения.
  onOpenChat: () => Promise<boolean> | boolean
  // Вызывается перед открытием чата (например, трекинг лида), только когда
  // доступ к чату разрешён.
  onBeforeOpen?: () => void
  children: (api: { open: () => void; opening: boolean }) => React.ReactNode
}

export function ChatWithNotification({ onOpenChat, onBeforeOpen, children }: ChatWithNotificationProps) {
  const [promptOpen, setPromptOpen] = useState(false)
  const [permission, setPermission] = useState<ChatPermissionState>("default")
  const [requesting, setRequesting] = useState(false)
  const [opening, setOpening] = useState(false)

  // Фактическое открытие чата (после прохождения проверки разрешения).
  const doOpenChat = useCallback(async () => {
    if (opening) return
    setOpening(true)
    try {
      onBeforeOpen?.()
      await onOpenChat()
    } finally {
      setOpening(false)
    }
  }, [opening, onBeforeOpen, onOpenChat])

  // Клик по триггеру: если уведомления разрешены — открываем чат,
  // иначе показываем окно запроса (или инструкцию, если запрещено).
  const open = useCallback(() => {
    if (canUseChat()) {
      void doOpenChat()
      return
    }
    setPermission(getChatPermissionState())
    setPromptOpen(true)
  }, [doOpenChat])

  // Пользователь нажал "Включить уведомления".
  const handleAllow = useCallback(async () => {
    setRequesting(true)
    const result = await requestChatPermission()
    setRequesting(false)
    setPermission(result)

    if (result === "granted" || result === "unsupported") {
      setPromptOpen(false)
      void doOpenChat()
    }
    // Если denied — окно остаётся открытым и показывает инструкцию,
    // как включить уведомления вручную. Чат не открывается.
  }, [doOpenChat])

  const handleDismiss = useCallback(() => {
    // Закрытие окна НЕ открывает чат — это намеренно (жёсткий режим).
    setPromptOpen(false)
  }, [])

  return (
    <>
      {children({ open, opening })}
      <NotificationPrompt
        open={promptOpen}
        state={permission}
        requesting={requesting}
        onAllow={handleAllow}
        onDismiss={handleDismiss}
      />
    </>
  )
}
