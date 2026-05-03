import { Hero } from "@/components/sections/Hero";
import { Values } from "@/components/sections/Values";
import { Demo } from "@/components/sections/Demo";
import { FAQ } from "@/components/sections/FAQ";
import { SignupForm } from "@/components/sections/SignupForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Values />
      <Demo />
      <FAQ />
      <SignupForm />
      <footer className="px-6 py-10 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} TrendMap. All rights reserved.
      </footer>
    </main>
  );
}
