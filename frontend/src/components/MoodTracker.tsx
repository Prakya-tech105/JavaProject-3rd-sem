import { useState, useEffect } from 'react';

// Types
type Mood = 'AMAZING' | 'GOOD' | 'NEUTRAL' | 'TIRED' | 'STRESSED' | null;
type DailyReflection = {
    date: string; // ISO Date String YYYY-MM-DD
    mood: Mood;
    grateful: string;
    lookingForward: string;
};

// Icons
const MoodIcons = {
    AMAZING: '🤩',
    GOOD: '😊',
    NEUTRAL: '😐',
    TIRED: '😴',
    STRESSED: '😫',
    ADD: '+',
};

export default function MoodTracker() {
    const [reflections, setReflections] = useState<DailyReflection[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [currentReflection, setCurrentReflection] = useState<DailyReflection>({
        date: new Date().toISOString().split('T')[0],
        mood: null,
        grateful: '',
        lookingForward: '',
    });

    // Generate current week dates (Sun-Sat)
    const getWeekDates = () => {
        const today = new Date();
        const day = today.getDay(); // 0 is Sunday
        const diff = today.getDate() - day; // adjust when day is sunday

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(diff + i);
            weekDates.push(d);
        }
        return weekDates;
    };

    const weekDates = getWeekDates();

    useEffect(() => {
        // Load data from local storage
        const stored = localStorage.getItem('dailyReflections');
        if (stored) {
            setReflections(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        // Update current reflection state when selectedDate changes or reflections load
        const found = reflections.find(r => r.date === selectedDate);
        if (found) {
            setCurrentReflection(found);
        } else {
            setCurrentReflection({
                date: selectedDate,
                mood: null,
                grateful: '',
                lookingForward: '',
            });
        }
    }, [selectedDate, reflections]);

    const saveReflection = (updatedData: Partial<DailyReflection>) => {
        const newData = { ...currentReflection, ...updatedData };
        setCurrentReflection(newData);

        const newReflections = reflections.filter(r => r.date !== selectedDate);
        newReflections.push(newData);

        setReflections(newReflections);
        localStorage.setItem('dailyReflections', JSON.stringify(newReflections));
    };

    const isToday = (d: Date) => d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
    const isSelected = (d: Date) => d.toISOString().split('T')[0] === selectedDate;

    // Get mood for a specific date to show in weekly view
    const getMoodForDate = (dateStr: string) => {
        return reflections.find(r => r.date === dateStr)?.mood;
    };

    return (
        <div className="bg-[#23263a] rounded-[2.5rem] p-8 border border-white/5 animate-fade-in space-y-8 relative overflow-hidden">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Weekly Mood</h2>
                <p className="text-gray-400 text-sm">Track your vibe and gratitude.</p>
            </div>

            {/* Weekly Selector */}
            <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const mood = getMoodForDate(dateStr);
                    const selected = isSelected(date);
                    const today = isToday(date);

                    return (
                        <button
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all duration-300 group
                                ${selected
                                    ? 'bg-palette-400/20 border-palette-400 text-palette-300 scale-105 shadow-lg shadow-palette-400/10'
                                    : 'bg-[#1a1c23]/50 border-transparent hover:bg-white/5 hover:border-white/10 text-gray-500'
                                }
                            `}
                        >
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${today ? 'text-palette-300' : ''}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${mood ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>
                                {mood ? MoodIcons[mood] : (
                                    <span className="text-gray-600 text-lg">+</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Daily Input Section */}
            <div className="space-y-6">

                {/* Mood Selector for Selected Day */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-400 block">
                        How was your day on <span className="text-white">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>?
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {(Object.keys(MoodIcons) as Array<keyof typeof MoodIcons>).filter(k => k !== 'ADD').map((m) => (
                            <button
                                key={m}
                                onClick={() => saveReflection({ mood: m as Mood })}
                                className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${currentReflection.mood === m
                                    ? 'bg-palette-400 text-white border-palette-400 shadow-lg shadow-palette-400/20'
                                    : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:bg-gray-800 hover:text-gray-200'
                                    }`}
                            >
                                <span>{MoodIcons[m]}</span>
                                <span className="text-xs font-medium capitalize">{m.toLowerCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reflection Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-palette-300">Gratitude</label>
                        <textarea
                            value={currentReflection.grateful}
                            onChange={(e) => saveReflection({ grateful: e.target.value })}
                            placeholder="I'm grateful for..."
                            className="w-full bg-[#1a1c23]/50 rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-palette-400/50 border border-transparent focus:border-palette-400/30 resize-none h-24 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-purple-400">Looking Forward</label>
                        <textarea
                            value={currentReflection.lookingForward}
                            onChange={(e) => saveReflection({ lookingForward: e.target.value })}
                            placeholder="Tomorrow I will..."
                            className="w-full bg-[#1a1c23]/50 rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-400/50 border border-transparent focus:border-purple-400/30 resize-none h-24 transition-all"
                        />
                    </div>
                </div>

            </div>

        </div>
    );
}
