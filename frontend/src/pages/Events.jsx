import { Calendar, MapPin, Clock, ArrowRight, X, Info, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EVENTS } from '../data/mockData';

export default function Events() {
    const [events] = useState(EVENTS);
    const [selectedEvent, setSelectedEvent] = useState(null);

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

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedEvent]);

    const showModal = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="relative w-full bg-[#020617] selection:bg-[var(--color-primary)] selection:text-white pb-20 min-h-screen">
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-16  overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Join Us</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-white animate-slide-up leading-tight tracking-tight">
                        Upcoming <span className="text-[var(--color-primary)]">Events</span>
                    </h1>
                    
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
                        Join workshops, hackathons, and meetups designed to level up your cloud skills and connect with fellow builders.
                    </p>
                </div>
            </section>

            {/* Events Grid */}
            <section className="max-w-7xl mx-auto pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 relative z-10">
                {events.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} onDetails={() => showModal(event)} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Calendar className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white font-display mb-2">No upcoming events</h3>
                        <p className="text-gray-400 max-w-md">We're currently planning our next big thing. Check back later for new workshops and sessions!</p>
                    </div>
                )}
            </section>

            {/* EVENT DETAILS MODAL */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-2xl bg-[#0a0e17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                        <button 
                            onClick={closeModal} 
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Header */}
                        <div className="relative h-48 sm:h-64 shrink-0">
                            <img 
                                src={selectedEvent.image} 
                                alt={selectedEvent.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] to-transparent"></div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-4">
                                {selectedEvent.start_time === "TBA" ? "Coming Soon" : "Scheduled"}
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-6 leading-tight">
                                {selectedEvent.title}
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold">Date</div>
                                        <div className="font-medium">
                                            {selectedEvent.start_time === "TBA" ? "TBA" : new Date(selectedEvent.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Clock className="w-5 h-5 text-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold">Time</div>
                                        <div className="font-medium">
                                            {selectedEvent.start_time === "TBA" ? "TBA" : new Date(selectedEvent.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 sm:col-span-2">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <MapPin className="w-5 h-5 text-[#FFB74D]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold">Location</div>
                                        <div className="font-medium">{selectedEvent.location}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-3">About this event</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {selectedEvent.description || "Join us for this exciting event! More details will be announced soon."}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto pt-4 border-t border-white/10">
                                {selectedEvent.registration_link ? (
                                    <a
                                        href={selectedEvent.registration_link.startsWith('http') ? selectedEvent.registration_link : `https://${selectedEvent.registration_link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 hover:-translate-y-0.5"
                                    >
                                        Register Now <ExternalLink className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <button disabled className="w-full py-4 bg-white/5 text-gray-500 rounded-xl font-bold cursor-not-allowed border border-white/5 flex items-center justify-center gap-2">
                                        Registration Closed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EventCard({ event, onDetails }) {
    return (
        <div className="group flex flex-col h-full bg-[#0a0e17]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-[#1e293b]/40 transition-all duration-500 hover:-translate-y-1 shadow-xl">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] to-transparent opacity-80"></div>
                
                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                    {event.start_time === "TBA" ? "TBA" : new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-bold text-white font-display mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-[var(--color-accent)]" />
                        <span>{event.start_time === "TBA" ? "Time: TBA" : new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-[#FFB74D]" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-4 border-t border-white/5">
                    <button
                        onClick={onDetails}
                        className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        View Details <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
