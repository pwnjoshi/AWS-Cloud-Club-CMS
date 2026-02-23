import { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';

const teamData = [
  {
    name: 'Pawan Joshi',
    role: 'CAPTAIN',
    subRole: 'Cloud Enthusiast',
    image: '/team/pawan_joshi.jpg',
    category: 'Leadership',
    socials: { linkedin: 'https://www.linkedin.com/in/pwnjoshi/', github: 'https://github.com/pwnjoshi/' }
  },
  {
    name: 'Atishay Jain',
    role: 'VICE CAPTAIN',
    subRole: 'Cloud Enthusiast',
    image: '/team/atishay_jain.jpg',
    category: 'Leadership',
    socials: { linkedin: '#', github: '#' }
  }
];

const filters = ['All Members', 'Core Team', 'Technical Leads', 'Creative Leads', 'Operations'];

export default function Team() {
  const [activeFilter, setActiveFilter] = useState('All Members');

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

  const faculty = teamData.filter(m => m.category === 'Faculty');
  const leadership = teamData.filter(m => m.category === 'Leadership');
  const core = teamData.filter(m => m.category !== 'Faculty' && m.category !== 'Leadership');

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
            <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Meet The Team</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-white animate-slide-up leading-tight tracking-tight">
            The Minds Behind <br className="hidden md:block" />
            <span className="text-[var(--color-primary)]">Cloud Innovation</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            A collective of passionate students, developers, and cloud enthusiasts driving the AWS community forward at Graphic Era University.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 mt-12">
        
        {/* Faculty Coordinator */}
        {faculty.length > 0 && (
          <section className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-3">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white font-display tracking-wide">Faculty Coordinator</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map((member, idx) => (
                <TeamCard key={idx} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Club Leadership */}
        {leadership.length > 0 && (
          <section className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-3">
              <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white font-display tracking-wide">Club Leadership</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((member, idx) => (
                <TeamCard key={idx} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Core Team */}
        {core.length > 0 && (
          <section className="reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white font-display tracking-wide">Core Team</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {core.map((member, idx) => (
                <TeamCard key={idx} member={member} />
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}

function TeamCard({ member }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0e17]/80 aspect-[4/5] shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 hover:border-white/20">
      <img 
        src={member.image} 
        alt={member.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2 w-fit backdrop-blur-md">
          <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]"></span>
          {member.role}
        </div>
        <h3 className="text-lg font-bold text-white font-display mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {member.name}
        </h3>
        <p className="text-gray-400 text-xs font-medium mb-3">
          {member.subRole}
        </p>
        
        {/* Social Links - Reveal on hover */}
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {member.socials?.linkedin && (
            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {member.socials?.github && (
            <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {member.socials?.twitter && (
            <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


