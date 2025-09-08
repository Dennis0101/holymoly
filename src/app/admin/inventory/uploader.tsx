"use client";
import { useEffect, useState } from "react";

export default function InventoryUploader({
  products,
}: {
  products: { id: string; name: string }[];
}) {
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [lines, setLines] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const load = async (p = page) => {
    const res = await fetch(`/api/admin/inventory?productId=${productId}&page=${p}&pageSize=${pageSize}`);
    const j = await res.json();
    setList(j.items); setTotal(j.total); setPage(j.page);
  };

  useEffect(()=>{ if (productId) load(1); }, [productId]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <select className="border rounded p-2" value={productId} onChange={e=>setProductId(e.target.value)}>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="px-3 py-2 border rounded" onClick={()=>load(1)}>새로고침</button>
      </div>

      <div className="border rounded p-3">
        <div className="text-sm text-gray-500 mb-2">형식 예: <code>email:password</code> 한 줄당 하나</div>
        <textarea className="w-full h-40 border rounded p-2" placeholder={"user1:pass1\nuser2:pass2"} value={lines} onChange={e=>setLines(e.target.value)} />
        <div className="mt-2">
          <button
            className="px-3 py-2 border rounded hover:bg-gray-50"
            onClick={async ()=>{
              if (!lines.trim()) return;
              const res = await fetch("/api/admin/inventory", {
                method: "POST",
                headers: { "Content-Type":"application/json" },
                body: JSON.stringify({ productId, lines })
              });
              if (res.ok) { setLines(""); await load(1); }
              else alert("업로드 실패");
            }}
          >업로드</button>
        </div>
      </div>

      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">계정</th>
              <th className="text-left p-2">상태</th>
              <th className="text-left p-2">할당시각</th>
              <th className="text-left p-2">작업</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a:any)=>(
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.username}</td>
                <td className="p-2">{a.isAllocated ? "할당됨" : "미할당"}</td>
                <td className="p-2">{a.allocatedAt ? new Date(a.allocatedAt).toLocaleString() : "-"}</td>
                <td className="p-2">
                  {!a.isAllocated && (
                    <button className="text-red-600" onClick={async ()=>{
                      if (!confirm("삭제할까요?")) return;
                      await fetch(`/api/admin/inventory?id=${a.id}`, { method:"DELETE" });
                      await load();
                    }}>삭제</button>
                  )}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">항목 없음</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-2">
          <div>총 {total}개</div>
          <div className="flex gap-2">
            <button disabled={page<=1} className="px-2 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p = page-1; load(p); }}>이전</button>
            <button disabled={page*pageSize>=total} className="px-2 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p = page+1; load(p); }}>다음</button>
          </div>
        </div>
      </div>
    </div>
  );
}
