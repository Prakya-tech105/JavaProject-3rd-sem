import { useState, useEffect } from 'react';
import type { Task } from '../services/TaskService';

interface AboutMeProps {
    userName: string;
    setUserName: (name: string) => void;
    tasks: Task[];
}

interface Goal {
    id: string;
    text: string;
    isAchievement: boolean;
}

export default function AboutMe({ userName, setUserName, tasks }: AboutMeProps) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoal, setNewGoal] = useState('');
    const [isAddingGoal, setIsAddingGoal] = useState(false);

    // Load goals from localStorage
    useEffect(() => {
        const savedGoals = localStorage.getItem('userGoals');
        if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
        } else {
            // Initial dummy goals
            const initialGoals = [
                { id: '1', text: 'Run a 5k marathon', isAchievement: false },
                { id: '2', text: 'Started MyPlanner journey!', isAchievement: true },
            ];
            setGoals(initialGoals);
            localStorage.setItem('userGoals', JSON.stringify(initialGoals));
        }
    }, []);

    const saveGoals = (updatedGoals: Goal[]) => {
        setGoals(updatedGoals);
        localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    };

    const addGoal = () => {
        if (!newGoal.trim()) return;
        const goal: Goal = {
            id: Date.now().toString(),
            text: newGoal,
            isAchievement: false
        };
        saveGoals([...goals, goal]);
        setNewGoal('');
        setIsAddingGoal(false);
    };

    const toggleAchievement = (id: string) => {
        const updated = goals.map(g =>
            g.id === id ? { ...g, isAchievement: !g.isAchievement } : g
        );
        saveGoals(updated);
    };

    const deleteGoal = (id: string) => {
        saveGoals(goals.filter(g => g.id !== id));
    };

    // Calculate Streak
    const calculateStreak = () => {
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED' && t.updatedAt);
        if (completedTasks.length === 0) return 0;

        const dates = [...new Set(completedTasks.map(t => t.updatedAt!.split('T')[0]))].sort((a, b) => b.localeCompare(a));

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (dates[0] !== today && dates[0] !== yesterday) return 0;

        let streak = 0;
        let currentDate = dates[0] === today ? today : dates[0];

        for (let i = 0; i < dates.length; i++) {
            const expectedDate = new Date(new Date(currentDate).getTime() - i * 86400000).toISOString().split('T')[0];
            if (dates.includes(expectedDate)) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const streak = calculateStreak();

    // Analytics Calculation
    const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingCount = tasks.filter(t => t.status !== 'COMPLETED').length;
    const total = tasks.length || 1;
    const completionRate = Math.round((completedCount / total) * 100);

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* 1. Profile Section & Name Input */}
            <div className="bg-[#23263a] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-palette-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-palette-300 to-palette-500 p-1 shadow-lg shadow-palette-400/20">
                        <div className="w-full h-full rounded-full bg-[#1a1c23] flex items-center justify-center overflow-hidden">
                            <span className="text-5xl">👤</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4 w-full">
                        <div>
                            <p className="text-palette-200 font-bold text-xs uppercase tracking-widest mb-1">Display Name</p>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    localStorage.setItem('userName', e.target.value);
                                }}
                                placeholder="Tell us your name..."
                                className="bg-transparent text-4xl md:text-5xl font-bold text-white focus:outline-none focus:ring-b-2 focus:ring-palette-400 border-b-2 border-transparent hover:border-white/10 transition-all w-full md:w-auto"
                            />
                        </div>
                        <p className="text-gray-400 px-1">Welcome to your personal productivity dashboard. Keep crushing it!</p>
                    </div>
                </div>
            </div>

            {/* 2. Streak & Analytics Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Daily Streak Bar */}
                <div className="bg-[#23263a] rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Daily Streak</h3>
                        <div className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
                            HOT STREAK 🔥
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-end gap-3">
                            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500 leading-none">
                                {streak}
                            </span>
                            <span className="text-xl font-bold text-gray-400 pb-2">days</span>
                        </div>

                        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 shadow-lg shadow-orange-500/20"
                                style={{ width: `${Math.min((streak / 30) * 100 + 5, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500">
                            {streak === 0 ? "Finish a task today to start your streak!" : `Next milestone: ${streak < 7 ? '7' : streak < 30 ? '30' : '100'} days`}
                        </p>
                    </div>
                </div>

                {/* Analytics Snapshot */}
                <div className="bg-[#23263a] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Task Analytics</h3>

                    <div className="flex items-center gap-8">
                        {/* Circular Progress (Simple CSS/SVG) */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-800" strokeWidth="3"></circle>
                                <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    className="stroke-palette-400 transition-all duration-1000 ease-out"
                                    strokeWidth="3"
                                    strokeDasharray={`${completionRate}, 100`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 18 18)"
                                ></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">{completionRate}%</span>
                                <span className="text-[10px] text-gray-500 font-bold">DONE</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-palette-400"></div>
                                    <span className="text-gray-400">Completed</span>
                                </div>
                                <span className="font-bold text-white">{completedCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                    <span className="text-gray-400">Pending</span>
                                </div>
                                <span className="font-bold text-white">{pendingCount}</span>
                            </div>
                            <div className="h-px bg-white/5 pt-2"></div>
                            <p className="text-xs text-palette-200 italic font-medium">
                                "{completionRate > 50 ? 'You are ahead of schedule!' : 'Consistency is the key.'}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Goal Pin Board */}
            <div className="bg-[#fff9ed] rounded-[3rem] p-10 border-4 border-white shadow-2xl relative overflow-hidden transform md:-rotate-1">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-400 shadow-inner border-2 border-red-600/20"></div>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-caveat font-bold text-gray-800 tracking-wide">Vision Board</h2>
                        <button
                            onClick={() => setIsAddingGoal(true)}
                            className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-black/20"
                        >
                            <span className="text-xl">+</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.length === 0 && (
                            <div className="col-span-full py-10 text-center text-gray-400 italic">
                                Use the + button to pin your first goal!
                            </div>
                        )}

                        {goals.map(goal => (
                            <div
                                key={goal.id}
                                className={`group relative p-6 rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer ${goal.isAchievement
                                    ? 'bg-blue-100 border-2 border-blue-200 rotate-1'
                                    : 'bg-white border-2 border-gray-100 -rotate-1'
                                    }`}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    ×
                                </button>

                                <div className="flex flex-col h-full" onClick={() => toggleAchievement(goal.id)}>
                                    <div className="text-2xl mb-3">{goal.isAchievement ? '🏆' : '🎯'}</div>
                                    <p className={`font-handwriting text-xl leading-snug flex-1 ${goal.isAchievement ? 'text-blue-900 line-through' : 'text-gray-800'}`}>
                                        {goal.text}
                                    </p>
                                    <span className={`text-[10px] mt-4 font-bold uppercase tracking-widest ${goal.isAchievement ? 'text-blue-400' : 'text-gray-300'}`}>
                                        {goal.isAchievement ? 'ACHIEVEMENT UNLOCKED' : 'FUTURE GOAL'}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isAddingGoal && (
                            <div className="p-6 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-300 animate-pulse">
                                <textarea
                                    autoFocus
                                    placeholder="I want to..."
                                    className="w-full bg-transparent font-handwriting text-xl outline-none resize-none h-24 text-gray-600"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); addGoal(); }
                                        if (e.key === 'Escape') setIsAddingGoal(false);
                                    }}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={addGoal}
                                        className="text-[10px] font-bold bg-gray-800 text-white px-3 py-1 rounded-full"
                                    >
                                        PIN IT
                                    </button>
                                    <button
                                        onClick={() => setIsAddingGoal(false)}
                                        className="text-[10px] font-bold text-gray-400"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-6 w-24 h-10 bg-white/40 border border-white/60 -rotate-12 backdrop-blur-sm shadow-sm flex items-center justify-center font-caveat font-bold text-gray-400">
                    Dream Big
                </div>
            </div>
        </div>
    );
}
