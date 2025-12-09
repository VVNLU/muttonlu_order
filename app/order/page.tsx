'use client'

import React from 'react';
import Image from "next/image";
import { z } from 'zod'
import { format } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Select, Button, DatePicker } from '@/components/shared';
import { OrderFormSchema, MethodEnum, type Method, type OrderFormInput } from '@/lib/validators/order';
import { SITE } from '@/lib/site';
import taiwanAreas from '@/data/taiwan-areas.json';

const page = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState('1') 
  const [pickupMethod, setPickupMethod] = useState('') 
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [remark, setRemark] = useState('')
  const [payment, setPayment] = useState('')
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)

  const [nameError, setNameError] = useState<string | undefined>()
  const [phoneError, setPhoneError] = useState<string | undefined>()
  const [quantityError, setQuantityError] = useState<string | undefined>()
  const [pickupMethodError, setPickupMethodError] = useState<string | undefined>()
  const [cityError, setCityError] = useState<string | undefined>()
  const [districtError, setDistrictError] = useState<string | undefined>()
  const [addressError, setAddressError] = useState<string | undefined>()
  const [paymentError, setPaymentError] = useState<string | undefined>()
  const [pickupDateError, setPickupDateError] = useState<string | undefined>()

  const METHOD_LABELS: Record<Method, string> = {
  inStore: '店面自取',
  ship: '冷凍宅配',
  delivery: '外送',
}

  const methodOptions = MethodEnum.options.map((value) => ({
    value,
    label: METHOD_LABELS[value]
  }))

  const isInStore = pickupMethod === 'inStore'
  const isShip = pickupMethod === 'ship'
  const isDelivery = pickupMethod === 'delivery'

  const UNIT_PRICE = 700
  const SHIPPING_FEE = 200
  const FREE_SHIPPING_QTY = 5

  const qty = Math.max(0, Number(quantity) || 0)
  const productAmount = qty * UNIT_PRICE
  let shippingAmount = 0
  if (pickupMethod === 'ship' && qty > 0 && qty < FREE_SHIPPING_QTY) {
    shippingAmount = SHIPPING_FEE
  }
  const totalAmount = productAmount + shippingAmount

  const handleBlur = (
    value: string,
    setError: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    if (!value) {
      setError('必填')
    } else {
      setError(undefined)
    }
  }

  const cityOptions = Object.keys(taiwanAreas).map((cityName) => ({
    label: cityName,
    value: cityName,
  }))

  const districtOptions = city && taiwanAreas[city as keyof typeof taiwanAreas]
    ? taiwanAreas[city as keyof typeof taiwanAreas].map((d) => ({
      label: d,
      value: d,
    })) : []

  const handleSubmit = () => {
    const formData: OrderFormInput = {
      name,
      phone,
      quantity: qty,
      pickupMethod: pickupMethod as Method,
      payment,
      city,
      district,
      address,
      pickupDate: pickupDate ? format(pickupDate, 'yyyy-MM-dd') : '',
      remark,
    }

    const result = OrderFormSchema.safeParse(formData)

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error)
      setNameError(fieldErrors.name?.[0])
      setPhoneError(fieldErrors.phone?.[0])
      setQuantityError(fieldErrors.quantity?.[0])
      setPickupMethodError(fieldErrors.pickupMethod?.[0])
      setPaymentError(fieldErrors.payment?.[0])
      setCityError(fieldErrors.city?.[0])
      setDistrictError(fieldErrors.district?.[0])
      setAddressError(fieldErrors.address?.[0])
      setPickupDateError(fieldErrors.pickupDate?.[0])
      return
    }
    const data = {
      ...result.data,
      totalAmount,
    }
    if (typeof window !== 'undefined') {
    sessionStorage.setItem('order-form', JSON.stringify(data))
    }

    router.push('/order/complete')
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Field
        label="姓名"
        required
        error={nameError}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur(name, setNameError)}
          invalid={!!nameError}
        />
      </Field>
      <Field
        label="手機"
        required
        error={phoneError}
      >
        <Input
          value={phone}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="範例：0911234567"
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => handleBlur(phone, setPhoneError)}
          invalid={!!phoneError}
        />
      </Field>
      <Field
        label="數量"
        required
        error={quantityError}
      >
        <Input
          value={quantity}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={1}
          onChange={(e) => setQuantity(e.target.value)}
          onBlur={() => handleBlur(quantity, setQuantityError)}
          invalid={!!quantityError}
        />
      </Field>
      <Field
        label="取貨方式"
        error={pickupMethodError}
      >
        <Select
          value={pickupMethod}
          onValueChange={(val) => {
            const method = val as Method

            setPickupMethod(method)
            setPickupMethodError(undefined)

            setCityError(undefined)
            setDistrictError(undefined)
            setAddressError(undefined)
            setPaymentError(undefined)
            setPickupDateError(undefined)
            if (method === 'delivery') {
              setCity('花蓮縣')
              setPickupDate(undefined)
              setDistrict('')
              setPayment('')
            } else if (method === 'ship') {
              setPayment('transfer')
              setCity('')
              setDistrict('')
              setAddress('')

              const tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              setPickupDate(tomorrow)
            } else {
              setPickupDate(undefined)
              setCity('')
              setDistrict('')
              setAddress('')
              setPayment('')
            }
          }}
          options={methodOptions}
          invalid={!!pickupMethodError}
        />
      </Field>
      {/* 自取 */}
      {isInStore && (
        <>
          <Field
            label="取貨日期"
            required
            error={pickupDateError}
            >
            <DatePicker
              value={pickupDate}
              onChange={(date) => {
                setPickupDate(date)
                if (!date) {
                  setPickupDateError('請選擇取貨日期')
                } else {
                  setPickupDateError(undefined)
                }
              }}
              placeholder="請選擇取貨日期"
              invalid={!!pickupDateError}
              disableTodayAfterHour={20} 
            />
          </Field>
          <Field
            label="付款方式"
            required
            error={paymentError}
          >
            <Select
              value={payment}
              onValueChange={(val) => {
                setPayment(val)
                handleBlur(val, setPaymentError)
              }}
              options={[
                { label: '現金', value: 'cash' },
                { label: '轉帳', value: 'transfer' },
              ]}
              invalid={!!paymentError}
            />
          </Field>
          <Field
            className="col-span-2"
            label="備註"
            >
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              />
          </Field>
          <div className="col-span-2 rounded-md bg-primary/5 mt-2 p-4 text-base leading-relaxed">
            <div className='flex items-center justify-center text-lg font-semibold'>請於營業時間內取貨，謝謝
              <Image
                src="/icon/smile.svg"
                alt="smile icon"
                width={20}
                height={20}
                className="ml-1 sm:w-5 sm:h-5"
              />
            </div>
            <div>地址：{SITE.address}</div>
            <div>營業時間：{SITE.businessHours}</div>
            <div>電話：{SITE.phone}</div>
          </div>
        </>
      )}
      {/* 宅配 */}
      {isShip && (
        <>
          <Field
            label="出貨日期"
            required
            description="非到貨日，預計2-3天內到貨"
            error={pickupDateError}
            >
            <DatePicker
              value={pickupDate}
              onChange={(date) => {
                setPickupDate(date)
                if (!date) {
                  setPickupDateError('請選擇出貨日期')
                } else {
                  setPickupDateError(undefined)
                }
              }}
              placeholder="請選擇出貨日期"
              invalid={!!pickupDateError}
              disableToday
            />
          </Field>
          <Field
            label="付款方式"
            required
            error={paymentError}
          >
            <Select
              value={payment}
              disabled
              onValueChange={(val) => {
                setPayment(val)
                handleBlur(val, setPaymentError)
              }}
              options={[
                { label: '轉帳', value: 'transfer' },
              ]}
              invalid={!!paymentError}
            />
          </Field>
          <Field
            label="縣市"
            required
            error={cityError}
          >
            <Select
              value={city}
              onValueChange={(val) => {
                setCity(val)
                setDistrict('') // 換縣市時清空鄉鎮
                handleBlur(val, setCityError)
              }}
              placeholder="請選擇縣市"
              options={cityOptions}
              invalid={!!cityError}
            />
          </Field>
          <Field
            label="鄉鎮市區"
            required
            error={districtError}
          >
            <Select
              value={district}
              onValueChange={(val) => {
                setDistrict(val)
                handleBlur(val, setDistrictError)
              }}
              disabled={!city}
              placeholder="請選擇鄉鎮市區"
              options={districtOptions}
              invalid={!!districtError}
            />
          </Field>
          <Field
            className="col-span-2"
            label="完整地址"
            required
            error={addressError}
          >
            <Input
              value={address}
              disabled={!city || !district}
              placeholder="請輸入路名、巷弄、門牌、樓層等"
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => handleBlur(address, setAddressError)}
              invalid={!!addressError}
            />
          </Field>
          <Field
            className="col-span-2"
            label="備註"
          >
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Field>
        </>
      )}
      {/* 外送 */}
      {isDelivery && (
        <>
                  <Field
            label="外送日期"
            required
            description={`每天14:00停止收單\n僅於14:30-16:00時段外送`}
            error={pickupDateError}
            >
            <DatePicker
              value={pickupDate}
              onChange={(date) => {
                setPickupDate(date)
                if (!date) {
                  setPickupDateError('請選擇外送日期')
                } else {
                  setPickupDateError(undefined)
                }
              }}
              placeholder="請選擇外送日期"
              invalid={!!pickupDateError}
              disableTodayAfterHour={14}
            />
          </Field>
          <Field
            label="付款方式"
            required
            error={paymentError}
          >
            <Select
              value={payment}
              onValueChange={(val) => {
                setPayment(val)
                handleBlur(val, setPaymentError)
              }}
              options={[
                { label: '現金', value: 'cash' },
                { label: '轉帳', value: 'transfer' },
              ]}
              invalid={!!paymentError}
            />
          </Field>
          <Field
            label="縣市"
            required
            description="僅限花蓮縣部分地區"
            error={cityError}
          >
            <Select
              disabled
              value={city}
              onValueChange={(val) => {
                setCity(val)
                handleBlur(val, setCityError)
              }}
              options={[
                { label: '花蓮縣', value: '花蓮縣' },
              ]}
              invalid={!!cityError}
            />
          </Field>
          <Field
            label="鄉鎮市區"
            required
            error={districtError}
          >
            <Select
              value={district}
              onValueChange={(val) => {
                setDistrict(val)
                handleBlur(val, setDistrictError)
              }}
              placeholder="請選擇鄉鎮市區"
              options={[
                { label: '花蓮市', value: '花蓮市' },
                { label: '吉安鄉', value: '吉安鄉' },
              ]}
              invalid={!!districtError}
            />
          </Field>
          <Field
            className="col-span-2"
            label="完整地址"
            required
            description="無上樓服務，請至一樓取貨，謝謝"
            error={addressError}
          >
            <Input
              value={address}
              disabled={!district}
              placeholder="請輸入路名、巷弄、門牌等"
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => handleBlur(address, setAddressError)}
              invalid={!!addressError}
            />
          </Field>
          <Field
            className="col-span-2"
            label="備註"
          >
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Field>
        </>
      )}
      {/* 合計 */}
      <div className="col-span-2 my-2 rounded-md border p-4 text-sm space-y-2">
        {isShip && (
          <>
            <div className="flex justify-between">
              <span>商品金額</span>
              <span>NT$ {productAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>運費金額</span>
              <span>NT$ {shippingAmount.toLocaleString()}</span>
            </div>
            {pickupMethod === 'ship' && qty > 0 && qty < FREE_SHIPPING_QTY && (
              <p className="text-xs text-red-500">
                滿 {FREE_SHIPPING_QTY} 包(含)享免運優惠
              </p>
            )}

            {pickupMethod === 'ship' && qty >= FREE_SHIPPING_QTY && (
              <p className="text-xs text-muted-foreground">
                已達 {FREE_SHIPPING_QTY} 包，冷凍宅配免運！
              </p>
            )}
            <div className="h-px bg-border" />
          </>
        )}
        <div className="flex text-base justify-between font-semibold">
          <span>總金額</span>
          <span>NT$ {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="col-span-2 flex justify-end">
        <Button
          type="button"
          size="md"
          onClick={handleSubmit}
        >
          送出訂單
        </Button>
      </div>
    </div>
  )
}

export default page