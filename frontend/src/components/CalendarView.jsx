import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { authenticatedFetch } from '../api';

export default function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        // Fetch events (using generic events endpoint for now)
        // In a real app, you'd filter by range ?start=...&end=...
        fetchEvents();
    }, [currentMonth]);

    const fetchEvents = async () => {
        try {
            const res = await authenticatedFetch('/api/events/');
            if (res.ok) {
                setEvents(await res.json());
            }
        } catch (e) {
            console.error(e);
        }
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--aws-squid-ink)' }}>
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={prevMonth} style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white' }}><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white' }}><ChevronRight size={20} /></button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#9CA3AF' }}>
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {days.map(day => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start_time), day));
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toString()}
                            style={{
                                minHeight: '100px',
                                border: '1px solid #F3F4F6',
                                borderRadius: '8px',
                                padding: '0.5rem',
                                background: isCurrentMonth ? 'white' : '#F9FAFB',
                                color: isCurrentMonth ? 'inherit' : '#D1D5DB',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                fontWeight: isToday ? 'bold' : 'normal',
                                color: isToday ? 'var(--aws-smile-orange)' : 'inherit',
                                marginBottom: '0.5rem'
                            }}>
                                {format(day, dateFormat)}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {dayEvents.map(ev => (
                                    <div key={ev.id} style={{
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.4rem',
                                        borderRadius: '4px',
                                        background: '#E0F2FE',
                                        color: '#0073BB',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        cursor: 'pointer'
                                    }} title={ev.title}>
                                        {ev.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="btn-primary" style={{ borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Schedule Event
                </button>
            </div>
        </div>
    );
}
