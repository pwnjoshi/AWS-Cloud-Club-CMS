import { Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: '#0B0F17', padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem' }}>

                {/* Brand Column */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--aws-smile-orange)', borderRadius: '6px' }}></div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>AWS Cloud Club GEU</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        Empowering students to build, deploy, and scale their ideas on the cloud. Join the revolution.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <SocialIcon href="https://www.instagram.com/awscloudclubgeu/" icon={<MessageCircle size={20} />} label="Instagram" />
                        <SocialIcon href="https://x.com/awscloudclubgeu" icon={<Twitter size={20} />} label="X" />
                        <SocialIcon href="https://www.linkedin.com/company/aws-cloud-club-geu/" icon={<Linkedin size={20} />} label="LinkedIn" />
                        <SocialIcon href="https://github.com/" icon={<Github size={20} />} label="GitHub" />
                    </div>
                </div>

                {/* Links Columns */}
                <FooterColumn title="Explore">
                    <FooterLink>Events</FooterLink>
                    <FooterLink>Projects</FooterLink>
                    <FooterLink>Blog</FooterLink>
                    <FooterLink>Team</FooterLink>
                </FooterColumn>

                <FooterColumn title="Resources">
                    <FooterLink>AWS Documentation</FooterLink>
                    <FooterLink>Cloud Skills Boost</FooterLink>
                    <FooterLink href="https://chat.whatsapp.com/IvCnmpfmJ3BCI6etmQ1i5E">WhatsApp Group</FooterLink>
                    <FooterLink>GitHub Repo</FooterLink>
                    <FooterLink>Discord Community</FooterLink>
                </FooterColumn>

                <FooterColumn title="Contact">
                    <FooterLink>awscloudclub@geu.ac.in</FooterLink>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Graphic Era Deemed to be University, Dehradun
                    </p>
                </FooterColumn>
            </div>

            <div style={{ maxWidth: '1200px', margin: '3rem auto 0', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: '#4B5563', fontSize: '0.9rem' }}>
                <span>© 2024 AWS Cloud Club GEU. All rights reserved.</span>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
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
