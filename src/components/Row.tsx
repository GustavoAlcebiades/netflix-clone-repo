import { ReactNode, useRef } from "react";

export default function Row({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className="section">
      <div className="title">
        <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="icon-btn" onClick={() => scroll(-600)}>◀</button>
          <button className="icon-btn" onClick={() => scroll(600)}>▶</button>
        </div>
      </div>
      <div className="scroller">
        <div ref={ref} className="row">{children}</div>
      </div>
    </section>
  );
}
