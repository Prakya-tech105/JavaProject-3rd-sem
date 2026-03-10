import { useEffect, useState, useRef } from 'react';
import type { Task } from './services/TaskService';
import { getAllTasks, createTask, deleteTask, updateTask, checkConnection } from './services/TaskService';
import CalendarView from './components/CalendarView';
import FocusTimer from './components/FocusTimer';
import AboutMe from './components/AboutMe';
import MoodTracker from './components/MoodTracker';
import PinBoard from './components/PinBoard';
import TimePicker from './components/TimePicker';

// Simple Icons as components
const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  ),
  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="23" /><line x1="8" x2="16" y1="23" y2="23" /></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
  ),
  ClipboardList: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
  ),
  Sunset: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10V2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M12 22v-2" /></svg>
  ),
  Layers: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  Zap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Layout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
  ),
  PlusCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
  ),
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(['Personal', 'Academics', 'Work']);

  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TO_DO',
    category: 'Personal',
    timeOfDay: 'Anytime',
    isAllDay: false,
    duration: '15m',
    subTasks: [],
    startTime: '09:00',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Edit & Filter State
  // Filter State
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [view, setView] = useState<'HOME' | 'TASKS' | 'CALENDAR' | 'FOCUS' | 'ABOUT'>('HOME');

  // User State
  const [userName, setUserName] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const [tempSubTask, setTempSubTask] = useState('');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const formatTimeDisplay = (time24?: string) => {
    if (!time24) return 'Set time';
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      setIsNameModalOpen(true);
    } else {
      setUserName(storedName);
    }
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh when back online
  useEffect(() => {
    if (isConnected) {
      loadTasks();
    }
  }, [isConnected]);

  const checkStatus = async () => {
    const connected = await checkConnection();
    setIsConnected(connected);
  };

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      // Sort tasks by date and time
      const sorted = [...data].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
      setTasks(sorted);

      // Extract unique categories from existing tasks and merge with defaults
      const existingCategories = data
        .map(t => t.category)
        .filter((c): c is string => !!c); // Filter out undefined/null

      setCategories(prev => Array.from(new Set([...prev, ...existingCategories])));
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  const isFormValid = newTask.title.trim().length > 0;

  /* Updated handleCreate with better debugging and event handling */
  /* Updated handleCreate to handle both Create and Update */
  const handleSaveTask = async (e?: React.MouseEvent) => {
    e?.preventDefault(); // Prevent any default behavior
    e?.stopPropagation();

    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      if (newTask.id) {
        // UPDATE Existing Task
        console.log("Updating task...", newTask);
        const updatedTask = await updateTask(newTask.id, newTask);
        if (!updatedTask) throw new Error("No response from server");

        setTasks(prev => prev.map(t => t.id === newTask.id ? updatedTask : t));
        console.log("Task updated:", updatedTask);
      } else {
        // CREATE New Task
        console.log("Creating task...", newTask);
        const createdTask = await createTask(newTask);

        if (!createdTask) throw new Error("No response from server");

        console.log("Task created:", createdTask);

        // If a new custom category was used, ensure it remains in the list
        if (newTask.category && !categories.includes(newTask.category)) {
          setCategories(prev => [...prev, newTask.category!]);
        }

        // Use functional update to ensure we have the latest state
        setTasks(prev => {
          // Check if task already exists (fallback for rapid clicks)
          const exists = prev.some(t => t.id === createdTask.id);
          if (exists) return prev.map(t => t.id === createdTask.id ? createdTask : t);
          return [...prev, createdTask];
        });
      }

      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TO_DO',
        category: categories[0] || 'Personal',
        timeOfDay: 'Anytime',
        isAllDay: false,
        duration: '15m',
        subTasks: [],
        startTime: '09:00',
        dueDate: new Date().toISOString().split('T')[0]
      });

      setIsAddModalOpen(false);
      // Force reload to ensure sync
      loadTasks();
    } catch (error) {
      console.error("Error saving task", error);
      // Removed alert as per user request for a smoother experience once fixed
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser does not support speech recognition.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsAddModalOpen(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNewTask(prev => ({ ...prev, title: transcript }));
      setIsListening(false);
      // setTimeout(() => inputRef.current?.focus(), 100);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const openManual = () => {
    setIsAddModalOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  const handleToggleComplete = async (task: Task) => {
    if (!task.id) return;
    const newStatus = task.status === 'COMPLETED' ? 'TO_DO' : 'COMPLETED';
    try {
      const updated = await updateTask(task.id, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const startEditing = (task: Task) => {
    setNewTask({ ...task });
    setIsAddModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="flex min-h-screen bg-[#1a1c23] text-gray-100 font-sans selection:bg-palette-300/30">
      {/* Sidebar - Soft Design */}
      {/* Sidebar - Reference Style Redesign */}
      <aside className="w-72 bg-[#1a1c23] flex flex-col p-6 hidden md:flex sticky top-0 h-screen border-r border-white/5">

        {/* Logo Area */}
        <div className="flex items-center gap-3 mb-10 px-2 animate-fade-in">
          <div className="w-10 h-10 bg-gradient-to-tr from-palette-300 to-palette-500 rounded-xl flex items-center justify-center shadow-lg shadow-palette-400/20">
            <Icons.CheckCircle />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">MyPlanner</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 font-medium">Daily organized</p>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-500`} title={isConnected ? "Online" : "Offline"}></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">

          <button
            onClick={() => { setView('HOME'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${view === 'HOME'
              ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/25'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <span className={`${view === 'HOME' ? '' : 'group-hover:scale-110 transition-transform'}`}><Icons.Home /></span>
            <span className="font-medium">Home</span>
            {view === 'HOME' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
          </button>

          <button
            onClick={() => setView('CALENDAR')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${view === 'CALENDAR'
              ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/25'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <span className={`${view === 'CALENDAR' ? '' : 'group-hover:scale-110 transition-transform'}`}><Icons.Calendar /></span>
            <span className="font-medium">Planner</span>
            {view === 'CALENDAR' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
          </button>

          <button
            onClick={() => setView('FOCUS')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${view === 'FOCUS'
              ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/25'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <span className={`${view === 'FOCUS' ? '' : 'group-hover:scale-110 transition-transform'}`}><Icons.Zap /></span>
            <span className="font-medium">Focus Timer</span>
            {view === 'FOCUS' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
          </button>

          <div className="h-px bg-white/5 my-4 mx-4"></div>

          <button
            onClick={() => { setView('TASKS'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${view === 'TASKS'
              ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/25'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <span className={`${view === 'TASKS' ? '' : 'group-hover:scale-110 transition-transform'}`}><Icons.ClipboardList /></span>
            <span className="font-medium">Task Manager</span>
            {view === 'TASKS' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
          </button>

          <button
            onClick={() => setView('ABOUT')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${view === 'ABOUT'
              ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/25'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <span className={`${view === 'ABOUT' ? '' : 'group-hover:scale-110 transition-transform'}`}><Icons.User /></span>
            <span className="font-medium">About Me</span>
            {view === 'ABOUT' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
          </button>

        </nav>

        {/* Footer Card */}
        <div className="mt-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#2a2d3e] to-[#23263a] p-5 border border-white/5 group ring-1 ring-white/5">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icons.Layers />
            </div>
            <p className="text-xs text-palette-200 font-bold mb-1 uppercase tracking-wider">Pro Tip</p>
            <p className="text-sm text-gray-400 leading-snug">"Review your goals every morning."</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto space-y-8">

          {!isConnected && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3 text-red-400">
                <Icons.Zap /> {/* Using existing icon for now, or could use alert icon if available */}
                <span className="font-medium">Backend not connected. Working in offline mode.</span>
              </div>
              <button
                onClick={checkStatus}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium rounded-lg transition-colors"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Top Action Bar (ONLY Viewable in TASKS) */}
          {view === 'TASKS' && (
            <div className="flex justify-end items-center mb-2 animate-fade-in">
              <div className="flex items-center bg-gray-800/50 p-1 rounded-full border border-gray-700/50 backdrop-blur-sm">
                <button
                  onClick={openManual}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-palette-400 to-palette-300 rounded-full text-white font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-palette-400/20"
                >
                  <Icons.Plus />
                  <span className="hidden sm:inline">Add Task</span>
                </button>
                <div className="w-[1px] h-6 bg-gray-700/50 mx-1"></div>
                <button
                  onClick={startListening}
                  className={`p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all ${isListening ? 'text-red-400 animate-pulse bg-red-400/10' : ''}`}
                  title="Voice Add"
                >
                  <Icons.Mic />
                </button>
              </div>
            </div>
          )}

          {/* User Greeting Bubble (Visible on HOME) */}
          {view === 'HOME' && (

            <>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-[#23263a] p-8 md:p-10 shadow-2xl shadow-black/20 border border-white/5 group transition-all hover:border-white/10 animate-fade-in">
                {/* Dynamic Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-palette-400/20 via-palette-300/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-palette-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-palette-200 backdrop-blur-md">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
                      Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-palette-100 to-palette-300">{userName || 'Friend'}</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                      You have <span className="text-palette-100 font-semibold">{tasks.filter(t => t.status !== 'COMPLETED').length} tasks</span> waiting for you today.
                    </p>

                    <div className="mt-8">
                      <button onClick={() => setView('TASKS')} className="flex items-center gap-2 text-palette-300 font-medium hover:text-white transition-colors group/link">
                        <span>Go to Task Manager</span>
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>

                  {/* Accent Illustration */}
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-gradient-to-tr from-palette-300/20 to-palette-100/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner group-hover:rotate-6 transition-transform duration-500">
                      <span className="text-5xl drop-shadow-lg filter">🌤️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
                {/* Pin Board Widget (Left) */}
                <div className="col-span-1 h-full min-h-[300px]">
                  <PinBoard tasks={tasks} />
                </div>

                {/* Weekly Mood Tracker (Right - Wider) */}
                <div className="col-span-1 md:col-span-2 h-full">
                  <MoodTracker />
                </div>
              </div>
            </>
          )}

          {/* Name Prompt Modal */}
          {isNameModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#23263a] w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-palette-300/20 text-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-palette-400 to-palette-300 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-palette-400/30">
                  <span className="text-2xl">👋</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
                <p className="text-gray-400 mb-6">What should we call you?</p>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-palette-400 mb-6 transition-all"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userName.trim()) {
                      localStorage.setItem('userName', userName);
                      setIsNameModalOpen(false);
                    }
                  }}
                />

                <button
                  onClick={() => {
                    if (userName.trim()) {
                      localStorage.setItem('userName', userName);
                      setIsNameModalOpen(false);
                    }
                  }}
                  disabled={!userName.trim()}
                  className="w-full py-3 bg-palette-400 hover:bg-palette-300 text-white rounded-xl font-semibold shadow-lg shadow-palette-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}

          {/* Input Section - Removed in favor of Modal, but we put the Modal Render Here or at end */}

          {/* Add Task Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#23263a] w-full max-w-md rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">{newTask.id ? 'Edit Task' : 'Add Task'}</h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                  >
                    <Icons.X />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

                  {/* Title Input */}
                  <div>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Do laundry..."
                      className="bg-transparent text-2xl font-semibold w-full focus:outline-none placeholder-gray-600 text-white"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>

                  {/* Date Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-400">Due Date</label>
                    <input
                      type="date"
                      className="bg-gray-800/30 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-palette-400 transition-all custom-date-input"
                      value={newTask.dueDate || ''}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>

                  {/* Time of Day */}
                  <div className="grid grid-cols-4 gap-2">
                    {['Anytime', 'Morning', 'Day', 'Evening'].map((time) => {
                      const Icon = time === 'Morning' ? Icons.Sun : time === 'Day' ? Icons.Sunset : time === 'Evening' ? Icons.Moon : Icons.Clock;
                      const isSelected = newTask.timeOfDay === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setNewTask({ ...newTask, timeOfDay: time as any })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${isSelected
                            ? 'bg-white border-white text-black shadow-lg shadow-white/10 scale-105'
                            : 'bg-gray-800/30 border-gray-800 text-gray-400 hover:bg-gray-800'
                            }`}
                        >
                          <Icon />
                          <span className="text-xs font-medium">{time}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Event Type & Duration */}
                  <div className="flex gap-4">
                    <div className="flex p-1 bg-gray-800/50 rounded-xl flex-1 relative z-20">
                      <div className="relative flex-1">
                        <button
                          type="button"
                          onClick={() => !newTask.isAllDay && setIsTimePickerOpen(!isTimePickerOpen)}
                          disabled={newTask.isAllDay}
                          className={`w-full h-full py-2 flex items-center justify-center gap-2 text-xs font-bold rounded-lg transition-all ${!newTask.isAllDay ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-white cursor-not-allowed'}`}
                        >
                          <Icons.Clock className={!newTask.isAllDay ? "w-3 h-3 text-black" : "w-3 h-3"} />
                          <span>{!newTask.isAllDay ? formatTimeDisplay(newTask.startTime) : 'At time'}</span>
                        </button>

                        {isTimePickerOpen && !newTask.isAllDay && (
                          <TimePicker
                            value={newTask.startTime || '09:00'}
                            onChange={(val) => setNewTask({ ...newTask, startTime: val })}
                            onClose={() => setIsTimePickerOpen(false)}
                          />
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setNewTask({ ...newTask, isAllDay: !newTask.isAllDay });
                          if (!newTask.isAllDay) setIsTimePickerOpen(false); // Close if switching to All Day
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newTask.isAllDay ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                      >
                        All day
                      </button>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-white text-black">
                      <Icons.Clock />
                      <select
                        value={newTask.duration}
                        onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                        className="bg-transparent text-sm font-bold text-black focus:outline-none cursor-pointer w-full"
                      >
                        <option value="15m">15m</option>
                        <option value="30m">30m</option>
                        <option value="45m">45m</option>
                        <option value="1h">1h</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Priority</label>
                    <div className="flex gap-2">
                      {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewTask({ ...newTask, priority: p as any })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${newTask.priority === p
                            ? p === 'HIGH' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/10'
                              : p === 'MEDIUM' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/10'
                                : 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10'
                            : 'bg-gray-800/30 border-gray-800 text-gray-500 hover:bg-gray-800'
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-tasks */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-400">Sub-tasks</span>
                    </div>
                    <div className="space-y-2">
                      {newTask.subTasks?.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm bg-gray-800/50 px-3 py-2 rounded-xl border border-gray-700/50">
                          <div className="w-4 h-4 rounded-full border border-gray-500 shrink-0"></div>
                          <input
                            type="text"
                            value={sub}
                            onChange={(e) => {
                              const newSubs = [...(newTask.subTasks || [])];
                              newSubs[idx] = e.target.value;
                              setNewTask({ ...newTask, subTasks: newSubs });
                            }}
                            className="bg-transparent text-gray-200 focus:outline-none w-full"
                          />
                          <button
                            onClick={() => setNewTask({ ...newTask, subTasks: newTask.subTasks?.filter((_, i) => i !== idx) })}
                            className="ml-auto text-gray-500 hover:text-red-400 p-1"
                          >
                            <Icons.X />
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center gap-2 bg-gray-800/30 px-3 py-2 rounded-xl border border-dashed border-gray-700">
                        <Icons.Plus />
                        <input
                          type="text"
                          placeholder="Add sub-task..."
                          className="bg-transparent text-sm focus:outline-none text-white placeholder-gray-500 w-full"
                          value={tempSubTask}
                          onChange={(e) => setTempSubTask(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && tempSubTask.trim()) {
                              setNewTask({ ...newTask, subTasks: [...(newTask.subTasks || []), tempSubTask] });
                              setTempSubTask('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (tempSubTask.trim()) {
                              setNewTask({ ...newTask, subTasks: [...(newTask.subTasks || []), tempSubTask] });
                              setTempSubTask('');
                            }
                          }}
                          className="p-1 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition-colors"
                        >
                          <span className="text-xs font-bold px-1">ADD</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Notes</label>
                    <textarea
                      placeholder="Write your notes here..."
                      className="w-full bg-gray-800/30 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-palette-400/50 resize-none h-24"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-800 flex justify-between items-center bg-[#23263a]">
                  <div className="flex gap-2"></div>
                  <button
                    type="button"
                    onClick={handleSaveTask}
                    disabled={!isFormValid}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${isFormValid
                      ? 'bg-palette-400 hover:bg-palette-300 text-white shadow-palette-400/20'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                  >
                    <span>{newTask.id ? 'Save Changes' : 'Create Task'}</span>
                    <Icons.Check />
                  </button>
                </div>
              </div>
            </div>
          )}


          {view === 'CALENDAR' ? (
            <CalendarView tasks={tasks} onEditTask={startEditing} />
          ) : view === 'FOCUS' ? (
            <FocusTimer />
          ) : view === 'ABOUT' ? (
            <AboutMe userName={userName} setUserName={setUserName} tasks={tasks} />
          ) : view === 'TASKS' ? (
            <>
              {/* Filters */}
              <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar">
                {['ALL', 'TO_DO', 'COMPLETED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${statusFilter === filter
                      ? 'bg-palette-400 text-white shadow-lg shadow-palette-400/20'
                      : 'bg-[#23263a] text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      }`}
                  >
                    {filter === 'ALL' ? 'All Tasks' : filter.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <span className="text-4xl">🎉</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                    <p className="text-gray-500 max-w-sm">
                      You have no pending tasks. Enjoy your free time or start something new!
                    </p>
                    {/* Prompt to add tasks if list is empty */}
                    <button
                      onClick={openManual}
                      className="mt-6 px-6 py-2 bg-gray-800 border border-palette-400/30 text-palette-300 rounded-full hover:bg-gray-700/50 transition-colors"
                    >
                      Let's create one
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group bg-[#23263a] p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 animate-fade-in border-gray-800 hover:border-palette-400/30 hover:shadow-lg hover:shadow-palette-400/5 ${task.status === 'COMPLETED' ? 'opacity-75' : ''}`}
                      >
                        {initialEditing(task)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );

  function initialEditing(task: Task) {

    return (
      <>
        {/* Completion Checkbox */}
        <button
          onClick={() => handleToggleComplete(task)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'COMPLETED'
            ? 'bg-palette-400 border-palette-400 text-white'
            : 'border-gray-600 hover:border-palette-300'
            }`}
        >
          {task.status === 'COMPLETED' && <Icons.CheckCircle />}
          {/* Note: CheckCircle icon is 20x20, might be a bit big for 24x24 box if padding exists, but visual check ok */}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-100 truncate ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm text-gray-400 truncate ${task.status === 'COMPLETED' ? 'line-through text-gray-600' : ''}`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Categories / Priority */}
        <div className="hidden sm:flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-md font-medium border ${task.priority === 'HIGH' ? 'border-red-500/20 text-red-400' :
            task.priority === 'MEDIUM' ? 'border-amber-500/20 text-amber-400' :
              'border-emerald-500/20 text-emerald-400'
            }`}>
            {task.priority}
          </span>
          {task.category && (
            <span className="text-xs px-2 py-1 rounded-md font-medium border border-blue-500/20 text-blue-400 max-w-[100px] truncate">
              {task.category}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => startEditing(task)}
            className="p-2 hover:bg-gray-700/50 text-gray-400 hover:text-palette-300 rounded-lg transition-colors"
            title="Edit Task"
          >
            <Icons.Edit />
          </button>
          <button
            onClick={() => task.id && handleDelete(task.id)}
            className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Icons.Trash />
          </button>
        </div>
      </>
    );
  }
}

export default App;
