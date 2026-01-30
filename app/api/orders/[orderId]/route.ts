import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const snap = await adminDb.collection("orders").doc(params.orderId).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data = snap.data();

    // Firestore Timestamp 轉成可序列化（如果你有 createdAt）
    const createdAt =
      data?.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : null;

    return NextResponse.json(
      { order: { id: snap.id, ...data, createdAt } },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
