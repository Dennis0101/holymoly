import prisma from "./prisma";

export async function sendDiscordPurchaseLog(payload: {
  userEmail?: string;
  userId: string;
  productName: string;
  orderId: string;
  price?: number;
  accountId?: string;
  imageUrl?: string;      // 전달되면 우선 사용
  thumbnailUrl?: string;
}) {
  const setting = await prisma.setting.findUnique({ where: { id: 1 } });
  const url = setting?.discordWebhookUrl || process.env.DISCORD_DEFAULT_WEBHOOK;
  if (!url) return;

  const imageUrl = payload.imageUrl || setting?.discordImageUrl || undefined;

  const embed = {
    title: "✨ 구매 완료 ✨",
    description: "구매해주셔서 감사합니다 😊",
    color: 0x3b82f6,
    timestamp: new Date().toISOString(),
    fields: [
      { name: "구매자", value: payload.userEmail ?? payload.userId, inline: false },
      { name: "구매 상품", value: payload.productName, inline: false },
      ...(payload.price ? [{ name: "금액", value: `${payload.price.toLocaleString()}원`, inline: true }] : []),
      { name: "주문 ID", value: payload.orderId, inline: true },
      ...(payload.accountId ? [{ name: "아이디", value: payload.accountId, inline: false }] : []),
    ],
    thumbnail: payload.thumbnailUrl ? { url: payload.thumbnailUrl } : undefined,
    image: imageUrl ? { url: imageUrl } : undefined,   // 👈 크게 표시
    footer: { text: "Account Shop" },
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}
