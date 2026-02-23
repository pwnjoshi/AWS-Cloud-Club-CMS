import { ArrowRight, Calendar, Users, Zap, Terminal, Trophy, Rocket, Target, ChevronRight, ExternalLink, BookOpen } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full bg-[#020617] selection:bg-[var(--color-primary)] selection:text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full  ">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <a href="/assets/handbook.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer animate-fade-in group">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">Read the Official Club Handbook</span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold font-display animate-slide-up leading-tight tracking-tight text-white">
                Learn. Build. Network. <br />
                <span className="text-[var(--color-primary)]">Be Cloud Ready.</span>
              </h1>
              
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed animate-slide-up delay-100">
                Join the premier community for cloud enthusiasts at Graphic Era University (GEU). Master AWS, ship scalable projects, and fast-track your career.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
                <a 
                   href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold shadow-lg shadow-white/5 transition-all hover:-translate-y-0.5 text-center text-sm flex items-center justify-center gap-2"
                >
                  Join the Club <ExternalLink className="w-4 h-4" />
                </a>
                <Link to="/events" className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all text-center flex items-center justify-center gap-2 group text-sm">
                  <Calendar className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors" />
                  <span>Upcoming Events</span>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 animate-slide-up delay-300">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#020617] bg-gray-700 overflow-hidden">
                       <img src={`https://randomuser.me/api/portraits/thumb/men/${i}.jpg`} alt="Member" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-2 border-[#020617] bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white">
                    +300
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white">300+ Members</span>
                  <span className="text-xs">Growing community</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-in delay-200">
              <div className="relative glass-panel rounded-lg border border-white/10 bg-[#0a0e17]/80 shadow-2xl shadow-black/50 overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5252]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#66BB6A]"></div>
                  </div>
                  <div className="text-gray-500 text-[10px] font-mono">aws-cli — bash — 80x24</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-3 font-light leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-[var(--color-primary)] font-bold">➜</span>
                    <span className="text-[var(--color-accent)] font-bold">~</span>
                    <span className="text-gray-300">aws cloud-club init --region geu</span>
                  </div>
                  <div className="text-gray-500 pl-4">Initializing new chapter environment...</div>
                  <div className="text-gray-500 pl-4">Allocating resources [██████████] 100%</div>
                  <div className="text-emerald-400 pl-4">✓ Cloud Club GEU successfully deployed</div>
                  
                  <div className="flex gap-2 mt-4">
                     <span className="text-[var(--color-primary)] font-bold">➜</span>
                     <span className="text-[var(--color-accent)] font-bold">~</span>
                     <span className="text-gray-300">aws cloud-club info</span>
                  </div>
                  <div className="pl-4 text-gray-300 font-mono text-sm leading-relaxed">
                    <div className="flex gap-2"><span className="text-[var(--color-primary)]">Region:</span> <span>ap-south-1</span></div>
                    <div className="flex gap-2"><span className="text-[var(--color-primary)]">Status:</span> <span className="text-emerald-400">Active</span></div>
                    <div className="flex gap-2"><span className="text-[var(--color-primary)]">Mission:</span> <span>Learn. Build. Network.</span></div>
                  </div>

                  <div className="flex gap-2 animate-pulse mt-4">
                    <span className="text-[var(--color-primary)] font-bold">➜</span>
                    <span className="text-[var(--color-accent)] font-bold">~</span>
                    <span className="w-2 h-5 bg-gray-500 block"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Handbook Section */}
      <section className="py-12 md:py-16 relative z-20 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#1e293b]/40 border border-white/10 rounded-2xl p-8 lg:p-12 backdrop-blur-md">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-4">
                New Release
              </div>
              <h2 className="text-3xl font-bold font-display mb-4 text-white">AWS Cloud Club GEU Handbook</h2>
              <p className="text-gray-400 text-lg mb-6">
                Everything you need to know about our community, core values, learning paths, and how you can make the most out of your cloud journey with us.
              </p>
              <a 
                href="/assets/handbook.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-all hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" /> Read the Handbook
              </a>
            </div>
            <div className="relative w-full max-w-sm hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-[#0f111a] border border-white/10 rounded-xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[3/4] bg-[#1e293b] rounded-lg flex items-center justify-center border border-white/5 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <a href="/assets/handbook.pdf" target="_blank" rel="noopener noreferrer" className="p-4 bg-white text-black rounded-full transform scale-75 group-hover:scale-100 transition-transform">
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                  <div className="text-center p-6">
                    <BookOpen className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4 opacity-50" />
                    <div className="text-xl font-bold text-white font-display">Official Handbook</div>
                    <div className="text-sm text-gray-500 mt-2">AWS Cloud Club GEU</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Highlight Section */}
      <section className="py-20 relative z-20 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4 text-white">Guided by Experts</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the visionaries leading the AWS Cloud Club at Graphic Era University.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Faculty Coordinator */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex items-center gap-6 bg-[#0a0e17]/80 hover:bg-[#1e293b]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
              <img 
                src="/faculty/dr_amit_kumar.jpg" 
                alt="Dr. Amit Kumar" 
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-primary)]/50"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800' }}
              />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] mb-1">Faculty Coordinator</div>
                <h3 className="text-xl font-bold text-white font-display">Dr. Amit Kumar</h3>
                <p className="text-sm text-gray-400 mt-1">Associate Professor</p>
              </div>
            </div>

            {/* Cloud Captain */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex items-center gap-6 bg-[#0a0e17]/80 hover:bg-[#1e293b]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
              <img 
                src="/team/pawan_joshi.jpg" 
                alt="Pawan Joshi" 
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-accent)]/50"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=800' }}
              />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-1">Cloud Captain</div>
                <h3 className="text-xl font-bold text-white font-display">Pawan Joshi</h3>
                <p className="text-sm text-gray-400 mt-1">Cloud Enthusiast</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors group">
              Meet the entire core team <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Commented out for launch phase
      <section className="py-12 border-y border-white/5 bg-white/[0.02] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard label="Active Members" value="500+" icon={<Users className="w-5 h-5 text-[var(--color-primary)]" />} />
            <StatCard label="Workshops" value="20+" icon={<Terminal className="w-5 h-5 text-[var(--color-accent)]" />} />
            <StatCard label="Certifications" value="50+" icon={<Trophy className="w-5 h-5 text-[#FFB74D]" />} />
            <StatCard label="Projects Shipped" value="10+" icon={<Rocket className="w-5 h-5 text-[#AB47BC]" />} />
          </div>
        </div>
      </section>
      */}

      {/* Mission Section */}
      <section className="py-12 md:py-20 relative overflow-hidden reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">Why Join AWS Cloud Club?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide a platform for students to learn, build, and grow their cloud computing skills through hands-on experience and mentorship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Terminal className="w-6 h-6 text-white" />}
              title="Hands-on Workshops"
              description="Get your hands dirty with real AWS services. From EC2 to Lambda, we cover it all through practical sessions."
              color="from-[var(--color-accent)] to-[#42A5F5]"
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-white" />}
              title="Networking"
              description="Connect with industry experts, AWS Community Builders, and like-minded peers to grow your professional network."
              color="from-[var(--color-primary)] to-[#FFA726]"
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6 text-white" />}
              title="Career Growth"
              description="Get guidance on AWS certifications, internships, and career paths in cloud computing."
              color="from-[#AB47BC] to-[#CE93D8]"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 md:py-20 relative reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-display mb-2">Upcoming Events</h2>
              <p className="text-gray-400">Mark your calendars for our next sessions</p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:gap-3 transition-all text-sm">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-1 max-w-2xl mx-auto gap-6">
            <EventCard 
              title="CLOUD IGNITE ’26"
              subtitle="AWS Cloud Club GEU – Inaugural Experience"
              date="March 25, 2026"
              image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200"
              tag="Flagship Event"
              link="https://www.meetup.com/aws-cloud-club-at-graphic-era/"
            />
          </div>
          
          <div className="mt-8 md:hidden text-center">
            <Link to="/events" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>




    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors group">
      <div className="mb-4 bg-[var(--color-secondary)] p-3 rounded-lg w-fit shadow-inner border border-white/5">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1 font-display tracking-tight">{value}</div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="card-hover p-8 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}></div>
      <div className="mb-6 p-4 rounded-lg bg-[var(--color-secondary)] w-fit shadow-lg shadow-black/20 border border-white/5 relative z-10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-display relative z-10">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm relative z-10">
        {description}
      </p>
    </div>
  );
}

function EventCard({ title, subtitle, date, image, tag, link }) {
  return (
    <div className="group rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-[var(--color-primary)]/30 transition-all hover:-translate-y-1">
       <div className="h-64 overflow-hidden relative">
         <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
         <div className="absolute top-4 left-4 px-3 py-1 bg-[#0f111a]/80 backdrop-blur-md rounded-md text-xs font-semibold border border-white/10 text-white shadow-lg">
           {tag}
         </div>
       </div>
       <div className="p-6">
         <div className="flex items-center gap-2 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wide mb-3">
           <Calendar className="w-3 h-3" />
           {date}
         </div>
         <h3 className="text-2xl font-bold mb-1 group-hover:text-[var(--color-primary)] transition-colors leading-snug">{title}</h3>
         {subtitle && <p className="text-gray-400 text-sm mb-2">{subtitle}</p>}
         <a href={link || "/events"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 mt-4 group/link cursor-pointer font-medium hover:text-white transition-colors w-fit">
           Register Now <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
         </a>
       </div>
    </div>
  );
}
