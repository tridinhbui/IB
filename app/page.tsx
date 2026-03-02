import Link from "next/link";
import { ArrowRight, BookOpen, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-finstep-beige text-finstep-brown font-nunito selection:bg-finstep-orange/30 flex flex-col items-center overflow-x-hidden">

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo representation */}
          <div className="flex flex-col items-end -translate-y-1">
            <div className="w-3 h-3 rounded-full bg-finstep-orange mb-[2px] mr-[2px]" />
            <div className="flex items-end gap-[3px]">
              <div className="w-2.5 h-4 bg-finstep-orange rounded-sm" />
              <div className="w-2.5 h-6 bg-finstep-orange rounded-sm" />
              <div className="w-2.5 h-8 bg-finstep-orange rounded-sm" />
            </div>
          </div>
          <span className="font-varela text-3xl font-bold tracking-tight text-finstep-orange ml-1">
            Fin<span className="text-finstep-brown">Step</span>
          </span>
        </div>

        <Link
          href="/login"
          className="font-varela font-semibold text-finstep-brown hover:text-finstep-orange transition-colors duration-200 px-4 py-2"
        >
          Log in
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center relative z-10">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-finstep-orange/10 rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none" />

        {/* Main Headline */}
        <h1 className="font-varela font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight text-finstep-brown mb-6 max-w-5xl">
          Turning finance knowledge into <span className="text-finstep-orange relative inline-block">
            real career progress
            <svg className="absolute w-full h-4 -bottom-1 left-0 text-finstep-lightbrown opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 8 Q 50 12 100 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Subheadline directly below */}
        <p className="text-xl md:text-3xl text-finstep-brown/80 mb-12 max-w-3xl font-light font-varela">
          One step at a time.
        </p>

        {/* Detailed Description */}
        <p className="text-lg md:text-xl text-finstep-brown/70 mb-12 max-w-2xl font-light">
          Master technical concepts, practice interviews, and secure your dream role in investment banking with our structured curriculum.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group font-varela flex items-center justify-center gap-2 bg-finstep-orange text-white text-lg font-bold px-8 py-4 rounded-full hover:bg-finstep-brown transition-all duration-300 shadow-[0_8px_30px_rgb(229,161,82,0.3)] hover:shadow-[0_8px_30px_rgb(122,81,62,0.4)] hover:-translate-y-1 w-full sm:w-auto"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="font-varela flex items-center justify-center gap-2 bg-transparent text-finstep-brown border-2 border-finstep-brown/20 text-lg font-bold px-8 py-4 rounded-full hover:border-finstep-brown/40 hover:bg-finstep-brown/5 transition-all duration-300 w-full sm:w-auto"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="w-full bg-card py-24 px-6 relative border-t-2 border-finstep-beige/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="flex flex-col items-center text-center group cursor-default">
              <div className="w-16 h-16 rounded-2xl bg-finstep-beige flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-finstep-orange/10 group-hover:text-finstep-orange text-finstep-brown/60">
                <BookOpen className="w-8 h-8 transition-colors duration-300 group-hover:text-finstep-orange" />
              </div>
              <h3 className="font-varela text-2xl font-bold mb-3 text-finstep-brown">Structured Learning</h3>
              <p className="text-finstep-brown/70 leading-relaxed max-w-sm">
                Step-by-step curriculum covering accounting, valuation, and modeling. Built to match actual interview difficulty.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group cursor-default">
              <div className="w-16 h-16 rounded-2xl bg-finstep-beige flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-finstep-orange/10 text-finstep-brown/60">
                <Target className="w-8 h-8 transition-colors duration-300 group-hover:text-finstep-orange" />
              </div>
              <h3 className="font-varela text-2xl font-bold mb-3 text-finstep-brown">Targeted Practice</h3>
              <p className="text-finstep-brown/70 leading-relaxed max-w-sm">
                Test your knowledge with realistic technical questions and case studies. Identify and conquer your weak points.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group cursor-default">
              <div className="w-16 h-16 rounded-2xl bg-finstep-beige flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-finstep-orange/10 text-finstep-brown/60">
                <TrendingUp className="w-8 h-8 transition-colors duration-300 group-hover:text-finstep-orange" />
              </div>
              <h3 className="font-varela text-2xl font-bold mb-3 text-finstep-brown">Track Progress</h3>
              <p className="text-finstep-brown/70 leading-relaxed max-w-sm">
                Watch your competence grow. Detailed analytics show exactly where you stand and what to focus on next.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-finstep-brown text-finstep-beige py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-varela text-2xl font-bold tracking-tight text-white opacity-90">
              Fin<span className="text-finstep-orange">Step</span>
            </span>
          </div>
          <p className="text-finstep-beige/60 text-sm">
            © {new Date().getFullYear()} FinStep. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
