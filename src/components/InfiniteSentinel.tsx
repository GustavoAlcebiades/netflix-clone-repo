import { useEffect, useRef } from "react";

export default function InfiniteSentinel({
  onVisible, disabled,
}: { onVisible: () => void; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) onVisible();
    }, { rootMargin: "300px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onVisible, disabled]);

  return <div ref={ref} style={{ height: 1 }} />;
}
