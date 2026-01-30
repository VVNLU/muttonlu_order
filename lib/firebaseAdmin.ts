import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const raw = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");

  const json = JSON.parse(raw);

  // private_key 常會被存成包含 \n 的字串，這裡轉回真正換行
  if (json.private_key) {
    json.private_key = json.private_key.replace(/\\n/g, "\n");
  }
  return json;
}

export const adminApp =
  getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(getServiceAccount()),
      });

export const adminDb = getFirestore(adminApp);
