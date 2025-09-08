import prisma from "../../lib/prisma";
import InventoryUploader from "./uploader";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">인벤토리 관리</h1>
      <InventoryUploader products={products} />
    </div>
  );
}
