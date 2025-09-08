import crypto from "crypto";

const keyHex = process.env.ACCOUNT_ENC_KEY;
if (!keyHex) {
  // 개발/로컬에서만 경고. 배포에서는 꼭 설정하세요.
  console.warn("ACCOUNT_ENC_KEY is not set. Account encryption will fail.");
}
const key = keyHex ? Buffer.from(keyHex, "hex") : crypto.randomBytes(32); // fallback (dev)

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decrypt(b64: string) {
  const raw = Buffer.from(b64, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const enc = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}
