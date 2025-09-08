import prisma from "./prisma";

export async function sendDiscordPurchaseLog(payload: {
  userEmail?: string;
  userId: string;
  productName: string;
  orderId: string;
}) {
  const setting = await prisma.setting.findUnique({ where: { id: 1 } });
  const url = setting?.discordWebhookUrl || process.env.DISCORD_DEFAULT_WEBHOOK;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "🧾 새로운 구매",
        description: [
          `**상품:** ${payload.productName}`,
          `**주문ID:** ${payload.orderId}`,
          `**구매자:** ${payload.userEmail ?? payload.userId}`
        ].join("\n")
      }]
    })
  });
}
