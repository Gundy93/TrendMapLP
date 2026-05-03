"use client";

import { useEffect, useState } from "react";

const WORDS = ["퍽퍽한 두쫀쿠", "맛없는 우베라떼", "실패한 말랑이"];

export function WordsCycler() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setI((x) => (x + 1) % WORDS.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-zinc-300 transition-opacity duration-500"
      aria-live="polite"
    >
      {WORDS[i]}
    </span>
  );
}
