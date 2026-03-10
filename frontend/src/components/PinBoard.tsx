import { useState, useEffect } from 'react';
import type { Task } from '../services/TaskService';

interface PinBoardProps {
    tasks: Task[];
}

export default function PinBoard({ tasks }: PinBoardProps) {
    const [isEvening, setIsEvening] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            setIsEvening(hour >= 20); // 8 PM
        };
        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // Helper to format date as YYYY-MM-DD for comparison
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const targetDate = new Date();
    if (isEvening) {
        targetDate.setDate(targetDate.getDate() + 1); // Tomorrow
    }

    const targetDateStr = formatDate(targetDate);

    const filteredTasks = tasks.filter(task => {
        // If task is completed, skip
        if (task.status === 'COMPLETED') return false;

        // Logic: 
        // If task has a dueDate, match strictly.
        // If task has NO dueDate, show it on "Today" (if not evening) but maybe hide for "Tomorrow"?
        // OR: Assume tasks with no date are "Backlog" and maybe don't show on PinBoard unless specifically "Today"?
        // For this widget, let's assume:
        // - If has date => match date.
        // - If no date => show on "Today" only.
        if (task.dueDate) {
            return task.dueDate === targetDateStr;
        } else {
            // No date tasks show today, but not tomorrow
            return !isEvening;
        }
    });

    const getSummary = (title: string) => {
        const words = title.split(' ');
        if (words.length <= 3) return title;
        return words.slice(0, 3).join(' ') + '...';
    };

    return (
        <div className="h-full bg-[#ffecd1] text-[#4a4a4a] rounded-[2.5rem] p-6 shadow-xl border-4 border-white/20 relative overflow-hidden group hover:-rotate-1 transition-transform duration-300">
            {/* Pin graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm border border-black/10 z-20"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-black/20 z-10"></div>

            <div className="mt-4 flex flex-col h-full">
                <h3 className="text-center font-caveat text-xl font-bold uppercase tracking-widest text-red-400/80 mb-4 border-b-2 border-dashed border-red-400/20 pb-2">
                    {isEvening ? "Tomorrow" : "Today"}
                </h3>

                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                    {filteredTasks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <span className="text-2xl mb-2">🍃</span>
                            <p className="font-handwriting text-sm font-semibold">Clear Skies</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <div key={task.id} className="bg-white/60 p-2 rounded-lg shadow-sm border border-white/40 transform hover:scale-105 transition-transform cursor-default">
                                <p className="font-handwriting font-bold text-lg leading-none truncate">
                                    {getSummary(task.title)}
                                </p>
                                {task.timeOfDay && task.timeOfDay !== 'Anytime' && (
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{task.timeOfDay}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Decorative tape */}
            <div className="absolute -top-1 -right-8 w-24 h-8 bg-white/30 rotate-45 backdrop-blur-sm"></div>
        </div>
    );
}
