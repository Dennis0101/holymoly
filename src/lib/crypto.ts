// src/lib/crypto.ts
const B64 = (s: string) => Buffer.from(s, "base64");

function getKey(): Buffer {
  const raw = process.env.ACCOUNT_CIPHER_KEY || process.env.CRYPTO_SECRET;
  if (!raw) {
    // 업로드 API에서 이 메세지를 그대로 보여줍니다.
    throw new Error("어카운트 KEY가 없습니다");
  }
  const key = B64(raw);
  if (key.length !== 32) {
    throw new Error("INVALID_CRYPTO_KEY_LENGTH"); // 32바이트 필요(AES-256)
  }
  return key;
}

export function encrypt(plain: string): string {
  const key = getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM 권장
  const cipher = require("crypto").createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // 포맷: base64(iv).base64(tag).base64(cipherText)
  return [
    Buffer.from(iv).toString("base64"),
    tag.toString("base64"),
    enc.toString("base64"),
  ].join(".");
}

export function decrypt(packed: string): string {
  const key = getKey();
  const [ivB64, tagB64, ctB64] = packed.split(".");
  const iv = B64(ivB64);
  const tag = B64(tagB64);
  const ct = B64(ctB64);
  const decipher = require("crypto").createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return dec.toString("utf8");
}
