"use client";
import { useEffect, useRef, useState } from "react";
export default function Reveal({ children, className = "" }) {
  const ref = useRef(null); const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}>{children}</div>;
}
