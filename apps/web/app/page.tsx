import { Hero } from "@/components/sections/Hero";
import { Target } from "@/components/sections/Target";
import { Features } from "@/components/sections/Features";
import { SignupForm } from "@/components/sections/SignupForm";

export default function Home() {
  return (
    <div className="flex justify-center bg-zinc-100 min-h-screen">
      <main className="relative w-full max-w-[393px] bg-white shadow-2xl min-h-screen flex flex-col overflow-x-hidden">
        <Hero />
        <Target />
        <Features />
        <SignupForm />
        <footer className="pt-8 pb-16 px-6 border-t border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-300 font-medium">
            © {new Date().getFullYear()} TREND MAP. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </main>
    </div>
  );
}
