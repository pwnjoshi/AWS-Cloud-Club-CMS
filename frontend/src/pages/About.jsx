import { Target, Lightbulb, Users, Award, Briefcase, CheckCircle, Linkedin, Globe, Rocket, Heart, ExternalLink, Quote } from 'lucide-react';
import { useEffect } from 'react';

export default function About() {
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
    <div className="relative w-full bg-[#020617] selection:bg-[var(--color-primary)] selection:text-white pb-20 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Since 2025</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display mb-8 text-white animate-slide-up leading-tight tracking-tight">
            Building the Future <br className="hidden md:block" />
            <span className="text-[var(--color-primary)]">on the Cloud</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            We are Graphic Era University's premier student community dedicated to Amazon Web Services. Bridging the gap between theory and practice.
          </p>
        </div>
      </section>

      {/* Story & Stats Section - Reverted to Original Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-3">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white font-display tracking-wide">Who We Are</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              <strong className="text-white">Founded in 2025</strong>, AWS Cloud Club GEU is a student-led initiative dedicated to mastering Amazon Web Services. We bridge the gap between theory and practice, empowering builders to create real-world cloud solutions.
            </p>
            <p className="text-gray-400 leading-relaxed">
              More than just a club, we are a movement. Whether you're a beginner writing your first Lambda function or a pro architecting serverless applications, join us to innovate, hack, and grow your career with the power of the Cloud.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <StatCard icon={<Users className="w-6 h-6 text-[var(--color-primary)]" />} number="300+" label="Active Members" />
            <StatCard icon={<Rocket className="w-6 h-6 text-[var(--color-accent)]" />} number="2025" label="Founded" />
            <StatCard icon={<Briefcase className="w-6 h-6 text-[#FFB74D]" />} number="Loading..." label="Upcoming Projects" />
            <StatCard icon={<Award className="w-6 h-6 text-[#AB47BC]" />} number="Growing" label="Community" />
          </div>
        </div>
      </section>

      {/* Core Values - Reverted to Original Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <h2 className="text-3xl font-bold font-display mb-4 text-white">Our Core Values</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The principles that guide every workshop, event, and hackathon we organize.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            <ValueCard 
              icon={<Lightbulb className="w-8 h-8 text-[var(--color-primary)]" />}
              title="Innovation" 
              desc="We constantly push boundaries and explore the latest in cloud tech, from Serverless to AI/ML." 
            />
          </div>
          <div className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
            <ValueCard 
              icon={<Heart className="w-8 h-8 text-[var(--color-accent)]" />}
              title="Community" 
              desc="We grow together. Every member is both a learner and a mentor in our peer-to-peer ecosystem." 
            />
          </div>
          <div className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
            <ValueCard 
              icon={<Target className="w-8 h-8 text-[#AB47BC]" />}
              title="Excellence" 
              desc="We strive for high standards in our projects, certifications, and technical skills." 
            />
          </div>
        </div>
      </section>

      {/* Leadership Section - Revised Design to match theme */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-bold font-display mb-4 text-white">Leadership Vision</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Guided by visionary faculty and driven by passionate student leaders.
            </p>
        </div>

        <div className="space-y-12">
            {/* Faculty Block */}
            <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-10 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 bg-[#0a0e17]/80">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <img 
                        src="/faculty/dr_amit_kumar.jpg" 
                        alt="Dr. Amit Kumar" 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#0a0e17] shadow-lg shrink-0"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800' }}
                    />
                    <div className="text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2 justify-center md:justify-start">
                            <h3 className="text-2xl font-bold text-white font-display">Dr. Amit Kumar</h3>
                            <span className="text-[var(--color-primary)] font-bold tracking-wider text-xs border border-[var(--color-primary)]/20 px-2 py-0.5 rounded uppercase">Professor</span>
                        </div>
                        <p className="text-gray-300 italic mb-4">"MIEEE PES | Academician | Data Science | ML | NLP | GenAI | AWS Cloud"</p>
                        <p className="text-gray-400 leading-relaxed max-w-3xl">
                             The backbone of our technical excellence. Dr. Kumar provides the strategic academic direction ensuring our club remains at the forefront of technological innovation and pedagogical standards at GEU.
                        </p>
                    </div>
                </div>
            </div>

            {/* Captain Block */}
            <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-10 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 bg-[#0a0e17]/80">
                 <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
                    <div className="flex-1 text-center md:text-left">
                         <div className="mb-4">
                             <Quote className="w-8 h-8 text-[var(--color-primary)] opacity-50 mx-auto md:mx-0 mb-2" />
                             <h3 className="text-xl md:text-3xl font-bold text-white font-display leading-tight">
                                "Empowering the Next Generation of <span className="text-[var(--color-primary)]">Cloud Architects</span>."
                             </h3>
                         </div>
                         <p className="text-gray-400 leading-relaxed mb-6">
                                Welcome to the AWS Cloud Club at Graphic Era University. Our mission is concise but ambitious: to forge a community of cloud-native builders ready to lead the industry. We are here to learn, fail, and succeed—together.
                         </p>
                         <div className="flex items-center gap-3 justify-center md:justify-start border-t border-white/5 pt-4">
                            <div>
                                <p className="text-white font-bold">Pawan Joshi</p>
                                <p className="text-gray-500 text-sm">Cloud Captain, GEU Chapter</p>
                            </div>
                         </div>
                    </div>
                    <div className="shrink-0">
                         <img 
                            src="/team/pawan_joshi.jpg" 
                            alt="Pawan Joshi" 
                            className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover border-2 border-white/10 shadow-2xl rotate-3 md:rotate-0"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=800' }}
                         />
                    </div>
                 </div>
            </div>
        </div>
      </section>

    </div>
  );
}

// Components matching Home.jsx theme
function StatCard({ icon, number, label }) {
  return (
    <div className="bg-[#0a0e17]/80 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-white/20 hover:bg-[#1e293b]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
      <div className="p-3 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white font-display mb-1">{number}</div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="bg-[#0a0e17]/80 border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 hover:bg-[#1e293b]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl group">
      <div className="p-4 bg-white/5 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white font-display mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
