import { ArrowDown, RotateCcw, Play, Image as ImageIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function Gallery() {
    // Scroll Animation Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <main style={{ flex: 1 }}>

            {/* HERO */}
            <section className="gallery-hero">
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 className="animate-fade-in" style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', color: 'white' }}>
                        Our Moments
                    </h1>
                    <p className="animate-fade-in delay-100" style={{ fontSize: '1.15rem', color: '#9CA3AF', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Capturing the cloud journey at Graphic Era University. Explore our past events and community gatherings that define our spirit.
                    </p>

                    <button className="btn-secondary animate-fade-in delay-200" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto', padding: '0.8rem 1.5rem', borderRadius: '50px' }}>
                        Explore Gallery <ArrowDown size={18} />
                    </button>
                </div>
            </section>

            {/* FILTERS & GRID */}
            <section className="gallery-container">
                <div className="gallery-inner">

                    {/* TOOLBAR */}
                    <div className="gallery-toolbar">
                        <div className="gallery-filters">
                            <FilterBadge label="All" active />

                            <FilterBadge label="Community" />
                        </div>

                    </div>

                    {/* GALLERY GRID */}
                    {/* Empty State */}
                    <div className="gallery-empty reveal-on-scroll">
                        <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Gallery Coming Soon</h3>
                        <p>We are curating our best moments. Stay tuned!</p>
                    </div>

                </div>
            </section>
        </main>
    );
}

function FilterBadge({ label, active }) {
    return (
        <button className={`filter-badge ${active ? 'active' : ''}`}>
            {label}
        </button>
    )
}
