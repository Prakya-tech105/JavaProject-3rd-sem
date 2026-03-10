import { useEffect, useRef, useState } from 'react';

interface TimePickerProps {
    value: string; // "HH:mm" 24-hour format
    onChange: (value: string) => void;
    onClose: () => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const AM_PM: ('AM' | 'PM')[] = ['AM', 'PM'];

export default function TimePicker({ value, onChange, onClose }: TimePickerProps) {
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

    // ref to detect click outside
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse initial value "HH:mm"
        if (value) {
            const [h, m] = value.split(':').map(Number);
            let parsedHour = h % 12;
            if (parsedHour === 0) parsedHour = 12;
            setHour(parsedHour);
            setMinute(m.toString().padStart(2, '0'));
            setPeriod(h >= 12 ? 'PM' : 'AM');
        }
    }, [value]);

    const updateTime = (newHour: number, newMinute: string, newPeriod: string) => {
        let h = newHour;
        if (newPeriod === 'PM' && h !== 12) h += 12;
        if (newPeriod === 'AM' && h === 12) h = 0;

        const timeString = `${h.toString().padStart(2, '0')}:${newMinute}`;
        onChange(timeString);
    };

    // We will implement simple click-to-select for reliability, but presented as a scrollable list.

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={pickerRef} className="absolute top-full mt-2 left-0 z-50 bg-[#2a2d3e] border border-gray-700 rounded-xl shadow-2xl p-4 w-64 animate-fade-in">
            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Time</span>
                <button onClick={onClose} className="text-xs text-palette-300 hover:text-white">Done</button>
            </div>
            <div className="flex gap-2 h-48">
                {/* Hours */}
                <div className="flex-1 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/20 rounded-lg">
                    <div className="h-16"></div> {/* Spacer */}
                    {HOURS.map((h) => (
                        <div
                            key={h}
                            onClick={() => { setHour(h); updateTime(h, minute, period); }}
                            className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-colors ${hour === h ? 'text-white font-bold bg-white/10' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {h}
                        </div>
                    ))}
                    <div className="h-16"></div> {/* Spacer */}
                </div>

                {/* Minutes */}
                <div className="flex-1 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/20 rounded-lg">
                    <div className="h-16"></div>
                    {MINUTES.map((m) => (
                        <div
                            key={m}
                            onClick={() => { setMinute(m); updateTime(hour, m, period); }}
                            className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-colors ${minute === m ? 'text-white font-bold bg-white/10' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {m}
                        </div>
                    ))}
                    <div className="h-16"></div>
                </div>

                {/* AM/PM */}
                <div className="flex-1 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/20 rounded-lg">
                    <div className="h-16"></div>
                    {AM_PM.map((p) => (
                        <div
                            key={p}
                            onClick={() => { setPeriod(p); updateTime(hour, minute, p); }}
                            className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-colors ${period === p ? 'text-white font-bold bg-white/10' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {p}
                        </div>
                    ))}
                    <div className="h-16"></div>
                </div>
            </div>


        </div>
    );
}
