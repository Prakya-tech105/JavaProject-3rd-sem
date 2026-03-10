import { useState } from 'react';
import type { Task } from '../services/TaskService';

interface CalendarViewProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
}

type ViewType = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'SCHEDULE';

const Icons = {
    ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>,
    ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>,
    Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
};

export default function CalendarView({ tasks, onEditTask }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewType>('MONTH');

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevDate = () => {
        const d = new Date(currentDate);
        if (view === 'DAY') d.setDate(d.getDate() - 1);
        else if (view === 'WEEK') d.setDate(d.getDate() - 7);
        else if (view === 'MONTH') d.setMonth(d.getMonth() - 1);
        else if (view === 'YEAR') d.setFullYear(d.getFullYear() - 1);
        setCurrentDate(d);
    };

    const nextDate = () => {
        const d = new Date(currentDate);
        if (view === 'DAY') d.setDate(d.getDate() + 1);
        else if (view === 'WEEK') d.setDate(d.getDate() + 7);
        else if (view === 'MONTH') d.setMonth(d.getMonth() + 1);
        else if (view === 'YEAR') d.setFullYear(d.getFullYear() + 1);
        setCurrentDate(d);
    };

    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
        });
    };

    const renderMonthView = () => {
        const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
        const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        return (
            <div className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr overflow-y-auto custom-scrollbar pr-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[80px] bg-gray-900/10 rounded-lg border border-transparent"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(year, month, day);
                        const dayTasks = getTasksForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div key={day} className={`min-h-[80px] p-2 rounded-xl border transition-all hover:bg-gray-800/30 flex flex-col gap-1 overflow-hidden ${isToday ? 'bg-palette-400/5 border-palette-400/50' : 'bg-[#1a1c23]/50 border-gray-800'}`}>
                                <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-palette-400 text-white' : 'text-gray-500'}`}>
                                    {day}
                                </div>
                                <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
                                    {dayTasks.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => onEditTask(t)}
                                            className="text-[9px] px-1.5 py-0.5 rounded border border-gray-700 bg-gray-800/50 text-gray-300 truncate font-medium cursor-pointer hover:border-palette-400 hover:text-white transition-colors"
                                            title={t.title}
                                        >
                                            {t.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        return (
            <div className="flex-1 flex gap-2 min-h-0 overflow-x-auto pb-2 custom-scrollbar">
                {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date(startOfWeek);
                    date.setDate(startOfWeek.getDate() + i);
                    const dayTasks = getTasksForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <div key={i} className="flex-1 min-w-[140px] flex flex-col bg-[#1a1c23]/50 border border-gray-800 rounded-2xl p-3 h-full">
                            <div className="text-center mb-4 pb-2 border-b border-gray-800">
                                <p className="text-[10px] font-bold text-gray-500 uppercase">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</p>
                                <p className={`text-lg font-bold ${isToday ? 'text-palette-300' : 'text-gray-200'}`}>{date.getDate()}</p>
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                {dayTasks.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => onEditTask(t)}
                                        className={`p-2 rounded-xl border text-[10px] font-medium cursor-pointer hover:scale-[1.02] transition-transform ${t.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/20 text-red-400' : t.priority === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
                                    >
                                        <div className="flex items-center gap-1 mb-1 opacity-70">
                                            <Icons.Clock />
                                            <span>{t.startTime || 'All day'}</span>
                                        </div>
                                        <p className="truncate font-bold text-white">{t.title}</p>
                                    </div>
                                ))}
                                {dayTasks.length === 0 && (
                                    <div className="h-full flex items-center justify-center opacity-10 saturate-0 grayscale">
                                        <Icons.Calendar />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const hours = Array.from({ length: 24 }).map((_, i) => i);
        const dayTasks = getTasksForDate(currentDate);

        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                <div className="relative border-l border-gray-800 ml-16 space-y-4 pt-4">
                    {hours.map(h => {
                        const timeStr = `${h % 12 || 12}${h < 12 ? ' AM' : ' PM'}`;
                        const hourTasks = dayTasks.filter(t => {
                            if (!t.startTime) return false;
                            const [taskH] = t.startTime.split(':');
                            return parseInt(taskH) === h;
                        });

                        return (
                            <div key={h} className="relative h-16 border-b border-gray-800/10 group">
                                <span className="absolute -left-16 top-0 -translate-y-1/2 text-[10px] font-bold text-gray-500 w-12 text-right">
                                    {timeStr}
                                </span>
                                <div className="ml-4 h-full flex flex-wrap gap-2 py-1">
                                    {hourTasks.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => onEditTask(t)}
                                            className="bg-palette-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-palette-400/20 h-fit cursor-pointer hover:scale-105 transition-transform"
                                        >
                                            {t.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderScheduleView = () => {
        const sortedTasks = [...tasks]
            .filter(t => t.dueDate)
            .sort((a, b) => {
                const dateA = new Date(a.dueDate!).getTime();
                const dateB = new Date(b.dueDate!).getTime();
                if (dateA !== dateB) return dateA - dateB;

                // Secondary sort by time
                const timeA = a.startTime || '00:00';
                const timeB = b.startTime || '00:00';
                return timeA.localeCompare(timeB);
            });

        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {sortedTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                        <div className="p-4 bg-gray-800 rounded-full scale-150 mb-2"><Icons.Calendar /></div>
                        <p className="font-medium">No scheduled tasks yet</p>
                    </div>
                ) : (
                    sortedTasks.map(t => {
                        const d = new Date(t.dueDate!);
                        return (
                            <div key={t.id} className="flex gap-4 items-start group">
                                <div className="w-16 pt-1">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">{d.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                    <p className="text-lg font-black text-white">{d.getDate()}</p>
                                    <p className="text-[8px] font-bold text-palette-300 uppercase">{d.toLocaleDateString(undefined, { month: 'short' })}</p>
                                </div>
                                <div
                                    onClick={() => onEditTask(t)}
                                    className="flex-1 bg-[#1a1c23]/50 border border-gray-800/50 p-4 rounded-2xl cursor-pointer hover:border-palette-400/30 transition-all flex items-center justify-between shadow-sm"
                                >
                                    <div>
                                        <div className="flex gap-2 items-center mb-1">
                                            <span className={`w-2 h-2 rounded-full ${t.priority === 'HIGH' ? 'bg-red-500' : t.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                            <span className="text-[10px] font-bold text-gray-500">{t.timeOfDay} • {t.duration}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-100">{t.title}</h4>
                                        {t.description && <p className="text-xs text-gray-500 truncate max-w-sm mt-1">{t.description}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-palette-200">{t.startTime || '---'}</p>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{t.category}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        );
    };

    const renderYearView = () => {
        return (
            <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar p-1">
                {monthNames.map((m, i) => {
                    const monthTasks = tasks.filter(t => {
                        if (!t.dueDate) return false;
                        const td = new Date(t.dueDate);
                        return td.getMonth() === i && td.getFullYear() === year;
                    });

                    return (
                        <div key={m} className={`bg-[#1a1c23]/30 p-3 rounded-2xl border border-gray-800 transition-all hover:bg-palette-400/5 hover:border-palette-400/20 group ${i === month ? 'ring-1 ring-palette-400/30 border-palette-400/30' : ''}`}>
                            <div className="flex justify-between items-center mb-2">
                                <h5 className={`text-sm font-bold ${i === month ? 'text-palette-300' : 'text-gray-400 group-hover:text-gray-200'}`}>{m}</h5>
                                {monthTasks.length > 0 && <span className="text-[8px] bg-palette-400 text-white px-1.5 py-0.5 rounded-full font-black">{monthTasks.length}</span>}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5 opacity-50">
                                {Array.from({ length: 31 }).map((_, d) => (
                                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderHeader = () => {
        let title = "";
        if (view === 'DAY') title = `${currentDate.getDate()} ${monthNames[month]} ${year}`;
        else if (view === 'WEEK') {
            const end = new Date(currentDate);
            end.setDate(currentDate.getDate() + 6);
            title = `${monthNames[month]} ${currentDate.getFullYear()}`;
        }
        else if (view === 'MONTH') title = `${monthNames[month]} ${year}`;
        else if (view === 'YEAR') title = `${year}`;
        else if (view === 'SCHEDULE') title = `Upcoming Tasks`;

        return (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center bg-[#1a1c23]/80 p-1.5 rounded-2xl border border-gray-800 backdrop-blur-md shadow-inner">
                    {(['DAY', 'WEEK', 'MONTH', 'YEAR', 'SCHEDULE'] as ViewType[]).map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${view === v
                                ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/25 scale-105'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={prevDate} className="p-2.5 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-gray-700/50 transition-all active:scale-95 shadow-sm">
                        <Icons.ChevronLeft />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-5 py-2.5 bg-palette-400/10 hover:bg-palette-400/20 text-palette-300 text-xs font-black rounded-xl border border-palette-400/30 transition-all active:scale-95 shadow-sm">
                        TODAY
                    </button>
                    <button onClick={nextDate} className="p-2.5 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-gray-700/50 transition-all active:scale-95 shadow-sm">
                        <Icons.ChevronRight />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#23263a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl h-[calc(100vh-160px)] min-h-[600px] flex flex-col animate-fade-in relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-palette-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {renderHeader()}

            <div className="flex-1 min-h-0 flex flex-col animate-fade-in">
                {view === 'MONTH' && renderMonthView()}
                {view === 'WEEK' && renderWeekView()}
                {view === 'DAY' && renderDayView()}
                {view === 'YEAR' && renderYearView()}
                {view === 'SCHEDULE' && renderScheduleView()}
            </div>
        </div>
    );
}

