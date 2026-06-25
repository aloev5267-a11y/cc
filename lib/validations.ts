import { z } from 'zod'

// Схемы валидации для API

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
