import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, CloudLightning, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 md:py-20 bg-[#020617] border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center group">
              <img src="/logo.png" alt="AWS Cloud Club GEU" className="h-20 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering the next generation of cloud builders at Graphic Era University. Learn, build, and innovate with the power of AWS.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialIcon href="https://github.com/aws-cloud-club-geu" icon={<Github size={18} />} label="GitHub" />
              <SocialIcon href="https://x.com/awscloudclubgeu" icon={<Twitter size={18} />} label="X (Twitter)" />
              <SocialIcon href="https://www.linkedin.com/company/aws-cloud-club-geu/" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialIcon href="https://www.instagram.com/awscloudclubgeu/" icon={<Instagram size={18} />} label="Instagram" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-white font-bold mb-6 text-base border-l-2 border-[var(--color-primary)] pl-3">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/events">Events & Workshops</FooterLink>
              <FooterLink to="/team">Our Team</FooterLink>
              <FooterLink to="/blog">Tech Blog</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base border-l-2 border-[var(--color-primary)] pl-3">Connect With Us</h3>
            <ul className="space-y-3">
              <ExternalFooterLink href="https://linktr.ee/awscloudclubgeu">Linktree (All Links)</ExternalFooterLink>
              <ExternalFooterLink href="https://www.meetup.com/aws-cloud-club-at-graphic-era/">Meetup</ExternalFooterLink>
              <ExternalFooterLink href="https://chat.whatsapp.com/IvCnmpfmJ3BCI6etmQ1i5E">WhatsApp Group</ExternalFooterLink>
              <ExternalFooterLink href="https://discord.gg/c36ftreuWW">Discord</ExternalFooterLink>
              <ExternalFooterLink href="https://www.youtube.com/@AWSCloudClubGEU">YouTube</ExternalFooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base border-l-2 border-[var(--color-primary)] pl-3">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-md bg-white/5 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                  <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                </div>
                <a href="mailto:awscloudclubgeu@gmail.com" className="text-gray-400 text-sm hover:text-white transition-colors pt-1">
                  awscloudclubgeu@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-md bg-white/5 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                </div>
                <span className="text-gray-400 text-sm pt-1">
                  Graphic Era Deemed to be University,<br />
                  Dehradun, Uttarakhand, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-xs text-center md:text-left flex flex-col md:flex-row gap-2 md:items-center">
            <p>&copy; {currentYear} AWS Cloud Club at Graphic Era University.</p>
            <span className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></span>
            <p>Led by <span className="font-medium text-gray-400">Cloud Captain Pawan Joshi</span></p>
          </div>
          <div className="flex gap-6 text-xs font-medium text-gray-500">
            <a href="https://aws.amazon.com/privacy/" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
            <a href="https://aws.amazon.com/events/terms/" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, label }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 bg-white/5 border border-white/5 rounded-md hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm flex items-center gap-2 group w-fit"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50 group-hover:bg-[var(--color-primary)] transition-colors"></span>
        <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
      </Link>
    </li>
  );
}

function ExternalFooterLink({ href, children }) {
  return (
    <li>
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer" 
        className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm flex items-center gap-2 group w-fit"
      >
        <ExternalLink size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[var(--color-primary)]" />
        <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
      </a>
    </li>
  );
}
