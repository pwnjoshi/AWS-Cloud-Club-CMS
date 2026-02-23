import { ExternalLink, BookOpen, ArrowRight } from 'lucide-react';

export default function Blog() {
  return (
    <main className="flex-1 bg-[#020617] min-h-screen selection:bg-[var(--color-primary)] selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 overflow-hidden min-h-screen flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center justify-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Knowledge Hub</span>
          </div>

          <div className="relative mb-8 animate-fade-in">
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-2xl rounded-full"></div>
            <div className="relative bg-[#0a0e17] border border-white/10 p-5 rounded-2xl shadow-2xl shadow-black/50">
              <BookOpen size={48} className="text-[var(--color-primary)]" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-white animate-slide-up leading-tight tracking-tight">
            Club Blog & <span className="text-[var(--color-primary)]">Articles</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100 mb-12">
            Dive into our latest technical articles, step-by-step tutorials, and club updates. Written by students, for students, on our official AWS Community Builder Profile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
            <a
              href="https://builder.aws.com/community/@pawanjoshidev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold shadow-lg shadow-white/5 transition-all hover:-translate-y-0.5 text-center"
            >
              Read on AWS Community <ExternalLink size={18} />
            </a>
            <a
              href="https://dev.to/pwnjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-lg font-semibold transition-all text-center group"
            >
              Explore Dev.to <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
