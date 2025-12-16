import { ArrowDown, RotateCcw, Play } from 'lucide-react';

export default function Gallery() {
    return (
        <main style={{ flex: 1 }}>

            {/* HERO */}
            <section style={{
                padding: '8rem 2rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, #1A2332 0%, #0F1520 70%)',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', color: 'white' }}>
                        Our Moments
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#9CA3AF', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Capturing the cloud journey at Graphic Era University. Explore our past events, workshops, hackathons, and community gatherings that define our spirit.
                    </p>

                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto', padding: '0.8rem 1.5rem', borderRadius: '50px' }}>
                        Explore Gallery <ArrowDown size={18} />
                    </button>
                </div>
            </section>

            {/* FILTERS & GRID */}
            <section style={{ padding: '4rem 2rem', background: '#0F1520' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* TOOLBAR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <FilterBadge label="All" active />
                            <FilterBadge label="Workshops" />
                            <FilterBadge label="Hackathons" />
                            <FilterBadge label="Community" />
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                            Sort by: <span style={{ color: 'white', fontWeight: '600' }}>Newest First</span>
                        </div>
                    </div>

                    {/* GALLERY GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        <GalleryItem img="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80" />
                        <GalleryItem img="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80" video />
                        <GalleryItem img="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" />
                        <GalleryItem img="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" />
                        <GalleryItem img="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" />
                        <GalleryItem img="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80" />
                        <GalleryItem img="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80" />
                        <GalleryItem img="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" />
                    </div>

                    {/* LOAD MORE */}
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                            Load More Memories <RotateCcw size={16} />
                        </button>
                    </div>

                </div>
            </section>
        </main>
    );
}

function FilterBadge({ label, active }) {
    return (
        <button style={{
            background: active ? 'var(--aws-blue)' : '#1E293B',
            color: active ? 'white' : '#9CA3AF',
            border: 'none',
            padding: '0.5rem 1.25rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}>
            {label}
        </button>
    )
}

function GalleryItem({ img, video }) {
    return (
        <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '1',
            cursor: 'pointer',
            group: 'true'
        }}>
            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', opacity: 0, transition: 'opacity 0.3s' }} className="hover-overlay"></div>
            {video && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play fill="white" color="white" size={24} style={{ marginLeft: '4px' }} />
                </div>
            )}
        </div>
    )
}
