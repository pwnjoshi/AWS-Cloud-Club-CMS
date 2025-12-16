import { Github, Twitter, Linkedin, MessageCircle, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: '#0B0F17', padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container footer-grid">

                {/* Brand Column */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <img src="/logo.png" alt="AWS Cloud Club GEU" style={{ height: '35px' }} />
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>AWS Cloud Club GEU</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        Empowering students to build, deploy, and scale their ideas on the cloud. Join the revolution.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <SocialIcon href="https://www.instagram.com/awscloudclubgeu/" icon={<Instagram size={20} />} label="Instagram" />
                        <SocialIcon href="https://x.com/awscloudclubgeu" icon={<Twitter size={20} />} label="X" />
                        <SocialIcon href="https://www.linkedin.com/company/aws-cloud-club-geu/" icon={<Linkedin size={20} />} label="LinkedIn" />
                    </div>
                </div>

                {/* Links Columns */}
                <FooterColumn title="Explore">
                    <FooterLink href="/events">Events</FooterLink>
                    <FooterLink href="/gallery">Gallery</FooterLink>
                    <FooterLink href="/resources">Resources</FooterLink>
                    <FooterLink href="/team">Team</FooterLink>
                    <FooterLink href="/blog">Blog</FooterLink>
                </FooterColumn>

                <FooterColumn title="Resources">
                    <FooterLink href="https://www.meetup.com/aws-cloud-club-at-graphic-era/">Meetup</FooterLink>
                    <FooterLink href="https://chat.whatsapp.com/IvCnmpfmJ3BCI6etmQ1i5E">WhatsApp Group</FooterLink>
                </FooterColumn>

                <FooterColumn title="Contact">
                    <FooterLink href="mailto:awscloudclubgeu@gmail.com">awscloudclubgeu@gmail.com</FooterLink>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Graphic Era Deemed to be University, Dehradun
                    </p>
                </FooterColumn>
            </div>

            <div className="container footer-bottom" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4B5563', fontSize: '0.9rem' }}>
                <span>© 2025 AWS Cloud Club GEU. All rights reserved.</span>
                <div className="footer-legal">
                    <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover:text-white">Privacy Policy</a>
                    <a href="https://aws.amazon.com/events/terms/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover:text-white">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, children }) {
    return (
        <div>
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '600' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {children}
            </div>
        </div>
    );
}

function FooterLink({ children, href }) {
    return (
        <a href={href || "#"} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} className="hover:text-white" target={href ? "_blank" : "_self"} rel="noreferrer">
            {children}
        </a>
    );
}

function SocialIcon({ icon, href, label }) {
    return (
        <a href={href} target="_blank" rel="noreferrer" aria-label={label} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s', display: 'inline-flex' }} className="hover:text-white">
            {icon}
        </a>
    );
}
