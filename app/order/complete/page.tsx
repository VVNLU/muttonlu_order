'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react'
import { Button } from '@/components/shared';
import { SITE } from "@/lib/site";

interface OrderData {
  name: string
  phone: string
  quantity: number
  pickupMethod: string
  city: string
  district: string
  address: string
  remark: string
  productAmount: number
  shippingAmount: number
  totalAmount: number
  payment: string
  pickupDate: string
}

const OrderCompletePage = () => {
  const [order, setOrder] = useState<OrderData | null>(null)

  // 在 Component Mount 時讀取 sessionStorage
  useEffect(() => {
    const orderFormData = sessionStorage.getItem('order-form')
    if (orderFormData) {
      setOrder(JSON.parse(orderFormData))
    }
  }, [])
  

  const paymentByTransfer = () => {
    if (!order) return null
    return (
      <div>
        <p className="text-amber-700 font-medium text-lg">
          請先完成以下轉帳，並加入官方LINE提供後五碼，以便查詢。
        </p>

        <div className="flex justify-between items-center gap-4">
          {/* 左側：轉帳資訊 */}
          <div className="space-y-1 flex-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">銀行名稱</span>
              <span className="text-right tracking-wide">{SITE.bankName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">銀行帳號</span>
              <div className="flex flex-row items-center">
                <span className="text-right font-medium tracking-wider">
                  {SITE.bankAccount}
                </span>
                <Image
                  src="/icon/copy.svg"
                  alt="copy icon"
                  width={20}
                  height={20}
                  className="sm:w-5 sm:h-5"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">戶名</span>
              <span className="text-right">{SITE.bankAccountName}</span>
            </div>
          </div>

          {/* 右側：LINE QR Code */}
          <div className="flex flex-col items-center">
            <div className="p-1 bg-white border border-slate-300 rounded-md">
              <Image
                src={SITE.lineQrCode}
                alt="LINE QRCode"
                width={100}
                height={100}
                className="rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <div className="rounded-lg border bg-card shadow-sm">
        {order && (
          <div className="bg-green-600 p-3 rounded-t-lg space-y-1">
            {order.pickupDate && (
              <>
                {(order.pickupMethod === 'ship' || order.pickupMethod === 'delivery') && (
                  <>
                    <p className="text-xl text-white font-semibold">
                      預計於 {order.pickupDate} 出貨
                    </p>
                    {order.payment === 'transfer' && (
                      <p className="text-white">實際出貨日以收到入帳金額為主。</p>
                    )}
                    {order.payment === 'cash' && (
                      <p className="text-white">請先備足現金。</p>
                    )}
                  </>
                )}
                {order.pickupMethod === 'inStore' && (
                  <p className="text-xl text-white font-semibold">
                    請於 {order.pickupDate} 至店取貨
                  </p>
                )}
              </>
            )}
          </div>
        )}
        <div>
          {order && (
            <div className="p-3 space-y-1">
              {(order.pickupMethod === 'ship' || order.pickupMethod === 'delivery') && (
                <>
                  <p>收件資訊</p>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icon/map.svg"
                      alt="smile icon"
                      width={25}
                      height={25}
                      className="sm:w-5 sm:h-5"
                    />
                    <div className="flex flex-col">
                      <p>{order.name} {order.phone}</p>
                      <p>{order.city}{order.district}{order.address}</p>
                    </div>
                  </div>
                </>
              )}
              {order.pickupMethod === 'inStore' && (
                <>
                  <div className="space-y-3 text-sm">
                    <p className="flex justify-center text-amber-700 font-medium text-xl sm:text-2xl">
                      請於營業時間內取貨，謝謝。
                    </p>
                    <div className="space-y-1 sm:text-lg">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">地址</span>
                        <span className="text-right">{SITE.address}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">營業時間</span>
                        <span className="text-right">{SITE.businessHours}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">聯絡電話</span>
                        <span className="text-right">{SITE.phone}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
        {order?.payment === 'transfer' && (
          <div className="w-full rounded-lg border bg-card p-3 shadow-sm space-y-4">
            {paymentByTransfer()}
          </div>
        )}
      <div className="w-full rounded-lg border bg-card p-3 shadow-sm space-y-1 sm:text-lg">
        <div className="flex justify-between">
          <span className="text-muted-foreground">數量</span>
          <span className="text-right">{order?.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">金額</span>
          <span className="text-right font-semibold">{order?.totalAmount}</span>
        </div>
      </div>
      <div className="pt-2 flex flex-col gap-2">
        <Link href="/order" className="w-full">
          <Button 
            type="button"
            size="md"
            className="w-full sm:h-12 sm:px-8 sm:text-lg"
          >
            回訂購表單
          </Button>
        </Link>

        <Link href="/" className="w-full text-center text-muted-foreground hover:underline sm:text-lg">
          回首頁
        </Link>
      </div>
    </div>
  )
}

export default OrderCompletePage