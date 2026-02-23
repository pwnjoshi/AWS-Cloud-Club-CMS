import { Target, Lightbulb, Users, Award, Briefcase, CheckCircle, Linkedin, Globe, Rocket, Heart, ExternalLink } from 'lucide-react';
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Our Story</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-white animate-slide-up leading-tight tracking-tight">
            Building the Future <br className="hidden md:block" />
            <span className="text-[var(--color-primary)]">on the Cloud</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            We are Graphic Era University's premier student community dedicated to Amazon Web Services. Bridging the gap between theory and practice.
          </p>
        </div>
      </section>

      {/* Story & Stats Section */}
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
            <StatCard icon={<Briefcase className="w-6 h-6 text-[#FFB74D]" />} number="05+" label="Projects Built" />
            <StatCard icon={<Award className="w-6 h-6 text-[#AB47BC]" />} number="Growing" label="Community" />
          </div>
        </div>
      </section>

      {/* Core Values */}
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

      {/* Faculty Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <h2 className="text-3xl font-bold font-display mb-4 text-white">Faculty Leadership</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Supported by the visionary leadership of Graphic Era University.
          </p>
        </div>

        <div className="flex justify-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <div className="w-full max-w-sm">
            <FacultyCard
              name="Dr. Amit Kumar"
              role="Associate Professor"
              details="MIEEE PES | Academician | Data Science | ML | NLP | GenAI | AWS Cloud"
              img="/faculty/dr_amit_kumar.jpg"
              linkedin="https://www.linkedin.com/in/dr-amit-kumar-49694bb9/"
            />
          </div>
        </div>
      </section>

    </div>
  );
}

function StatCard({ icon, number, label }) {
  return (
    <div className="bg-[#0a0e17]/80 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-white/20 hover:bg-[#1e293b]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl">
      <div className="p-3 bg-white/5 rounded-full mb-4">
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

function FacultyCard({ name, role, details, img, linkedin }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0e17]/80 aspect-[4/5] shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 hover:border-white/20">
      <img 
        src={img} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-3 w-fit backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
          {role}
        </div>
        <h3 className="text-2xl font-bold text-white font-display mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {name}
        </h3>
        <p className="text-gray-300 text-sm font-medium mb-4 leading-relaxed">
          {details}
        </p>
        
        {/* Social Links - Reveal on hover */}
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A66C2] hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-md border border-white/5 hover:border-white/20">
              <Linkedin className="w-4 h-4" /> Connect
            </a>
          )}
        </div>
      </div>
    </div>
  );
}