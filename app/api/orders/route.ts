import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { OrderFormSchema } from "@/lib/validators/order";
import { FieldValue } from "firebase-admin/firestore";

function getTodayStringTaipei() {
  // 用台北時區避免跨日錯誤（server 可能是 UTC）
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}${m}${d}`; // yyyyMMdd
}

function calcTotalAmount(input: { quantity: number; pickupMethod: string }) {
  const UNIT_PRICE = 700;
  const SHIPPING_FEE = 200;
  const FREE_SHIPPING_QTY = 5;

  const qty = Math.max(0, Number(input.quantity) || 0);
  const productAmount = qty * UNIT_PRICE;

  let shippingAmount = 0;
  if (input.pickupMethod === "ship" && qty > 0 && qty < FREE_SHIPPING_QTY) {
    shippingAmount = SHIPPING_FEE;
  }

  return {
    productAmount,
    shippingAmount,
    totalAmount: productAmount + shippingAmount,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = OrderFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", detail: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dateStr = getTodayStringTaipei();
    const counterRef = adminDb.collection("orderCounters").doc(dateStr);
    const ordersCol = adminDb.collection("orders");

    const { productAmount, shippingAmount, totalAmount } = calcTotalAmount({
      quantity: parsed.data.quantity,
      pickupMethod: parsed.data.pickupMethod,
    });

    const result = await adminDb.runTransaction(async (tx) => {
      const counterSnap = await tx.get(counterRef);
      const current = counterSnap.exists ? Number(counterSnap.data()?.value ?? 0) : 0;
      const next = current + 1;

      tx.set(
        counterRef,
        { value: next, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );

      const padded = String(next).padStart(4, "0");
      const orderNo = `${dateStr}-${padded}`;

      const orderRef = ordersCol.doc();

      tx.set(orderRef, {
        ...parsed.data,
        orderNo,
        productAmount,
        shippingAmount,
        totalAmount,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { orderId: orderRef.id, orderNo, totalAmount };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("[api/orders] ERROR:", err);
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
