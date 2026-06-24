import { z } from 'zod'

// Схемы валидации для API

// Chat API
export const chatCreateSchema = z.object({
  action: z.literal('create'),
  userName: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
  position: z.string().min(1, 'Позиция обязательна').max(200, 'Название позиции слишком длинное'),
})

export const chatSendSchema = z.object({
  action: z.literal('send'),
  chatId: z.string().uuid('Неверный ID чата'),
  message: z.string().min(1, 'Сообщение не может быть пустым').max(2000, 'Сообщение слишком длинное'),
})

export const chatMessagesSchema = z.object({
  action: z.literal('messages'),
  chatId: z.string().uuid('Неверный ID чата'),
})

export const chatStatusSchema = z.object({
  action: z.literal('status'),
  chatId: z.string().uuid('Неверный ID чата'),
})

export const chatActionSchema = z.discriminatedUnion('action', [
  chatCreateSchema,
  chatSendSchema,
  chatMessagesSchema,
  chatStatusSchema,
])

// Admin API
export const adminAddManagersSchema = z.object({
  action: z.literal('add_managers'),
  secret: z.string(),
  managers: z.array(z.object({
    id: z.string(),
    telegramId: z.string(),
    name: z.string().min(1).max(100),
  })).min(1).max(50),
})

export const adminSetupWebhookSchema = z.object({
  action: z.literal('setup_webhook'),
  secret: z.string(),
  botToken: z.string().optional(),
  webhookUrl: z.string().url('Неверный URL вебхука'),
})

export const adminActionSchema = z.discriminatedUnion('action', [
  adminAddManagersSchema,
  adminSetupWebhookSchema,
])

// Telegram Webhook
export const telegramCallbackQuerySchema = z.object({
  callback_query: z.object({
    data: z.string(),
    from: z.object({
      id: z.number(),
      first_name: z.string().optional(),
    }),
    message: z.object({
      message_id: z.number(),
    }).optional(),
  }),
})

export const telegramMessageSchema = z.object({
  message: z.object({
    text: z.string(),
    from: z.object({
      id: z.number(),
    }),
  }),
})

// Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100),
  email: z.string().email('Неверный email'),
  phone: z.string().min(10, 'Неверный телефон').max(20),
  message: z.string().min(1, 'Сообщение обязательно').max(5000),
})

// Contact API request (форма обратной связи)
export const contactRequestSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100),
  phone: z.string().min(5, 'Укажите телефон').max(30),
  email: z.string().email('Неверный email').max(200).optional().or(z.literal('')),
  message: z.string().max(5000).optional().or(z.literal('')),
  source: z.enum(['contact_form']).default('contact_form'),
  preferredContact: z.enum(['phone', 'email', 'telegram', 'whatsapp']).optional(),
})

export type ContactRequest = z.infer<typeof contactRequestSchema>

export type ChatAction = z.infer<typeof chatActionSchema>
export type AdminAction = z.infer<typeof adminActionSchema>
export type ContactForm = z.infer<typeof contactFormSchema>
