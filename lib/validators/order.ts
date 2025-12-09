import { Phone } from 'lucide-react'
import { z } from 'zod'

// 商品資訊
export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  qty: z.number().int().positive(),
})
export type OrderItem = z.infer<typeof OrderItemSchema>

// 取貨方式
export const MethodEnum = z.enum(['inStore', 'ship', 'delivery'])
export type Method = z.infer<typeof MethodEnum>

// 訂單資訊
export const OrderFormSchema = z.object({
  name: z
    .string()
    .min(1, '請填寫姓名')
    .regex(/^[A-Za-z\u4e00-\u9fa5\s]+$/, '不可包含數字或符號'),
  phone: z
    .string()
    .min(1, '請填寫手機') 
    .regex(/^\d+$/, '僅限填寫數字')
    .min(10, '手機格式不正確'),
  quantity: z
    .number()
    .int()
    .min(1, '至少選購一包 1'),
  pickupMethod: z
    .string()
    .min(1, '請選擇取貨方式')
    .refine((val): val is Method => MethodEnum.options.includes(val as Method), {message: '請選擇取貨方式',}),
  pickupDate: z
    .string()
    .min(1, '請選擇取貨日期')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: '日期格式不正確',
    }),
  payment: z
    .string()
    .min(1, '請選擇付款方式'),
  city: z.string().optional().default(''),
  district: z.string().optional().default(''),
  address: z.string().optional().default(''),
  remark: z.string().optional().default(''),
})
.superRefine((data, ctx) => {
  // 宅配
  if (data.pickupMethod === 'ship') {
    if (!data.city) {
      ctx.addIssue({
        code: 'custom',
        path: ['city'],
        message: '請選擇縣市',
      })
    }
    if (!data.district) {
      ctx.addIssue({
        code: 'custom',
        path: ['district'],
        message: '請選擇市區鄉鎮',
      })
    }
    if (!data.address) {
      ctx.addIssue({
        code: 'custom',
        path: ['address'],
        message: '請填寫完整地址',
      })
    }
  }
})

export type OrderFormInput = z.infer<typeof OrderFormSchema>