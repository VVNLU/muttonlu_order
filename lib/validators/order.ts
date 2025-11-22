import { z } from 'zod'

// 商品資訊
export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  qty: z.number().int().positive(),
})
export type OrderItem = z.infer<typeof OrderItemSchema>

// 顧客資訊
export const CustomerInfoSchema = z.object({
  name: z.string().min(1, '請填寫姓名'),
  phone: z.string().regex(/^\d+$/, '僅限填寫數字').min(10, '手機格式不正確'),
  city: z.string().min(1, '請選擇縣市'),
  district: z.string().min(1, '請選擇市區鄉鎮'),
  address: z.string().min(1, '請填寫完整地址'),
})
export type CustomerInfo = z.infer<typeof CustomerInfoSchema>

// 取貨方式
export const MethodEnum = z.enum(['inStore', 'ship', 'delivery'])
export type Method = z.infer<typeof MethodEnum>

// 訂單資訊
export const OrderFormSchema = z.object({
  items: z.array(OrderItemSchema).min(1, '至少選購一包'),
  customer: CustomerInfoSchema,
  method: MethodEnum,
  city: z.string().optional().default(''),
  district: z.string().optional().default(''),
  addrRest: z.string().optional().default(''),
})
export type OrderFormInput = z.infer<typeof OrderFormSchema>