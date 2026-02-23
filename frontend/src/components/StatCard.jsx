import { Users, Calendar, Award, Code } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const iconMap = {
    users: Users,
    calendar: Calendar,
    award: Award,
    code: Code
};

export default function StatCard({ value, label, icon, delay = 0 }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const IconComponent = iconMap[icon] || Users;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const numericValue = parseInt(value.replace(/\D/g, ''));
        const duration = 2000;
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div
            ref={cardRef}
            className="stat-card-modern"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="stat-icon-wrapper">
                <IconComponent size={32} strokeWidth={2} />
            </div>
            <div className="stat-value">
                {isVisible ? `${count}${value.includes('+') ? '+' : ''}` : '0'}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}
