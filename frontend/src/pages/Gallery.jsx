import { ArrowDown, X, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';

// Dynamically import all images from the src/assets/gallery folder
const imageModules = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });
const galleryImages = Object.values(imageModules).map(module => module.default);

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);

    // Scroll Animation Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Handle body scroll lock when modal is open
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    return (
        <main className="flex-1 bg-[#020617] min-h-screen pb-20">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Gallery</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-white animate-slide-up leading-tight tracking-tight">
                        Our <span className="text-[var(--color-primary)]">Moments</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100 mb-10">
                        Capturing the cloud journey at Graphic Era University. Explore our past events, workshops, and community gatherings that define our spirit.
                    </p>
                </div>
            </section>

            {/* GALLERY GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {galleryImages.map((src, index) => (
                            <div 
                                key={index}
                                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-[#0f172a] border border-white/10 hover:border-[var(--color-primary)]/50 transition-all duration-500 reveal-on-scroll opacity-0 translate-y-10"
                                style={{ transitionDelay: `${(index % 4) * 100}ms` }}
                                onClick={() => setSelectedImage(src)}
                            >
                                <img 
                                    src={src} 
                                    alt={`Gallery Image ${index + 1}`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/20">
                                        <ZoomIn size={24} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center reveal-on-scroll opacity-0 translate-y-10 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <ImageIcon size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 font-display">Gallery Coming Soon</h3>
                        <p className="text-gray-400 max-w-md">
                            We are currently curating our best moments. Drop your images into the <code className="text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded text-sm">src/assets/gallery</code> folder to see them appear here dynamically!
                        </p>
                    </div>
                )}
            </section>

            {/* LIGHTBOX MODAL */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl p-4 sm:p-8 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-full transition-all duration-300 z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X size={24} />
                    </button>
                    
                    <div 
                        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={selectedImage} 
                            alt="Full screen view" 
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-[var(--color-primary)]/20"
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
