"use client";

import { useState, useEffect } from "react";

export function YearDisplay() {
  const [year, setYear] = useState(() => 2024);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear((prev) => new Date().getFullYear());
  }, []);

  return <span>{year}</span>;
}