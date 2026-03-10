import { useState, useEffect } from 'react';

export default function FocusTimer() {
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
    };

    const switchMode = (newMode: 'FOCUS' | 'BREAK') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
    };

    const handleDurationSelect = (mins: number) => {
        setIsActive(false);
        if (mode === 'FOCUS') {
            setFocusDuration(mins);
        } else {
            setBreakDuration(mins);
        }
        setTimeLeft(mins * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalTime = mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div className="bg-[#23263a] rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col items-center justify-center animate-fade-in relative overflow-hidden min-h-[500px]">
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000 ${mode === 'FOCUS' ? 'bg-gradient-to-br from-palette-400/20 to-transparent' : 'bg-gradient-to-br from-emerald-500/20 to-transparent'
                }`}></div>

            <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md">
                {/* Mode Switcher */}
                <div className="flex bg-gray-900/50 p-1.5 rounded-full border border-gray-800">
                    <button
                        onClick={() => switchMode('FOCUS')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'FOCUS' ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/20' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => switchMode('BREAK')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'BREAK' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Break
                    </button>
                </div>

                {/* Duration Select */}
                {/* Duration Select */}
                {mode === 'FOCUS' ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">Set Duration (Minutes)</div>
                        <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                            {/* Manual Input */}
                            <input
                                type="number"
                                min="1"
                                max="180"
                                value={focusDuration}
                                onChange={(e) => handleDurationSelect(Math.max(1, Math.min(180, parseInt(e.target.value) || 25)))}
                                className="w-16 bg-gray-800 text-white text-center font-bold text-xl rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-palette-400 border border-gray-700"
                            />

                            {/* Scroll Picker (Simplified as horizontal slider for usability in web) */}
                            <div className="h-10 w-px bg-gray-700"></div>

                            <div className="flex gap-1 overflow-x-auto max-w-[200px] scrollbar-hide snap-x">
                                {[15, 20, 25, 30, 45, 60, 90].map((mins) => (
                                    <button
                                        key={mins}
                                        onClick={() => handleDurationSelect(mins)}
                                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all snap-center ${focusDuration === mins
                                                ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/20'
                                                : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        {mins}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {[5, 10, 15, 20].map((mins) => (
                            <button
                                key={mins}
                                onClick={() => handleDurationSelect(mins)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${breakDuration === mins
                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                        : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-600 bg-gray-800/30'
                                    }`}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>
                )}

                {/* Timer Display */}
                <div className="relative group cursor-pointer" onClick={toggleTimer}>
                    {/* Ring SVG */}
                    <div className="w-64 h-64 relative">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Track */}
                            <circle
                                cx="50%" cy="50%" r="120"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-800"
                            />
                            {/* Progress */}
                            <circle
                                cx="50%" cy="50%" r="120"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ease-linear ${mode === 'FOCUS' ? 'text-palette-400' : 'text-emerald-500'
                                    }`}
                            />
                        </svg>

                        {/* Time Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-bold font-mono tracking-wider text-white">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-sm uppercase tracking-widest text-gray-500 mt-2 font-medium">
                                {isActive ? 'Running' : 'Paused'}
                            </span>
                        </div>
                    </div>

                    {/* Hover Play/Pause Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full backdrop-blur-[2px]">
                        {isActive ? (
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/20 pl-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${isActive
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : (mode === 'FOCUS' ? 'bg-palette-400 hover:bg-palette-300 shadow-palette-400/20' : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20')
                            }`}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
